import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen, Card, Title, Badge, Chip, Button } from '../components/UI';
import { apiDelete, apiGet, apiPost } from '../api/client';
import theme from '../theme';

export default function EventDetailScreen({ route }) {
  const { id } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await apiGet(`/event/${id}`);
        setEvent(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleEnroll = async () => {
    if (!event?.id) return;
    setActionLoading(true);
    try {
      await apiPost(`/event/${event.id}/enrollment`, {}, true);
      const data = await apiGet(`/event/${id}`);
      setEvent(data);
    } catch {}
    setActionLoading(false);
  };

  const handleUnenroll = async () => {
    if (!event?.id) return;
    setActionLoading(true);
    try {
      await apiDelete(`/event/${event.id}/enrollment`, true);
      const data = await apiGet(`/event/${id}`);
      setEvent(data);
    } catch {}
    setActionLoading(false);
  };

  if (!event) return <Screen />;

  return (
    <Screen>
      <Card>
        <Title>{event.name}</Title>
        <Text style={styles.meta}>ID: {event.id}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <View style={styles.rowWrap}>
          <Badge tone="muted">${event.price}</Badge>
          <Badge>{event.duration_in_minutes} min</Badge>
          {event.enabled_for_enrollment ? <Badge>Inscripciones abiertas</Badge> : <Badge tone="danger">Cerrado</Badge>}
        </View>
        <View style={styles.ctaRow}>
          <Button
            title="Inscribirme"
            onPress={handleEnroll}
            disabled={!event.enabled_for_enrollment}
            loading={actionLoading}
          />
          <Button
            title="Cancelar"
            variant="outline"
            onPress={handleUnenroll}
            loading={actionLoading}
          />
        </View>
      </Card>

      {event.event_location && (
        <Card style={styles.cardSpacing}>
          <Title>Ubicación</Title>
          <Text>{event.event_location.name}</Text>
          <Text>{event.event_location.full_address || event.event_location.full_adress}</Text>
          <Text>Capacidad: {event.event_location.max_capacity}</Text>
          {event.event_location.location && (
            <View style={styles.sectionSpacing}>
              <Text style={styles.sectionTitle}>Localidad</Text>
              <Text>{event.event_location.location.name}</Text>
              {event.event_location.location.province && (
                <View style={styles.subSectionSpacing}>
                  <Text style={styles.sectionTitle}>Provincia</Text>
                  <Text>{event.event_location.location.province.full_name || event.event_location.location.province.name}</Text>
                </View>
              )}
            </View>
          )}
        </Card>
      )}

      {Array.isArray(event.tags) && event.tags.length > 0 && (
        <Card style={styles.cardSpacing}>
          <Title>Tags</Title>
          <View style={styles.rowWrap}>
            {event.tags.map(t => <Chip key={t.id}>{t.name}</Chip>)}
          </View>
        </Card>
      )}

      {event.creator_user && (
        <Card style={styles.cardSpacing}>
          <Title>Creador</Title>
          <Text>{event.creator_user.first_name} {event.creator_user.last_name}</Text>
          <Text>{event.creator_user.username}</Text>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { color: theme.colors.muted, marginBottom: 4 },
  description: { color: theme.colors.muted, marginBottom: 8 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  ctaRow: { marginTop: 12, flexDirection: 'row', columnGap: 8 },
  cardSpacing: { marginTop: 12 },
  sectionSpacing: { marginTop: 8 },
  subSectionSpacing: { marginTop: 6 },
  sectionTitle: { fontWeight: '700' }
});


