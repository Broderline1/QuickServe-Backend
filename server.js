const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
require('dotenv').config();

const { sequelize, Usuario, Mesa } = require('./src/models');
const authRoutes   = require('./src/routes/authRoutes');
const userRoutes   = require('./src/routes/userRoutes');
const mesaRoutes   = require('./src/routes/mesaRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

async function iniciar() {
  // sync({ alter: true }) actualiza las tablas si cambian los modelos
  await sequelize.sync({ alter: true });
  console.log('✅ Tablas sincronizadas');

  // Admin por defecto
  const existe = await Usuario.findOne({ where: { email: 'admin@quickserve.com' } });
  if (!existe) {
    const hash = await bcrypt.hash('admin123', 10);
    await Usuario.create({ nombre: 'Administrador', email: 'admin@quickserve.com', password: hash, rol: 'administrador' });
    console.log('✅ Admin creado: admin@quickserve.com / admin123');
  }

  // 20 mesas por defecto
  const total = await Mesa.count();
  if (total === 0) {
    for (let i = 1; i <= 20; i++) {
      await Mesa.create({ numero: i });
    }
    console.log('✅ 20 mesas creadas');
  }

  app.use('/auth',    authRoutes);
  app.use('/users',   userRoutes);
  app.use('/mesas',   mesaRoutes);
  app.use('/pedidos', pedidoRoutes);

  app.get('/', (req, res) => res.json({ status: 'QuickServe API ✅' }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
}

iniciar();