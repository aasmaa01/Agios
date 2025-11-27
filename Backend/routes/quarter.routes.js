import express from 'express';
const router = express.Router();

let quarters = [];

router.get('/', (req, res) => res.json(quarters));

router.post('/', (req, res) => {
  const quarter = req.body;
  quarters.push(quarter);
  res.status(201).json(quarter);
});

export default router;
