import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { Screen, Card, Title, Label, Input, ErrorText } from '../components/UI';
import { useLocations } from '../context/LocationContext';
import theme from '../theme';

export default function LocationsScreen() {
  const { locations, loading, error, clearError, fetchLocations } = useLocations();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const loadLocations = async () => {
      try {
        clearError();
        await fetchLocations();
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
      }
    };
    
    loadLocations();
  }, []); // Solo se ejecuta una vez al montar el componente

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter(l => (l.name || '').toLowerCase().includes(q));
  }, [locations, query]);

  const handleRefresh = async () => {
    try {
      clearError();
      await fetchLocations();
    } catch (error) {
      console.error('Error al refrescar ubicaciones:', error);
    }
  };

  return (
    <Screen>
      <Title>Mis ubicaciones</Title>
      
      <Label>Buscar por nombre</Label>
      <Input 
        placeholder="Ej: River, Estadio..." 
        value={query} 
        onChangeText={setQuery}
        editable={!loading}
      />
      
      {error && <ErrorText>{error}</ErrorText>}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <Card style={styles.cardSpacing}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.address}>{item.full_adress || item.full_address}</Text>
            <Text style={styles.capacity}>Capacidad: {item.max_capacity}</Text>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing(1) }} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardSpacing: { marginBottom: theme.spacing(1) },
  title: { 
    fontWeight: '700',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4
  },
  address: {
    color: theme.colors.muted,
    marginBottom: 2
  },
  capacity: {
    color: theme.colors.muted,
    fontSize: 12
  }
});


