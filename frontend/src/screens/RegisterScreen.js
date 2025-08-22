import { useState } from 'react';
import { Screen, Card, Title, Label, Input, Button, ErrorText } from '../components/UI';
import { useAuth } from '../context/AuthContext';

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
      <Card>
        <Title>Crear cuenta</Title>
        <Label>Nombre</Label>
        <Input 
          value={firstName} 
          onChangeText={setFirstName} 
          placeholder="Nombre"
          editable={!registerLoading}
        />
        <Label>Apellido</Label>
        <Input 
          value={lastName} 
          onChangeText={setLastName} 
          placeholder="Apellido"
          editable={!registerLoading}
        />
        <Label>Usuario</Label>
        <Input 
          value={username} 
          onChangeText={setUsername} 
          placeholder="Usuario" 
          autoCapitalize="none"
          editable={!registerLoading}
        />
        <Label>Contraseña</Label>
        <Input 
          value={password} 
          onChangeText={setPassword} 
          placeholder="Contraseña" 
          secureTextEntry
          editable={!registerLoading}
        />
        <Button 
          title="Registrarme" 
          onPress={onSubmit} 
          loading={registerLoading}
          disabled={registerLoading}
        />
        <ErrorText>{error}</ErrorText>
      </Card>
    </Screen>
  );
}


