import { Router } from 'express';
import EventService from '../Servicios/event-service.js';
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


export default router;
