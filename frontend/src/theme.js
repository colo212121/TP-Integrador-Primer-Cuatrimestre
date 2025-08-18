const theme = {
  colors: {
    primary: '#2563eb',
    secondary: '#10b981',
    background: '#f6f7fb',
    text: '#111827',
    muted: '#6b7280',
    card: '#ffffff',
    danger: '#ef4444',
    border: '#e5e7eb'
  },
  spacing: (n) => n * 8,
  radius: {
    sm: 8,
    md: 12,
    lg: 16
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2
    }
  }
};

export default theme;


