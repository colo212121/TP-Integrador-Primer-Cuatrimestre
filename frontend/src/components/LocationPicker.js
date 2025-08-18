import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import theme from '../theme';

export default function LocationPicker({ locations, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(() => locations?.find(l => l.id === value) || null, [locations, value]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations || [];
    return (locations || []).filter(l => (l.name || '').toLowerCase().includes(q));
  }, [locations, query]);

  return (
    <View>
      <Pressable style={styles.selector} onPress={() => setOpen(true)}>
        <Text style={styles.selectorText}>
          {selected ? `${selected.name} — ${selected.full_adress || selected.full_address}` : 'Elegir ubicación por nombre'}
        </Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalRoot}>
          <Text style={styles.modalTitle}>Seleccionar ubicación</Text>
          <TextInput
            style={styles.search}
            placeholder="Buscar por nombre..."
            placeholderTextColor={theme.colors.muted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => { onChange(item.id); setOpen(false); }}
                style={({ pressed }) => [styles.item, pressed && { backgroundColor: '#f1f5f9' }]}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.full_adress || item.full_address}</Text>
                <Text style={styles.itemSub}>Capacidad: {item.max_capacity}</Text>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
          <Pressable onPress={() => setOpen(false)} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
    marginBottom: theme.spacing(2)
  },
  selectorText: {
    color: theme.colors.text
  },
  modalRoot: {
    flex: 1,
    padding: theme.spacing(2),
    backgroundColor: theme.colors.background
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing(2),
    color: theme.colors.text
  },
  search: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: theme.spacing(2),
    color: theme.colors.text
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  itemName: { fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  itemSub: { color: theme.colors.muted },
  closeBtn: {
    marginTop: theme.spacing(2),
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm
  },
  closeText: { color: '#fff', fontWeight: '600' }
});


