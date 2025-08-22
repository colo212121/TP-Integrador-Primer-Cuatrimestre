import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { Screen, Card, Title, Label, Input, ErrorText, Subtitle, Badge, Divider } from '../components/UI';
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
      <Title variant="hero">📍 Mis Ubicaciones</Title>
      <Subtitle>Gestiona tus espacios para eventos</Subtitle>
      
      <View style={styles.searchSection}>
        <Label>🔍 Buscar ubicación</Label>
        <Input 
          variant="search"
          placeholder="Ej: Estadio River, Teatro Colón..." 
          value={query} 
          onChangeText={setQuery}
          editable={!loading}
        />
      </View>
      
      {error && <ErrorText>{error}</ErrorText>}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        renderItem={({ item }) => (
          <Card style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{item.name}</Text>
                <Text style={styles.locationId}>ID: {item.id}</Text>
              </View>
              <Badge variant="info" style={styles.capacityBadge}>
                👥 {item.max_capacity}
              </Badge>
            </View>
            
            <Divider />
            
            <View style={styles.locationDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📍 Dirección:</Text>
                <Text style={styles.detailValue}>{item.full_adress || item.full_address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>🎯 Capacidad:</Text>
                <Text style={styles.detailValue}>{item.max_capacity} personas</Text>
              </View>
            </View>
            
            <View style={styles.locationStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{item.max_capacity}</Text>
                <Text style={styles.statLabel}>Capacidad</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>📍</Text>
                <Text style={styles.statLabel}>Ubicación</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>✅</Text>
                <Text style={styles.statLabel}>Activa</Text>
              </View>
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing(2) }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>🏢 No hay ubicaciones</Text>
            <Text style={styles.emptyText}>
              Aún no has creado ninguna ubicación para tus eventos.
            </Text>
          </Card>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    marginBottom: theme.spacing(3)
  },
  
  locationCard: {
    marginBottom: theme.spacing(2)
  },
  
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2)
  },
  
  locationInfo: {
    flex: 1,
    marginRight: theme.spacing(2)
  },
  
  locationName: { 
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700', 
    color: theme.colors.text, 
    marginBottom: theme.spacing(0.5),
    lineHeight: theme.typography.lineHeight.tight
  },
  
  locationId: { 
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    fontWeight: '500'
  },
  
  capacityBadge: {
    alignSelf: 'flex-start'
  },
  
  locationDetails: {
    marginBottom: theme.spacing(2)
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1)
  },
  
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    fontWeight: '600',
    flex: 0.3
  },
  
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    flex: 0.7,
    textAlign: 'right'
  },
  
  locationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing(0.5)
  },
  
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    fontWeight: '500',
    textAlign: 'center'
  },
  
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border
  },
  
  emptyCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing(4)
  },
  
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing(1),
    textAlign: 'center'
  },
  
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal
  }
});


