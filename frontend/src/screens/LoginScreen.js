import { useState } from 'react';
import { Link } from '@react-navigation/native';
import { Screen, Card, Title, Label, Input, Button, ErrorText } from '../components/UI';
import { useAuth } from '../context/AuthContext';

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
      <Card>
        <Title>Ingresar</Title>
        <Label>Usuario</Label>
        <Input 
          value={username} 
          onChangeText={setUsername} 
          placeholder="Usuario" 
          autoCapitalize="none"
          editable={!loginLoading}
        />
        <Label>Contraseña</Label>
        <Input 
          value={password} 
          onChangeText={setPassword} 
          placeholder="Contraseña" 
          secureTextEntry
          editable={!loginLoading}
        />
        <Button 
          title="Entrar" 
          onPress={onSubmit} 
          loading={loginLoading}
          disabled={loginLoading}
        />
        <ErrorText>{error}</ErrorText>
        <Link to={{ screen: 'Register' }} style={{ marginTop: 16 }}>
          Crear cuenta
        </Link>
      </Card>
    </Screen>
  );
}


