// event-controller.js
import { Router } from 'express';
import EventService from '../Servicios/event-service.js';
import { verifyToken } from '../Middlewares/auth-middleware.js';

const router = Router();
const svc = new EventService();

router.get('', async (req, res) => {
  try {
    const data = await svc.getAllAsync(req.query);
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(500).send('Error interno.');
  }
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Id inválido' });
  }

  try {
    const event = await svc.getByIdAsync(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    res.status(200).json(event);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno.' });
  }
});


// Crear evento
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await svc.createEvent(req.body, userId);
    res.status(result.status).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 500, success: false, message: "Error interno." });
  }
});

// Editar evento
router.put('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await svc.updateEvent(req.body, userId);
    res.status(result.status).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 500, success: false, message: "Error interno." });
  }
});

// Eliminar evento
router.delete('/', verifyToken, async (req, res) => {
  const eventId = parseInt(req.query.id);
  const userId = req.user.id;
  try {
    const result = await svc.deleteEvent(eventId, userId);
    res.status(result.status).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 500, success: false, message: "Error interno." });
  }
});


// Inscripción a un evento
router.post('/:id/enrollment', verifyToken, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.id;

  if (isNaN(eventId)) return res.status(400).json({ success: false, message: 'ID de evento inválido.' });

  try {
    const result = await svc.enrollUser(eventId, userId);
    res.status(result.status).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Error interno.' });
  }
});

// Eliminar inscripción a un evento
router.delete('/:id/enrollment', verifyToken, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.id;

  if (isNaN(eventId)) return res.status(400).json({ success: false, message: 'ID de evento inválido.' });

  try {
    const result = await svc.removeEnrollment(eventId, userId);
    res.status(result.status).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Error interno.' });
  }
});


export default router;
