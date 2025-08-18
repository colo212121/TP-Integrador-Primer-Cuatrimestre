import { useState } from 'react';
import { Link } from '@react-navigation/native';
import { Screen, Card, Title, Label, Input, Button, ErrorText } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card>
        <Title>Ingresar</Title>
        <Label>Usuario</Label>
        <Input value={username} onChangeText={setUsername} placeholder="Usuario" autoCapitalize="none" />
        <Label>Contraseña</Label>
        <Input value={password} onChangeText={setPassword} placeholder="Contraseña" secureTextEntry />
        <Button title="Entrar" onPress={onSubmit} loading={loading} />
        <ErrorText>{error}</ErrorText>
        <Link to={{ screen: 'Register' }} style={{ marginTop: 16 }}>Crear cuenta</Link>
      </Card>
    </Screen>
  );
}


