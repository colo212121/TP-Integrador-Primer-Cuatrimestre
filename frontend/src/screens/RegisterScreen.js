import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen, Card, Title, Label, Input, Button, ErrorText, Subtitle, Avatar } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

export default function RegisterScreen({ navigation }) {
  const { register, registerLoading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async () => {
    // Validación básica
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setError('');
    try {
      const result = await register({ 
        first_name: firstName.trim(), 
        last_name: lastName.trim(), 
        username: username.trim(), 
        password 
      });
      
      // Mostrar mensaje de éxito y navegar de vuelta
      alert(result.message || 'Usuario registrado exitosamente');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar size="large" style={styles.logo} />
          <Title variant="hero">✨ Únete a EventHub</Title>
          <Subtitle>Crea tu cuenta y descubre eventos increíbles</Subtitle>
        </View>

        <Card style={styles.registerCard}>
          <Title variant="section">📝 Crear Cuenta</Title>
          
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Label>👤 Nombre</Label>
              <Input 
                value={firstName} 
                onChangeText={setFirstName} 
                placeholder="Tu nombre"
                editable={!registerLoading}
                variant="premium"
              />
            </View>
            <View style={styles.nameField}>
              <Label>👤 Apellido</Label>
              <Input 
                value={lastName} 
                onChangeText={setLastName} 
                placeholder="Tu apellido"
                editable={!registerLoading}
                variant="premium"
              />
            </View>
          </View>
          
          <Label>🎯 Usuario</Label>
          <Input 
            value={username} 
            onChangeText={setUsername} 
            placeholder="Elige un nombre de usuario" 
            autoCapitalize="none"
            editable={!registerLoading}
            variant="premium"
          />
          
          <Label>🔒 Contraseña</Label>
          <Input 
            value={password} 
            onChangeText={setPassword} 
            placeholder="Crea una contraseña segura" 
            secureTextEntry
            editable={!registerLoading}
            variant="premium"
          />
          
          <Button 
            title={registerLoading ? "⏳ Creando cuenta..." : "🚀 Crear Cuenta"} 
            onPress={onSubmit} 
            loading={registerLoading}
            disabled={registerLoading}
            size="large"
            style={styles.registerButton}
          />
          
          <ErrorText>{error}</ErrorText>
          
          <View style={styles.loginSection}>
            <Label style={styles.loginLabel}>¿Ya tienes cuenta?</Label>
            <Button
              title="🔐 Iniciar Sesión"
              variant="ghost"
              size="small"
              onPress={() => navigation.goBack()}
              style={styles.loginButton}
            />
          </View>
        </Card>

        <View style={styles.footer}>
          <Subtitle style={styles.footerText}>
            🌟 Únete a nuestra comunidad y vive experiencias únicas
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
  
  registerCard: {
    marginBottom: theme.spacing(3)
  },
  
  nameRow: {
    flexDirection: 'row',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  
  nameField: {
    flex: 1
  },
  
  registerButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  
  loginSection: {
    alignItems: 'center',
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(3),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  
  loginLabel: {
    marginBottom: theme.spacing(1),
    textAlign: 'center'
  },
  
  loginButton: {
    minWidth: 150
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


