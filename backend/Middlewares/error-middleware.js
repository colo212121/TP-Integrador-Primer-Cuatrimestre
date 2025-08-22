// Middleware para manejo centralizado de errores
export const errorHandler = (err, req, res, next) => {
  console.error('Error en el servidor:', err);

  // Errores de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors
    });
  }

  // Errores de base de datos
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'El registro ya existe'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida en la base de datos'
    });
  }

  // Errores de autenticación
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
  }

  // Errores de permisos
  if (err.status === 403) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado'
    });
  }

  // Errores de recurso no encontrado
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      message: 'Recurso no encontrado'
    });
  }

  // Error por defecto
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
};

// Función helper para crear errores personalizados
export const createError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
