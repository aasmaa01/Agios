import express from 'express';
const router = express.Router();

let movements = [];

router.get('/', (req, res) => res.json(movements));

router.post('/', (req, res) => {
  const movement = req.body;
  movements.push(movement);
  res.status(201).json(movement);
});

export default router;
