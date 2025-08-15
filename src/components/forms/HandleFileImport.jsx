// src/components/forms/HandleFileImport.jsx
import * as XLSX from "xlsx";


export default async function handleFileImport(event, {
  setAlert,
  setMovements,
  selectedQuarter,
  taux,
  getQuarterDates
}) {
  const file = event.target.files?.[0];
  if (!file) return;

  // --- Helper functions ---
  const toUTCDate = (input) => {
    if (!input && input !== 0) return null;
    if (input instanceof Date && !isNaN(input)) {
      return new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getDate()));
    }
    if (typeof input === "string") {
      const isoParts = input.split("-");
      if (isoParts.length === 3 && isoParts[0].length === 4) {
        const [y, m, d] = isoParts.map(Number);
        return new Date(Date.UTC(y, m - 1, d));
      }
      const parsed = new Date(input);
      if (!isNaN(parsed)) return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
      const parts = input.split("/");
      if (parts.length === 3) {
        const d = new Date(parts[2], parts[1] - 1, parts[0]);
        if (!isNaN(d)) return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      }
      return null;
    }
    return null;
  };

  const excelSerialToISO = (serial) => {
    if (typeof serial !== "number") return "";
    let s = serial;
    if (s >= 60) s = s - 1; // Excel leap year bug
    const epoch = Date.UTC(1899, 11, 31);
    const ms = Math.round(s * 24 * 60 * 60 * 1000);
    const d = new Date(epoch + ms);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
      .toISOString()
      .split("T")[0];
  };

  const parseExcelDate = (cell) => {
    if (cell == null || cell === "") return "";
    if (cell instanceof Date && !isNaN(cell)) {
      return new Date(Date.UTC(cell.getFullYear(), cell.getMonth(), cell.getDate()))
        .toISOString()
        .split("T")[0];
    }
    if (typeof cell === "number") return excelSerialToISO(cell);
    if (typeof cell === "string") {
      const maybe = new Date(cell);
      if (!isNaN(maybe)) {
        return new Date(Date.UTC(maybe.getFullYear(), maybe.getMonth(), maybe.getDate()))
          .toISOString()
          .split("T")[0];
      }
      const parts = cell.split("/");
      if (parts.length === 3) {
        const d = new Date(parts[2], parts[1] - 1, parts[0]);
        if (!isNaN(d)) return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
          .toISOString()
          .split("T")[0];
      }
    }
    return "";
  };

  const parseExcelNumber = (cell) => {
    if (cell == null || cell === "") return 0;
    if (typeof cell === "number") return cell;
    let s = String(cell).trim();
    if (s.includes(".") && s.includes(",")) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else if (s.includes(",") && !s.includes(".")) {
      s = s.replace(",", ".");
    } else {
      s = s.replace(/\s+/g, "").replace(/[^\d.-]/g, "");
    }
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };

  // --- Main file reading ---
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    if (jsonData.length < 2) {
      setAlert({ type: "error", message: "Le fichier doit contenir au moins une ligne de données en plus de l'en-tête." });
      return;
    }

    const quarterRaw = getQuarterDates(selectedQuarter);
    const quarterStart = toUTCDate(quarterRaw.start) || toUTCDate(quarterRaw.startISO) || toUTCDate(quarterRaw.startString);
    const quarterEnd = toUTCDate(quarterRaw.end) || toUTCDate(quarterRaw.endISO) || toUTCDate(quarterRaw.endString);

    if (!quarterStart || !quarterEnd) {
      setAlert({ type: "error", message: "Impossible de déterminer les bornes du trimestre." });
      return;
    }

    const importedMovements = [];

    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length < 2) continue;

      const dateSaisieStr = parseExcelDate(row[0]);
      const mouvementStr= String(row[1]).replace(/[^\d,.-]/g, '');

      const mouvement =  parseFloat(mouvementStr.replace(',', '.')) || 0;

      let dateValeurStr = parseExcelDate(row[2]);
      if (!dateValeurStr && row[3]) {
        dateValeurStr = parseExcelDate(row[3]);
      }

      const dateValeurObj = new Date(dateValeurStr);
      if (isNaN(dateValeurObj)) continue; // skip invalid date
      {/*const startDate = new Date(quarterData.start.split('/').reverse().join('-')); // "dd/mm/yyyy" → "yyyy-mm-dd"
      const endDate = new Date(quarterData.end.split('/').reverse().join('-'));*/}
        let startDate, endDate;

        if (typeof quarterData.start === 'string') {
          startDate = new Date(quarterData.start.split('/').reverse().join('-'));
          endDate = new Date(quarterData.end.split('/').reverse().join('-'));
        } else {
          startDate = new Date(quarterData.start);
          endDate = new Date(quarterData.end);
        }

      // filter in range
      if (
        mouvement !== 0 &&
        dateValeurObj >= startDate &&
        dateValeurObj <= endDate &&
      (!dateSaisieStr || new Date(dateSaisieStr) <= endDate)

      ) {
        importedMovements.push({
          id: Date.now() + i,
          dateSaisie: dateSaisieStr,
          dateValeur: dateValeurStr,
          mouvement,
          mouvementStr,
          solde: 0,
          ecart: 0,
          tauxApplique: taux,
          interet: 0,
          //formattedMouvement: mouvement.toLocaleString('   fr-FR', {minimumFractionDigits:2})

        });
      }
    }

    if (importedMovements.length === 0) {
      setAlert({ type: "error", message: `Aucun mouvement trouvé dans le trimestre sélectionné (${selectedQuarter}).` });
      return;
    }

    importedMovements.sort((a, b) => {
      const da = new Date(a.dateSaisie || a.dateValeur);
      const db = new Date(b.dateSaisie || b.dateValeur);
      return da - db;
    });

    setMovements(importedMovements);
    setAlert({ type: "success", message: `Import réussi: ${importedMovements.length} mouvements importés du trimestre ${selectedQuarter}.` });
  } catch (error) {
    console.error("Import error:", error);
    setAlert({ type: "error", message: "Erreur lors de la lecture du fichier. Vérifiez le format du fichier." });
  } finally {
    event.target.value = "";
  }
}
