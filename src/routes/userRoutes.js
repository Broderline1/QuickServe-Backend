const express     = require('express');
const bcrypt      = require('bcryptjs');
const { Usuario } = require('../models');
const { verificarToken, soloAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', verificarToken, soloAdmin, async (req, res) => {
  const usuarios = await Usuario.findAll({
    attributes: ['id', 'nombre', 'email', 'rol']
  });
  res.json(usuarios);
});

router.post('/', verificarToken, soloAdmin, async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const hash    = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, password: hash, rol });
    res.status(201).json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', verificarToken, soloAdmin, async (req, res) => {
  const { nombre, email, rol } = req.body;
  try {
    await Usuario.update({ nombre, email, rol }, { where: { id: req.params.id } });
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: ['id', 'nombre', 'email', 'rol']
    });
    res.json(usuario);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  await Usuario.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Usuario eliminado' });
});

module.exports = router;