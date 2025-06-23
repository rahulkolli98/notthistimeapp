import { Tabs } from 'expo-router'
import { Text, StyleSheet } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 5,
          paddingTop: 5,
          height: 85,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'My Lists',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>📋</Text>
          ),
        }}
      />
      
      <Tabs.Screen 
        name="create" 
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>➕</Text>
          ),
        }}
      />
      
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>👤</Text>
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabIcon: {
    textAlign: 'center',
  },
}) 