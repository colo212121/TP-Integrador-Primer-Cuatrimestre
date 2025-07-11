import express from "express";         // Framework web
import cors from "cors";               // Permite peticiones desde otros orígenes (por ejemplo, el frontend en React)
import EventRouter from "./Controllers/event-controller.js";  // Rutas de eventos
import UserRouter from "./Controllers/user-controller.js";    // Rutas de login/registro
import EventLocationRouter from "./Controllers/event-location-controller.js"; // Rutas de ubicaciones

const app = express();
const port = 3000;

app.use(cors());            // Habilita CORS
app.use(express.json());    // Habilita parseo de JSON del body

// Definición de rutas principales (cada una con su controlador y servicio detrás)
app.use('/api/event', EventRouter);
app.use('/api/user', UserRouter);
app.use('/api/event-location', EventLocationRouter);

// Levanta el servidor
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  