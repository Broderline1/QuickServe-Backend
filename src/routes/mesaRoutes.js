const express   = require('express');
const { Mesa }  = require('../models');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verificarToken, async (req, res) => {
  const mesas = await Mesa.findAll({ order: [['numero', 'ASC']] });
  res.json(mesas);
});

router.put('/:id/estado', verificarToken, async (req, res) => {
  const { estado } = req.body;
  await Mesa.update({ estado }, { where: { id: req.params.id } });
  const mesa = await Mesa.findByPk(req.params.id);
  res.json(mesa);
});

module.exports = router;