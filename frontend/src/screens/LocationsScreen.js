import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Screen, Card, Title, Label, Input } from '../components/UI';
import { apiGet } from '../api/client';
import theme from '../theme';

export default function LocationsScreen() {
  const [locations, setLocations] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet('/event-location', true);
        setLocations(data || []);
      } catch {}
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter(l => (l.name || '').toLowerCase().includes(q));
  }, [locations, query]);

  return (
    <Screen>
      <Title>Mis ubicaciones</Title>
      <Label>Buscar por nombre</Label>
      <Input placeholder="Ej: River, Estadio..." value={query} onChangeText={setQuery} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card style={styles.cardSpacing}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.full_adress || item.full_address}</Text>
            <Text>Capacidad: {item.max_capacity}</Text>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardSpacing: { marginBottom: theme.spacing(1) },
  title: { fontWeight: '700' }
});


