import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { EventProvider } from './src/context/EventContext';
import { LocationProvider } from './src/context/LocationContext';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './src/theme';

export default function App() {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
      text: theme.colors.text,
      primary: theme.colors.primary,
      card: '#fff'
    }
  };

  return (
    <AuthProvider>
      <EventProvider>
        <LocationProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </LocationProvider>
      </EventProvider>
    </AuthProvider>
  );
}
