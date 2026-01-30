import express from 'express';
const router = express.Router();

// In-memory storage (replace with DB later)
let accounts = [];

router.get('/', (req, res) => res.json(accounts));

router.post('/', (req, res) => {
  const account = req.body;
  accounts.push(account);
  res.status(201).json(account);
});

router.delete('/:id', (req, res) => {
  accounts = accounts.filter(a => a.id !== req.params.id);
  res.sendStatus(204);
});

export default router;
