// event-location-controller.js
import { Router } from 'express';
import EventLocationService from '../Servicios/event-location-service.js';
import { verifyToken } from '../Middlewares/auth-middleware.js';

const router = Router();
const svc = new EventLocationService();

// Obtener todas las ubicaciones del usuario autenticado
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await svc.getAll(userId);
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error interno.' });
  }
});

// Obtener una ubicación por ID (si es del usuario autenticado)
router.get('/:id', verifyToken, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

  try {
    const location = await svc.getById(id, req.user.id);
    if (!location) return res.status(404).json({ message: 'Ubicación no encontrada' });
    res.status(200).json(location);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error interno.' });
  }
});

export default router;