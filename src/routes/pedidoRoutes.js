const express           = require('express');
const { Op }            = require('sequelize');
const { Pedido, Mesa }  = require('../models');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verificarToken, async (req, res) => {
  const hoy   = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const pedidos = await Pedido.findAll({
    where: { creado_en: { [Op.between]: [hoy, manana] } },
    include: [{ model: Mesa, attributes: ['numero'] }],
    order: [['creado_en', 'DESC']]
  });
  res.json(pedidos);
});

router.post('/', async (req, res) => {
  const { mesa_id, platillo } = req.body;
  try {
    const pedido = await Pedido.create({ mesa_id, platillo });
    await Mesa.update({ estado: 'ocupada' }, { where: { id: mesa_id } });
    res.status(201).json(pedido);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id/estado', verificarToken, async (req, res) => {
  const { estado } = req.body;
  await Pedido.update({ estado }, { where: { id: req.params.id } });
  const pedido = await Pedido.findByPk(req.params.id);
  res.json(pedido);
});

router.get('/resumen', verificarToken, async (req, res) => {
  const hoy    = new Date(); hoy.setHours(0,0,0,0);
  const manana = new Date(hoy); manana.setDate(hoy.getDate() + 1);

  const pedidos = await Pedido.findAll({
    where: { creado_en: { [Op.between]: [hoy, manana] } }
  });

  const resumen = {
    total:      pedidos.length,
    entregados: pedidos.filter(p => p.estado === 'entregado').length,
    listos:     pedidos.filter(p => p.estado === 'listo').length,
    pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
  };
  res.json(resumen);
});

module.exports = router;