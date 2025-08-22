import { Router } from 'express';
import UserService from '../Servicios/user-service.js';
import { createError } from '../Middlewares/error-middleware.js';

const router = Router();
const svc = new UserService();

router.post('/register', async (req, res, next) => {
  try {
    // Validación básica de datos requeridos
    const { first_name, last_name, username, password } = req.body;
    
    if (!first_name || !last_name || !username || !password) {
      throw createError('Todos los campos son requeridos', 400);
    }

    if (password.length < 6) {
      throw createError('La contraseña debe tener al menos 6 caracteres', 400);
    }

    const result = await svc.register(req.body);
    
    if (result.status === 201) {
      res.status(201).json({ 
        success: true, 
        message: "Usuario registrado con éxito." 
      });
    } else {
      res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error en registro:', error);
    next(error); // Pasa el error al middleware de manejo de errores
  }
});

router.post('/login', async (req, res, next) => {
  try {
    // Validación básica de datos requeridos
    const { username, password } = req.body;
    
    if (!username || !password) {
      throw createError('Usuario y contraseña son requeridos', 400);
    }

    const result = await svc.login(req.body);
    
    if (result.status === 200) {
      res.status(200).json({
        success: true,
        token: result.token,
        user: result.user,
        message: 'Login exitoso'
      });
    } else {
      res.status(result.status).json({
        success: false,
        message: result.message || 'Credenciales inválidas'
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    next(error); // Pasa el error al middleware de manejo de errores
  }
});

export default router;
