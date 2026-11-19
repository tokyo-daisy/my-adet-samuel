import { router, Tabs } from 'expo-router'
import { Home, Plus, User } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'

function AddPostButton() {
  return (
    <TouchableOpacity
      onPress={() => router.push('/posts/create')}
      className='mr-4 h-10 w-10 items-center justify-center rounded-full bg-violet-600'
    >
      <Plus size={22} color='white' />
    </TouchableOpacity>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'left',
        headerStyle: { backgroundColor: '#faf5ff', elevation: 0, shadowOpacity: 0 },
        headerTitleStyle: { fontWeight: '800', color: '#6d28d9' },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#c4b5fd',
        tabBarStyle: { backgroundColor: 'white', borderTopWidth: 0, elevation: 12 },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'home',
          headerTitle: 'SamBokya',
          headerRight: () => <AddPostButton />,
          tabBarIcon: ({ color }) => <Home color={color} size={26} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'profile',
          headerTitle: 'profile',
          tabBarIcon: ({ color }) => <User color={color} size={26} />,
        }}
      />
    </Tabs>
  )
}