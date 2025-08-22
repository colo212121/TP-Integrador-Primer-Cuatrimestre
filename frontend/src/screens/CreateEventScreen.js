import { useEffect, useState } from 'react';
import { Screen, Card, Title, Label, Input, Button, ErrorText } from '../components/UI';
import { apiGet, apiPost } from '../api/client';
import { Switch, View } from 'react-native';
import LocationPicker from '../components/LocationPicker';

function normalizeDateTime(input) {
  // Acepta formatos con guiones y espacios extra, devuelve "YYYY-MM-DD HH:mm"
  if (!input) return '';
  const cleaned = String(input)
    .replace(/\s+/g, ' ')      // colapsa espacios
    .replace(/\s*-\s*/g, '-') // quita espacios alrededor de guiones
    .trim();
  // Intentar separar fecha y hora
  const [datePart = '', timePart = ''] = cleaned.split(' ');
  const [y, m, d] = datePart.split('-').map((v) => v?.padStart(2, '0'));
  let [hh = '00', mm = '00'] = timePart.split(':').map((v) => v?.padStart(2, '0'));
  // Validaciones básicas
  if (!y || !m || !d) return '';
  if (Number(hh) > 23) hh = '23';
  if (Number(mm) > 59) mm = '59';
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

export default function CreateEventScreen() {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [idLocation, setIdLocation] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('60');
  const [price, setPrice] = useState('0');
  const [enabled, setEnabled] = useState(true);
  const [maxAssistance, setMaxAssistance] = useState('50');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet('/event-location', true);
        setLocations(data || []);
      } catch (e) {
        // Si falta token, mostrar mensaje claro
        setError('No se pudieron cargar ubicaciones. Inicia sesión nuevamente.');
      }
    })();
  }, []);

  const onSubmit = async () => {
    setError('');
    setOk('');
    setLoading(true);
    try {
      if (!idLocation) throw new Error('Seleccioná una ubicación.');
      if (!name.trim()) throw new Error('Ingresá un nombre.');
      if (!startDate.trim()) throw new Error('Ingresá la fecha de inicio.');

      const normalized = normalizeDateTime(startDate);
      if (!normalized) throw new Error('Fecha/hora inválida. Usa YYYY-MM-DD HH:mm');

      const body = {
        name: name.trim(),
        description: description.trim(),
        id_event_location: Number(idLocation),
        start_date: normalized, // formato seguro para el backend
        duration_in_minutes: Number(duration) || 0,
        price: Number(price) || 0,
        enabled_for_enrollment: !!enabled,
        max_assistance: Number(maxAssistance) || 0
      };
      const res = await apiPost('/event', body, true);
      if (res?.success) setOk('Evento creado.');
    } catch (e) {
      setError(e.message || 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card>
        <Title>Crear Evento</Title>
        <Label>Nombre</Label>
        <Input value={name} onChangeText={setName} placeholder="Nombre del evento" />
        <Label>Descripción</Label>
        <Input value={description} onChangeText={setDescription} placeholder="Descripción" />
        <Label>Ubicación</Label>
        <LocationPicker locations={locations} value={idLocation} onChange={setIdLocation} />
        <Label>Fecha inicio (YYYY-MM-DD HH:mm)</Label>
        <Input value={startDate} onChangeText={setStartDate} placeholder="2025-09-25 20:00" />
        <Label>Duración (minutos)</Label>
        <Input value={duration} onChangeText={setDuration} placeholder="60" keyboardType="numeric" />
        <Label>Precio</Label>
        <Input value={price} onChangeText={setPrice} placeholder="0" keyboardType="numeric" />
        <Label>Inscripción habilitada</Label>
        <View style={{ marginBottom: 16 }}>
          <Switch value={enabled} onValueChange={setEnabled} />
        </View>
        <Label>Asistencia máxima</Label>
        <Input value={maxAssistance} onChangeText={setMaxAssistance} placeholder="50" keyboardType="numeric" />
        <Button title="Crear" onPress={onSubmit} loading={loading} />
        <ErrorText>{error || ok}</ErrorText>
      </Card>
    </Screen>
  );
}


