import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import theme from '../theme';

export default function LocationPicker({ locations, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(() => {
    const val = value != null ? String(value) : null;
    return (locations || []).find(l => String(l.id) === val) || null;
  }, [locations, value]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations || [];
    return (locations || []).filter(l => (l.name || '').toLowerCase().includes(q));
  }, [locations, query]);

  return (
    <View>
      <Pressable style={styles.selector} onPress={() => setOpen(true)}>
        <Text style={[
          styles.selectorText,
          !selected && styles.selectorPlaceholder
        ]}>
          {selected ? `${selected.name} — ${selected.full_adress || selected.full_address}` : 'Elegir ubicación por nombre'}
        </Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar ubicación</Text>
            <Pressable onPress={() => setOpen(false)} style={styles.modalCloseIcon}>
              <Text style={styles.modalCloseIconText}>✕</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.search}
            placeholder="Buscar por nombre..."
            placeholderTextColor={theme.colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />

          <FlatList
            data={filtered}
            keyExtractor={(item, index) => `${item?.id ?? 'idx'}-${index}`}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => { onChange(item.id); setOpen(false); }}
                style={({ pressed }) => [
                  styles.item,
                  pressed && styles.itemPressed
                ]}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.full_adress || item.full_address}</Text>
                <Text style={styles.itemSub}>Capacidad: {item.max_capacity}</Text>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            contentContainerStyle={filtered?.length ? undefined : styles.emptyList}
            ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron ubicaciones</Text>}
            showsVerticalScrollIndicator={false}
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
  // Selector (campo visible)
  selector: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    backgroundColor: theme.colors.backgroundLight,
    marginBottom: theme.spacing(2)
  },
  selectorText: {
    color: theme.colors.text,
    fontWeight: '600'
  },
  selectorPlaceholder: {
    color: theme.colors.textMuted,
    fontWeight: '500'
  },

  // Modal
  modalRoot: {
    flex: 1,
    padding: theme.spacing(2),
    backgroundColor: theme.colors.background
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2)
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text
  },
  modalCloseIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  modalCloseIconText: {
    color: theme.colors.text,
    fontWeight: '700'
  },

  // Búsqueda
  search: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    color: theme.colors.text,
    fontWeight: '500'
  },

  // Lista e items
  item: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  itemPressed: {
    backgroundColor: theme.colors.backgroundCard
  },
  itemName: { 
    fontWeight: '700', 
    color: theme.colors.text, 
    marginBottom: 4,
    fontSize: 16
  },
  itemSub: { 
    color: theme.colors.textMuted
  },
  itemSeparator: {
    height: theme.spacing(1)
  },
  emptyList: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontWeight: '500'
  },

  // Botón cerrar
  closeBtn: {
    marginTop: theme.spacing(2),
    alignSelf: 'center',
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(1.5),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    ...theme.shadow.button
  },
  closeText: { color: '#fff', fontWeight: '700' }
});


