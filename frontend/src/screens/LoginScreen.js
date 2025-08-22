import { useState } from 'react';
import { Link } from '@react-navigation/native';
import { Screen, Card, Title, Label, Input, Button, ErrorText, Subtitle, Avatar } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';
import { StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const { login, loginLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async () => {
    // Validación básica
    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setError('');
    try {
      await login(username.trim(), password);
      // Si llega aquí, el login fue exitoso
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar size="large" style={styles.logo} />
          <Title variant="hero">🎪 EventHub</Title>
          <Subtitle>Tu plataforma de eventos premium</Subtitle>
        </View>

        <Card style={styles.loginCard}>
          <Title variant="section">🚀 Iniciar Sesión</Title>
          
          <Label>👤 Usuario</Label>
          <Input 
            value={username} 
            onChangeText={setUsername} 
            placeholder="Ingresa tu nombre de usuario" 
            autoCapitalize="none"
            editable={!loginLoading}
            variant="premium"
          />
          
          <Label>🔒 Contraseña</Label>
          <Input 
            value={password} 
            onChangeText={setPassword} 
            placeholder="Ingresa tu contraseña" 
            secureTextEntry
            editable={!loginLoading}
            variant="premium"
          />
          
          <Button 
            title={loginLoading ? "⏳ Iniciando sesión..." : "🎯 Iniciar Sesión"} 
            onPress={onSubmit} 
            loading={loginLoading}
            disabled={loginLoading}
            size="large"
            style={styles.loginButton}
          />
          
          <ErrorText>{error}</ErrorText>
          
          <View style={styles.registerSection}>
            <Label style={styles.registerLabel}>¿No tienes cuenta?</Label>
            <Link to={{ screen: 'Register' }} style={styles.registerLink}>
              ✨ Crear cuenta nueva
            </Link>
          </View>
        </Card>

        <View style={styles.footer}>
          <Subtitle style={styles.footerText}>
            🌟 Descubre eventos increíbles y vive experiencias únicas
          </Subtitle>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing(2)
  },
  
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing(4)
  },
  
  logo: {
    marginBottom: theme.spacing(2)
  },
  
  loginCard: {
    marginBottom: theme.spacing(3)
  },
  
  loginButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  
  registerSection: {
    alignItems: 'center',
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(3),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  
  registerLabel: {
    marginBottom: theme.spacing(1),
    textAlign: 'center'
  },
  
  registerLink: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    textDecorationLine: 'underline'
  },
  
  footer: {
    alignItems: 'center'
  },
  
  footerText: {
    textAlign: 'center',
    fontSize: theme.typography.fontSize.sm,
    opacity: 0.8
  }
});


