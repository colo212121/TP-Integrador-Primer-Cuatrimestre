import { Router } from 'express';
import UserService from '../Servicios/user-service.js';

const router = Router();
const svc = new UserService(); // igual que el EventService

router.post('/register', async (req, res) => {
  try {
    const result = await svc.register(req.body);
    if (result.status === 201) {
      res.status(201).json({ success: true, message: "Usuario registrado con éxito." });
    } else {
      res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error interno." });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await svc.login(req.body);
    res.status(result.status).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error interno." });
  }
});

export default router;
