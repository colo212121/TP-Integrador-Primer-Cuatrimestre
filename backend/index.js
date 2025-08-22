import express from "express";         // Framework web
import cors from "cors";               // Permite peticiones desde otros orígenes (por ejemplo, el frontend en React)
import EventRouter from "./Controllers/event-controller.js";  // Rutas de eventos
import UserRouter from "./Controllers/user-controller.js";    // Rutas de login/registro
import EventLocationRouter from "./Controllers/event-location-controller.js"; // Rutas de ubicaciones
import { errorHandler, notFoundHandler } from "./Middlewares/error-middleware.js"; // Middleware de errores

const app = express();
const port = 3000;

app.use(cors());            // Habilita CORS
app.use(express.json());    // Habilita parseo de JSON del body

// Definición de rutas principales (cada una con su controlador y servicio detrás)
app.use('/api/event', EventRouter);
app.use('/api/user', UserRouter);
app.use('/api/event-location', EventLocationRouter);

// Middleware para manejar rutas no encontradas (debe ir antes del error handler)
app.use(notFoundHandler);

// Middleware para manejo centralizado de errores (debe ir al final)
app.use(errorHandler);

// Levanta el servidor
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  