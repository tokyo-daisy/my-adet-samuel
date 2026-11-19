import Card from '@/src/components/card'
import axios from 'axios'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native'

const API_URL = 'https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items'

type ProductProps = {
  id: string
  name: string
  description: string
  image: string
}

export default function Home() {
  const [products, setProducts] = useState<ProductProps[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const getProducts = async () => {
    try {
      const { data } = await axios.get<ProductProps[]>(API_URL)
      setProducts([...data].sort((a, b) => Number(b.id) - Number(a.id)))
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      getProducts().finally(() => setLoading(false))
    }, [])
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await getProducts()
    setRefreshing(false)
  }

  const deletePost = (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${id}`)
            await getProducts()
          } catch (error) {
            console.log(error)
          }
        },
      },
    ])
  }

  if (loading && products.length === 0) {
    return (
      <View className='flex-1 items-center justify-center bg-violet-50'>
        <ActivityIndicator size='large' color='#7c3aed' />
      </View>
    )
  }

  return (
    <View className='flex-1 bg-violet-50'>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 20 }}
        ListEmptyComponent={
          <Text className='mt-20 text-center text-gray-500'>No posts yet. Make a post!</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/posts/[id]', params: { id: item.id } })}
          >
            <Card
              name={item.name}
              description={item.description}
              image={item.image}
              onEdit={() =>
                router.push({ pathname: '/posts/create', params: { id: item.id } })
              }
              onDelete={() => deletePost(item.id)}
            />
          </Pressable>
        )}
      />
    </View>
  )
}