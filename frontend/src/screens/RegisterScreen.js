import { useState } from 'react';
import { Screen, Card, Title, Label, Input, Button, ErrorText } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await register({ first_name: firstName, last_name: lastName, username, password });
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card>
        <Title>Crear cuenta</Title>
        <Label>Nombre</Label>
        <Input value={firstName} onChangeText={setFirstName} placeholder="Nombre" />
        <Label>Apellido</Label>
        <Input value={lastName} onChangeText={setLastName} placeholder="Apellido" />
        <Label>Usuario</Label>
        <Input value={username} onChangeText={setUsername} placeholder="Usuario" autoCapitalize="none" />
        <Label>Contraseña</Label>
        <Input value={password} onChangeText={setPassword} placeholder="Contraseña" secureTextEntry />
        <Button title="Registrarme" onPress={onSubmit} loading={loading} />
        <ErrorText>{error}</ErrorText>
      </Card>
    </Screen>
  );
}


