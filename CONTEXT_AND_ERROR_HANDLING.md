# Uso de Context y Try/Catch en el Proyecto

## 📋 Resumen

Este documento explica cómo hemos implementado el uso de **Context API** y **try/catch** en el proyecto de manera sencilla y entendible.

## 🎯 Context API (Frontend)

### ¿Qué es Context?
Context es una característica de React que permite compartir datos entre componentes sin necesidad de pasar props manualmente en cada nivel.

### Contexts Implementados

#### 1. AuthContext (`frontend/src/context/AuthContext.js`)
**Propósito**: Manejar el estado de autenticación del usuario.

**Estados**:
- `token`: Token de autenticación
- `user`: Datos del usuario
- `loading`: Estado de carga inicial
- `loginLoading`: Estado de carga durante login
- `registerLoading`: Estado de carga durante registro

**Funciones**:
- `login(username, password)`: Iniciar sesión
- `register(userData)`: Registrar usuario
- `logout()`: Cerrar sesión

**Uso**:
```javascript
import { useAuth } from '../context/AuthContext';

function MiComponente() {
  const { token, user, login, loginLoading } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login(username, password);
      // Login exitoso
    } catch (error) {
      // Manejar error
    }
  };
}
```

#### 2. EventContext (`frontend/src/context/EventContext.js`)
**Propósito**: Manejar el estado global de eventos.

**Estados**:
- `events`: Lista de eventos
- `loading`: Estado de carga
- `error`: Mensaje de error

**Funciones**:
- `fetchEvents()`: Obtener todos los eventos
- `createEvent(eventData)`: Crear nuevo evento
- `updateEvent(id, eventData)`: Actualizar evento
- `deleteEvent(id)`: Eliminar evento

#### 3. LocationContext (`frontend/src/context/LocationContext.js`)
**Propósito**: Manejar el estado global de ubicaciones.

**Funciones similares a EventContext pero para ubicaciones**.

### Configuración en App.js
```javascript
export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <LocationProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </LocationProvider>
      </EventProvider>
    </AuthProvider>
  );
}
```

## 🛡️ Try/Catch (Manejo de Errores)

### Frontend - Try/Catch en Contexts

#### Patrón Estándar:
```javascript
const fetchEvents = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const data = await apiGet('/event', false);
    setEvents(data);
    return data;
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    const errorMessage = error.message || 'Error al cargar eventos';
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};
```

#### Características:
1. **Siempre limpiar errores** al inicio: `setError(null)`
2. **Logging de errores** para debugging: `console.error()`
3. **Mensajes de error descriptivos** para el usuario
4. **Finally block** para limpiar estados de loading
5. **Re-throw** del error para que el componente pueda manejarlo

### Frontend - Try/Catch en Componentes

#### Ejemplo en LoginScreen:
```javascript
const onSubmit = async () => {
  // Validación básica
  if (!username.trim() || !password.trim()) {
    setError('Por favor completa todos los campos');
    return;
  }

  setError('');
  try {
    await login(username.trim(), password);
    // Si llega aquí, el login fue exitoso
  } catch (e) {
    setError(e.message);
  }
};
```

### Backend - Try/Catch en Controladores

#### Patrón Estándar:
```javascript
router.post('/login', async (req, res, next) => {
  try {
    // Validación de datos
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
    next(error); // Pasa al middleware de errores
  }
});
```

## 🔧 Middleware de Errores (Backend)

### Error Middleware (`backend/Middlewares/error-middleware.js`)

**Funcionalidades**:
1. **Manejo centralizado** de todos los errores
2. **Tipos de errores específicos**:
   - Validación (400)
   - Duplicados en BD (409)
   - Referencias inválidas (400)
   - No autorizado (401)
   - Acceso denegado (403)
   - No encontrado (404)
   - Error interno (500)

3. **Función helper** para crear errores:
```javascript
export const createError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
```

### Configuración en index.js:
```javascript
// Middleware para rutas no encontradas
app.use(notFoundHandler);

// Middleware para manejo centralizado de errores
app.use(errorHandler);
```

## 📱 Beneficios Implementados

### 1. **Estado Global Centralizado**
- No más prop drilling
- Estado compartido entre componentes
- Actualizaciones automáticas en toda la app

### 2. **Manejo de Errores Robusto**
- Errores capturados y manejados apropiadamente
- Mensajes de error descriptivos para usuarios
- Logging para debugging
- Estados de loading para mejor UX

### 3. **Código Más Limpio**
- Separación de responsabilidades
- Reutilización de lógica
- Menos código duplicado

### 4. **Mejor Experiencia de Usuario**
- Indicadores de loading
- Mensajes de error claros
- Validaciones en tiempo real
- Feedback inmediato

## 🚀 Cómo Usar

### Para Agregar un Nuevo Context:
1. Crear archivo en `frontend/src/context/`
2. Implementar estados y funciones con try/catch
3. Agregar provider en `App.js`
4. Usar hook en componentes

### Para Agregar Try/Catch:
1. **Frontend**: Envolver operaciones async en try/catch
2. **Backend**: Usar `next(error)` para pasar al middleware
3. **Siempre**: Logging y mensajes descriptivos

## 📝 Ejemplos de Uso

### Usando EventContext:
```javascript
import { useEvents } from '../context/EventContext';

function EventsList() {
  const { events, loading, error, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <EventList events={events} />;
}
```

### Usando LocationContext:
```javascript
import { useLocations } from '../context/LocationContext';

function LocationPicker() {
  const { locations, createLocation } = useLocations();

  const handleCreate = async (locationData) => {
    try {
      await createLocation(locationData);
      alert('Ubicación creada exitosamente');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };
}
```

---

**Nota**: Esta implementación es escalable y fácil de mantener. Cada Context maneja su propia lógica de negocio y estado, mientras que el try/catch asegura que los errores sean manejados de forma consistente en toda la aplicación.
