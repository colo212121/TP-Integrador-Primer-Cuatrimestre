const theme = {
  colors: {
    // Paleta principal moderna y elegante
    primary: '#6366f1', // Indigo moderno
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    secondary: '#10b981', // Emerald
    secondaryLight: '#34d399',
    secondaryDark: '#059669',
    
    // Colores de fondo con gradientes
    background: '#0f172a', // Slate 900 - Fondo oscuro elegante
    backgroundLight: '#1e293b', // Slate 800
    backgroundCard: '#1e293b', // Slate 800 para cards
    backgroundGradient: ['#0f172a', '#1e293b', '#334155'],
    
    // Colores de texto
    text: '#f8fafc', // Slate 50 - Texto claro
    textSecondary: '#cbd5e1', // Slate 300
    textMuted: '#94a3b8', // Slate 400
    
    // Colores de estado
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    danger: '#ef4444', // Red
    info: '#3b82f6', // Blue
    
    // Colores de acento
    accent: '#8b5cf6', // Violet
    accentLight: '#a78bfa',
    accentDark: '#7c3aed',
    
    // Colores de borde y separadores
    border: '#334155', // Slate 700
    borderLight: '#475569', // Slate 600
    divider: '#475569', // Slate 600
    
    // Colores especiales para eventos
    eventPremium: '#fbbf24', // Amber 400
    eventFeatured: '#ec4899', // Pink 500
    eventFree: '#10b981', // Emerald 500
    eventPaid: '#6366f1', // Indigo 500
  },
  
  // Sistema de espaciado mejorado
  spacing: (n) => n * 8,
  
  // Bordes redondeados modernos
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999
  },
  
  // Sombras profesionales y modernas
  shadow: {
    // Sombra sutil para cards
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8
    },
    
    // Sombra para elementos elevados
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 12
    },
    
    // Sombra para botones
    button: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4
    },
    
    // Sombra para elementos flotantes
    floating: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 16
    }
  },
  
  // Gradientes modernos
  gradients: {
    primary: ['#6366f1', '#8b5cf6', '#a855f7'],
    secondary: ['#10b981', '#059669', '#047857'],
    background: ['#0f172a', '#1e293b', '#334155'],
    card: ['#1e293b', '#334155', '#475569'],
    accent: ['#8b5cf6', '#a855f7', '#ec4899'],
    premium: ['#fbbf24', '#f59e0b', '#d97706'],
    featured: ['#ec4899', '#db2777', '#be185d']
  },
  
  // Tipografía moderna
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semibold: 'System',
      bold: 'System'
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  
  // Animaciones y transiciones
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  },
  
  // Breakpoints para responsive design
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  }
};

export default theme;


