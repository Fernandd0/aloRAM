import { Redirect, Tabs } from 'expo-router';
import * as React from 'react';

import {
  Feed as FeedIcon,
  PhoneIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from '@/components/ui/icons';
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store';

export default function TabLayout() {
  const status = useAuth.use.status();

  if (status !== 'signIn') {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mi Día',
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          tabBarButtonTestID: 'feed-tab',
        }}
      />

      <Tabs.Screen
        name="call"
        options={{
          title: 'Llamar',
          headerShown: false,
          tabBarIcon: ({ color }) => <PhoneIcon color={color} size={24} />,
          tabBarButtonTestID: 'call-tab',
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <StyleIcon color={color} />,
          tabBarButtonTestID: 'history-tab',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
