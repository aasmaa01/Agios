import express from 'express';
const router = express.Router();

let config = {
  taux: 8.5,
  frais: 1500,
  tvaRate: 19
};

router.get('/', (req, res) => res.json(config));

router.post('/', (req, res) => {
  config = { ...config, ...req.body };
  res.json(config);
});

export default router;
