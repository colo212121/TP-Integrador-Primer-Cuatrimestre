import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen, Card, Title, Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card>
        <Title>Perfil</Title>
        <View style={styles.section}>
          <Text style={styles.label}>Cerrar sesión</Text>
          <Button title="Salir" onPress={handleLogout} loading={loading} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  label: { color: theme.colors.muted }
});


