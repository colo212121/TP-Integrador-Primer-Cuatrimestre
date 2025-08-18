import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import theme from '../theme';

export function Screen({ children, style }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Title({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Label({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

export function Input({ style, ...props }) {
  return <TextInput placeholderTextColor={theme.colors.muted} style={[styles.input, style]} {...props} />;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading }) {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [
      styles.button,
      variant === 'secondary' && styles.buttonSecondary,
      variant === 'outline' && styles.buttonOutline,
      (disabled || loading) && { opacity: 0.6 },
      pressed && { transform: [{ scale: 0.98 }] }
    ]}>
      {loading ? <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : '#fff'} /> : (
        <Text style={[styles.buttonText, variant === 'outline' && { color: theme.colors.primary }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function ErrorText({ children }) {
  if (!children) return null;
  return <Text style={styles.error}>{children}</Text>;
}

export function Badge({ children, tone = 'primary', style }) {
  const bg = tone === 'danger' ? theme.colors.danger : tone === 'muted' ? '#e5e7eb' : theme.colors.secondary;
  const fg = tone === 'muted' ? theme.colors.text : '#fff';
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.badgeText, { color: fg }]}>{children}</Text>
    </View>
  );
}

export function Chip({ children, style }) {
  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.chipText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing(2)
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    borderColor: theme.colors.border,
    borderWidth: 1,
    ...theme.shadow.card
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing(2)
  },
  label: {
    color: theme.colors.muted,
    marginBottom: 6
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: theme.spacing(2),
    color: theme.colors.text
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    alignItems: 'center'
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  error: {
    color: theme.colors.danger,
    marginTop: 8
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700'
  },
  chip: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  chipText: {
    color: theme.colors.primary,
    fontWeight: '600'
  }
});


