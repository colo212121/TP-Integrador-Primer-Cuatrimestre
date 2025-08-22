import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

// Componente Screen con gradiente de fondo
export function Screen({ children, style }) {
  return (
    <LinearGradient
      colors={theme.gradients.background}
      style={[styles.screen, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

// Card moderna con efectos de glassmorphism
export function Card({ children, style, variant = 'default' }) {
  const cardStyle = variant === 'premium' ? styles.cardPremium : 
                   variant === 'featured' ? styles.cardFeatured : 
                   styles.card;
  
  return (
    <View style={[cardStyle, style]}>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );
}

// Título principal con tipografía moderna
export function Title({ children, style, variant = 'default' }) {
  const titleStyle = variant === 'hero' ? styles.titleHero :
                    variant === 'section' ? styles.titleSection :
                    styles.title;
  
  return <Text style={[titleStyle, style]}>{children}</Text>;
}

// Subtítulo elegante
export function Subtitle({ children, style }) {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
}

// Label moderno
export function Label({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

// Input moderno con efectos de focus
export function Input({ style, variant = 'default', ...props }) {
  const inputStyle = variant === 'search' ? styles.inputSearch :
                    variant === 'premium' ? styles.inputPremium :
                    styles.input;
  
  return (
    <View style={styles.inputContainer}>
      <TextInput 
        placeholderTextColor={theme.colors.textMuted} 
        style={[inputStyle, style]} 
        {...props} 
      />
    </View>
  );
}

// Botón moderno con gradientes y efectos
export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled, 
  loading,
  size = 'default',
  style 
}) {
  const buttonStyle = variant === 'secondary' ? styles.buttonSecondary :
                     variant === 'outline' ? styles.buttonOutline :
                     variant === 'premium' ? styles.buttonPremium :
                     variant === 'ghost' ? styles.buttonGhost :
                     styles.button;
  
  const sizeStyle = size === 'small' ? styles.buttonSmall :
                   size === 'large' ? styles.buttonLarge :
                   styles.buttonDefault;
  
  const textStyle = variant === 'outline' || variant === 'ghost' ? 
                   styles.buttonTextOutline : 
                   styles.buttonText;
  
  return (
    <Pressable 
      onPress={onPress} 
      disabled={disabled || loading} 
      style={({ pressed }) => [
        buttonStyle,
        sizeStyle,
        (disabled || loading) && styles.buttonDisabled,
        pressed && styles.buttonPressed,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#fff'} 
          size="small"
        />
      ) : (
        <Text style={[textStyle, size === 'small' && styles.buttonTextSmall]}>{title}</Text>
      )}
    </Pressable>
  );
}

// Texto de error elegante
export function ErrorText({ children, style }) {
  if (!children) return null;
  return <Text style={[styles.error, style]}>{children}</Text>;
}

// Badge moderno con diferentes variantes
export function Badge({ children, variant = 'default', style }) {
  const badgeStyle = variant === 'premium' ? styles.badgePremium :
                    variant === 'featured' ? styles.badgeFeatured :
                    variant === 'success' ? styles.badgeSuccess :
                    variant === 'warning' ? styles.badgeWarning :
                    variant === 'danger' ? styles.badgeDanger :
                    variant === 'info' ? styles.badgeInfo :
                    styles.badge;
  
  const textStyle = variant === 'default' ? styles.badgeText : styles.badgeTextColored;
  
  return (
    <View style={[badgeStyle, style]}>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
}

// Chip moderno para filtros
export function Chip({ children, selected = false, onPress, style }) {
  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
        style
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {children}
      </Text>
    </Pressable>
  );
}

// Separador elegante
export function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

// Avatar para usuarios
export function Avatar({ size = 'medium', style }) {
  const sizeStyle = size === 'small' ? styles.avatarSmall :
                   size === 'large' ? styles.avatarLarge :
                   styles.avatarMedium;
  
  return (
    <View style={[styles.avatar, sizeStyle, style]}>
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.avatarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
}

// Icon container para iconos
export function IconContainer({ children, style }) {
  return <View style={[styles.iconContainer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  // Screen con gradiente
  screen: {
    flex: 1,
    padding: theme.spacing(2)
  },
  
  // Cards modernas
  card: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card
  },
  
  cardPremium: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing(2),
    borderWidth: 2,
    borderColor: theme.colors.eventPremium,
    ...theme.shadow.elevated
  },
  
  cardFeatured: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing(2),
    borderWidth: 2,
    borderColor: theme.colors.eventFeatured,
    ...theme.shadow.elevated
  },
  
  cardContent: {
    padding: theme.spacing(3)
  },
  
  // Tipografía moderna
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing(2),
    letterSpacing: -0.5
  },
  
  titleHero: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing(3),
    letterSpacing: -1,
    textAlign: 'center'
  },
  
  titleSection: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing(2),
    letterSpacing: -0.5
  },
  
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing(2),
    lineHeight: theme.typography.lineHeight.normal
  },
  
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing(1),
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  
  // Inputs modernos
  inputContainer: {
    marginBottom: theme.spacing(2)
  },
  
  input: {
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '500'
  },
  
  inputSearch: {
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2),
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '500'
  },
  
  inputPremium: {
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '500'
  },
  
  // Botones modernos
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.button
  },
  
  buttonDefault: {
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(4)
  },
  
  buttonSmall: {
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: theme.spacing(3)
  },
  
  buttonLarge: {
    paddingVertical: theme.spacing(3),
    paddingHorizontal: theme.spacing(6)
  },
  
  buttonSecondary: {
    backgroundColor: theme.colors.secondary
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary
  },
  
  buttonPremium: {
    backgroundColor: theme.colors.eventPremium
  },
  
  buttonGhost: {
    backgroundColor: 'transparent'
  },
  
  buttonDisabled: {
    opacity: 0.5
  },
  
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8
  },
  
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: theme.typography.fontSize.base,
    letterSpacing: 0.5
  },
  
  buttonTextOutline: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: theme.typography.fontSize.base,
    letterSpacing: 0.5
  },
  
  buttonTextSmall: {
    fontSize: theme.typography.fontSize.sm
  },
  
  // Error text
  error: {
    color: theme.colors.danger,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    marginTop: theme.spacing(1),
    textAlign: 'center'
  },
  
  // Badges modernos
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1)
  },
  
  badgePremium: {
    backgroundColor: theme.colors.eventPremium,
    borderColor: theme.colors.eventPremium
  },
  
  badgeFeatured: {
    backgroundColor: theme.colors.eventFeatured,
    borderColor: theme.colors.eventFeatured
  },
  
  badgeSuccess: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success
  },
  
  badgeWarning: {
    backgroundColor: theme.colors.warning,
    borderColor: theme.colors.warning
  },
  
  badgeDanger: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger
  },
  
  badgeInfo: {
    backgroundColor: theme.colors.info,
    borderColor: theme.colors.info
  },
  
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary
  },
  
  badgeTextColored: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
    color: '#fff'
  },
  
  // Chips modernos
  chip: {
    backgroundColor: theme.colors.backgroundLight,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(1.5),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  
  chipPressed: {
    transform: [{ scale: 0.95 }]
  },
  
  chipText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: theme.typography.fontSize.sm
  },
  
  chipTextSelected: {
    color: '#fff'
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing(2)
  },
  
  // Avatar
  avatar: {
    borderRadius: theme.radius.full,
    overflow: 'hidden'
  },
  
  avatarSmall: {
    width: 32,
    height: 32
  },
  
  avatarMedium: {
    width: 48,
    height: 48
  },
  
  avatarLarge: {
    width: 64,
    height: 64
  },
  
  avatarGradient: {
    flex: 1
  },
  
  // Icon container
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border
  }
});


