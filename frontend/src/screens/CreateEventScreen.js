import { useEffect, useState } from 'react';
import { Screen, Card, Title, Label, Input, Button, ErrorText } from '../components/UI';
import { apiGet, apiPost } from '../api/client';
import { Switch, View } from 'react-native';
import LocationPicker from '../components/LocationPicker';

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
      } catch {}
    })();
  }, []);

  const onSubmit = async () => {
    setError('');
    setOk('');
    setLoading(true);
    try {
      if (!idLocation) {
        throw new Error('Seleccioná una ubicación.');
      }
      const body = {
        name,
        description,
        id_event_location: Number(idLocation),
        start_date: startDate,
        duration_in_minutes: Number(duration),
        price: Number(price),
        enabled_for_enrollment: enabled,
        max_assistance: Number(maxAssistance)
      };
      const res = await apiPost('/event', body, true);
      if (res?.success) setOk('Evento creado.');
    } catch (e) {
      setError(e.message);
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
        <ErrorText>{error}</ErrorText>
        {ok ? <View style={{ marginTop: 8 }}><Label>{ok}</Label></View> : null}
      </Card>
    </Screen>
  );
}


