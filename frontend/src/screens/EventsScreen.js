import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Screen, Card, Title, Input, Label, Badge, Button, Chip } from '../components/UI';
import { apiGet, apiPost, apiDelete } from '../api/client';
import theme from '../theme';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';

function EventItem({ item, onEnroll, onUnenroll, onPress }) {
  const start = item.start_date ? format(new Date(item.start_date), 'PPPP p', { locale: es }) : '';
  return (
    <Card style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.flex1}>
          <Text style={styles.name} onPress={onPress}>{item.name}</Text>
          <Text style={styles.meta}>ID: {item.id ?? '—'}</Text>
          <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
          <View style={styles.rowWrap}>
            <Badge>{item.duration_in_minutes} min</Badge>
            <Badge tone="muted">${item.price}</Badge>
            {item.enabled_for_enrollment ? <Badge tone="primary">Inscripciones abiertas</Badge> : <Badge tone="danger">Cerrado</Badge>}
          </View>
          <Text style={styles.meta}>{start}</Text>
          <Text style={styles.meta}>Capacidad: {item.max_assistance}</Text>
          <Text style={styles.meta}>Lugar: {item.full_adress}</Text>
          <Text style={styles.meta}>Creador: {item.first_name} {item.last_name}</Text>
        </View>
        <View style={styles.centered}>
          {item.id ? (
            item.enabled_for_enrollment ? (
              <Text style={styles.enrollable} onPress={onEnroll}>Inscribirme</Text>
            ) : (
              <Text style={styles.notEnrollable} onPress={onUnenroll}>Cancelar</Text>
            )
          ) : null}
        </View>
      </View>
    </Card>
  );
}

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [date, setDate] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const navigation = useNavigation();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (q) params.name = q;
      if (date) {
        // Soporta dos keys diferentes por compatibilidad de backend
        params.startdate = date;
        params.start_date = date;
      }
      if (tag) params.tag = tag;
      const data = await apiGet('/event', false, params);
      setEvents(data);
    } catch (e) {
      // noop visual for simplicity
    } finally {
      setLoading(false);
    }
  }, [q, date, tag, page, limit]);

  useEffect(() => { load(); }, [load]);

  const handleEnroll = async (id) => {
    try {
      await apiPost(`/event/${id}/enrollment`, {}, true);
      await load();
    } catch {}
  };
  const handleUnenroll = async (id) => {
    try {
      await apiDelete(`/event/${id}/enrollment`, true);
      await load();
    } catch {}
  };

  return (
    <Screen>
      <Title>Eventos</Title>
      <Label>Buscar por nombre</Label>
      <Input placeholder="Ej: Taylor, Ajedrez..." value={q} onChangeText={setQ} onSubmitEditing={load} />
      <Label>Fecha de inicio (YYYY-MM-DD)</Label>
      <Input placeholder="2025-08-21" value={date} onChangeText={setDate} onSubmitEditing={load} />
      <Label>Tag</Label>
      <Input placeholder="Rock, Pop..." value={tag} onChangeText={setTag} onSubmitEditing={load} />
      <FlatList
        data={events}
        keyExtractor={(item, idx) => String(idx)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <EventItem
            item={item}
            onEnroll={() => item.id && handleEnroll(item.id)}
            onUnenroll={() => item.id && handleUnenroll(item.id)}
            onPress={() => item.id && navigation.navigate('EventDetail', { id: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing(1) }} />}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
        <Button title="Anterior" variant="outline" onPress={() => setPage(Math.max(1, page - 1))} disabled={page === 1 || loading} />
        <Chip>Pagina {page}</Chip>
        <Button title="Siguiente" variant="outline" onPress={() => setPage(page + 1)} disabled={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: theme.spacing(1) },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  flex1: { flex: 1 },
  centered: { justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 6 },
  description: { color: theme.colors.muted, marginBottom: 6 },
  meta: { color: theme.colors.muted },
  enrollable: { color: theme.colors.primary, fontWeight: '700' },
  notEnrollable: { color: theme.colors.danger, fontWeight: '700' }
});


