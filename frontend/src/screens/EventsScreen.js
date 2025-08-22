import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View, Alert } from 'react-native';
import { Screen, Card, Title, Input, Label, Badge, Button, Chip, ErrorText, Subtitle, Divider, Avatar } from '../components/UI';
import { useEvents } from '../context/EventContext';
import { apiPost, apiDelete } from '../api/client';
import theme from '../theme';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';

function EventItem({ item, onEnroll, onUnenroll, onPress }) {
  const start = item.start_date ? format(new Date(item.start_date), 'PPPP p', { locale: es }) : '';
  
  // Determinar si es evento premium o destacado
  const isPremium = item.price > 1000;
  const isFeatured = item.max_assistance > 500;
  const cardVariant = isPremium ? 'premium' : isFeatured ? 'featured' : 'default';
  
  return (
    <Card variant={cardVariant} style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName} onPress={onPress}>{item.name}</Text>
          <Text style={styles.eventId}>ID: {item.id ?? '—'}</Text>
        </View>
        <Avatar size="small" />
      </View>
      
      <Text numberOfLines={3} style={styles.eventDescription}>{item.description}</Text>
      
      <View style={styles.badgeContainer}>
        <Badge variant="info">{item.duration_in_minutes} min</Badge>
        <Badge variant={item.price > 0 ? "warning" : "success"}>
          {item.price > 0 ? `$${item.price}` : 'Gratis'}
        </Badge>
        {isPremium && <Badge variant="premium">Premium</Badge>}
        {isFeatured && <Badge variant="featured">Destacado</Badge>}
        {item.enabled_for_enrollment ? 
          <Badge variant="success">Inscripciones abiertas</Badge> : 
          <Badge variant="danger">Cerrado</Badge>
        }
      </View>
      
      <Divider />
      
      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📅 Fecha:</Text>
          <Text style={styles.detailValue}>{start}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>👥 Capacidad:</Text>
          <Text style={styles.detailValue}>{item.max_assistance} personas</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📍 Lugar:</Text>
          <Text style={styles.detailValue}>{item.full_adress}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>👤 Organizador:</Text>
          <Text style={styles.detailValue}>{item.first_name} {item.last_name}</Text>
        </View>
      </View>
      
      <View style={styles.eventActions}>
        {item.id && (
          <Button
            title={item.enabled_for_enrollment ? "🎫 Inscribirme" : "❌ Cancelar"}
            variant={item.enabled_for_enrollment ? "primary" : "danger"}
            size="small"
            onPress={item.enabled_for_enrollment ? onEnroll : onUnenroll}
            style={styles.actionButton}
          />
        )}
      </View>
    </Card>
  );
}

export default function EventsScreen() {
  const { events, loading, error, clearError, fetchEvents } = useEvents();
  const [q, setQ] = useState('');
  const [date, setDate] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const navigation = useNavigation();

  // Función para cargar eventos sin dependencias problemáticas
  const loadEvents = useCallback(async () => {
    try {
      clearError();
      const params = { page, limit };
      if (q) params.name = q;
      if (date) {
        // Soporta dos keys diferentes por compatibilidad de backend
        params.startdate = date;
        params.start_date = date;
      }
      if (tag) params.tag = tag;
      await fetchEvents(params);
    } catch (e) {
      console.error('Error al cargar eventos:', e);
    }
  }, [q, date, tag, page, limit]); // Removidas fetchEvents y clearError de las dependencias

  // Cargar eventos solo cuando cambien los filtros o la página
  useEffect(() => { 
    loadEvents(); 
  }, [loadEvents]);

  const handleEnroll = async (id) => {
    try {
      await apiPost(`/event/${id}/enrollment`, {}, true);
      await loadEvents(); // Recargar eventos después de inscribirse
      Alert.alert('🎉 ¡Éxito!', 'Te has inscrito al evento correctamente');
    } catch (error) {
      console.error('Error al inscribirse:', error);
      Alert.alert('❌ Error', error.message || 'Error al inscribirse al evento');
    }
  };

  const handleUnenroll = async (id) => {
    try {
      await apiDelete(`/event/${id}/enrollment`, true);
      await loadEvents(); // Recargar eventos después de cancelar
      Alert.alert('✅ Confirmado', 'Has cancelado tu inscripción al evento');
    } catch (error) {
      console.error('Error al cancelar inscripción:', error);
      Alert.alert('❌ Error', error.message || 'Error al cancelar inscripción');
    }
  };

  return (
    <Screen>
      <Title variant="hero">🎪 Eventos</Title>
      <Subtitle>Descubre los mejores eventos y experiencias únicas</Subtitle>
      
      <Card style={styles.searchCard}>
        <Title variant="section">🔎 Buscar eventos</Title>
        <View style={styles.searchSection}>
          <Label>Nombre</Label>
          <Input 
            variant="search"
            placeholder="Ej: Taylor Swift, Ajedrez, Rock..." 
            value={q} 
            onChangeText={setQ} 
            onSubmitEditing={loadEvents}
            editable={!loading}
          />
          
          <Label>Fecha de inicio (YYYY-MM-DD)</Label>
          <Input 
            placeholder="2025-08-21" 
            value={date} 
            onChangeText={setDate} 
            onSubmitEditing={loadEvents}
            editable={!loading}
          />
          
          <Label>Categoría</Label>
          <Input 
            placeholder="Rock, Pop, Deportes..." 
            value={tag} 
            onChangeText={setTag} 
            onSubmitEditing={loadEvents}
            editable={!loading}
          />
        </View>
      </Card>

      {error && <ErrorText>{error}</ErrorText>}

      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id || Math.random())}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={loadEvents}
            tintColor={theme.colors.primary}
          />
        }
        renderItem={({ item }) => (
          <EventItem
            item={item}
            onEnroll={() => item.id && handleEnroll(item.id)}
            onUnenroll={() => item.id && handleUnenroll(item.id)}
            onPress={() => item.id && navigation.navigate('EventDetail', { id: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing(2) }} />}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.paginationContainer}>
        <Button 
          title="⬅️ Anterior" 
          variant="outline" 
          size="small"
          onPress={() => setPage(Math.max(1, page - 1))} 
          disabled={page === 1 || loading} 
        />
        <Chip selected>📄 Página {page}</Chip>
        <Button 
          title="Siguiente ➡️" 
          variant="outline" 
          size="small"
          onPress={() => setPage(page + 1)} 
          disabled={loading} 
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    marginBottom: theme.spacing(2)
  },
  
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2)
  },
  
  eventInfo: {
    flex: 1,
    marginRight: theme.spacing(2)
  },
  
  eventName: { 
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700', 
    color: theme.colors.text, 
    marginBottom: theme.spacing(0.5),
    lineHeight: theme.typography.lineHeight.tight
  },
  
  eventId: { 
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    fontWeight: '500'
  },
  
  eventDescription: { 
    color: theme.colors.textSecondary, 
    marginBottom: theme.spacing(2),
    lineHeight: theme.typography.lineHeight.normal,
    fontSize: theme.typography.fontSize.base
  },
  
  badgeContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: theme.spacing(1), 
    marginBottom: theme.spacing(2)
  },
  
  eventDetails: {
    marginBottom: theme.spacing(2)
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    fontWeight: '600'
  },
  
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right'
  },
  
  eventActions: {
    alignItems: 'flex-end'
  },
  
  actionButton: {
    minWidth: 120
  },
  
  searchCard: {
    marginBottom: theme.spacing(3)
  },
  
  searchSection: {
    marginTop: theme.spacing(1)
  },
  
  paginationContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: theme.spacing(3),
    paddingHorizontal: theme.spacing(1)
  }
});


