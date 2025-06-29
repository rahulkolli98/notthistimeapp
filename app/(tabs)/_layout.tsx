import { Tabs } from 'expo-router'
import { Text, StyleSheet } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#323232',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#f5deb3', // beige background like the form
          borderTopWidth: 3,
          borderTopColor: '#000',
          paddingBottom: 8,
          paddingTop: 8,
          height: 90,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '900', // Bold like the form
          marginTop: 4,
        },
        tabBarItemStyle: {
          borderRadius: 5,
          marginHorizontal: 4,
          marginVertical: 4,
          borderWidth: 2,
          borderColor: 'transparent',
        },
        tabBarActiveBackgroundColor: '#add8e6', // light blue when active
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'My Lists',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={[
              styles.tabIcon, 
              { 
                color, 
                fontSize: size + 2,
                textShadowColor: focused ? '#000' : 'transparent',
                textShadowOffset: focused ? { width: 1, height: 1 } : { width: 0, height: 0 },
              }
            ]}>
              📋
            </Text>
          ),
        }}
      />
      
      <Tabs.Screen 
        name="create" 
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={[
              styles.tabIcon, 
              { 
                color, 
                fontSize: size + 2,
                textShadowColor: focused ? '#000' : 'transparent',
                textShadowOffset: focused ? { width: 1, height: 1 } : { width: 0, height: 0 },
              }
            ]}>
              ➕
            </Text>
          ),
        }}
      />
      
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={[
              styles.tabIcon, 
              { 
                color, 
                fontSize: size + 2,
                textShadowColor: focused ? '#000' : 'transparent',
                textShadowOffset: focused ? { width: 1, height: 1 } : { width: 0, height: 0 },
              }
            ]}>
              👤
            </Text>
          ),
        }}
      />
    </Tabs>
  )
} 

const styles = StyleSheet.create({
  tabIcon: {
    textAlign: 'center',
    textShadowRadius: 0,
  },
}) 