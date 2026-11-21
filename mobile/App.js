import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Icon from 'react-native-vector-icons/Feather';
import { ActivityIndicator, View } from 'react-native';

// Providers
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { AppProvider, useApp } from './src/context/AppContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import WeekScreen from './src/screens/WeekScreen';
import PDFsScreen from './src/screens/PDFsScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Theme
import theme from './src/data/theme.json';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

const MainApp = () => {
  const { t, loading: languageLoading } = useLanguage();
  const { loading: appLoading } = useApp();

  if (languageLoading || appLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textLighter,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            height: 60
          },
          tabBarLabelStyle: {
            fontSize: 11,
            marginTop: -4,
            fontFamily: theme.typography.fontFamily.semiBold
          }
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ color }) => (
              <Icon name="home" size={24} color={color} />
            )
          }}
        />

        <Tab.Screen
          name="Week"
          component={WeekScreen}
          options={{
            title: t('tabs.week'),
            tabBarIcon: ({ color }) => (
              <Icon name="calendar" size={24} color={color} />
            )
          }}
        />

        <Tab.Screen
          name="PDFs"
          component={PDFsScreen}
          options={{
            title: t('tabs.pdfs'),
            tabBarIcon: ({ color }) => (
              <Icon name="file-text" size={24} color={color} />
            )
          }}
        />

        <Tab.Screen
          name="Reminders"
          component={RemindersScreen}
          options={{
            title: t('tabs.reminders'),
            tabBarIcon: ({ color }) => (
              <Icon name="bell" size={24} color={color} />
            )
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: t('tabs.profile'),
            tabBarIcon: ({ color }) => (
              <Icon name="user" size={24} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </LanguageProvider>
  );
}
