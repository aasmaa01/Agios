
const calculateInterest = (solde, taux, ecart) => {
  if (solde < 0) {
    return (Math.abs(solde) * taux * ecart) / 36000;
  }
  return 0;
};

export default calculateInterest;