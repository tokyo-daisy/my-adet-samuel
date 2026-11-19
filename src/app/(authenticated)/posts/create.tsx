import Button from '@/src/components/button'
import axios from 'axios'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, TextInput, View } from 'react-native'

const API_URL = 'https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items'

export default function Create() {
    const { id } = useLocalSearchParams<{ id?: string }>()
    const isEdit = !!id

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!id) return
        axios
            .get(`${API_URL}/${id}`)
            .then(({ data }) => {
                setName(data.name ?? '')
                setDescription(data.description ?? '')
                setImage(data.image ?? '')
            })
            .catch((error) => console.log(error))
    }, [id])

    const submit = async () => {
        if (!name.trim() || !image.trim()) {
            Alert.alert('Oops', 'Title and Image URL are required.')
            return
        }

        setSaving(true)
        try {
            const payload = { name, description, image }
            if (isEdit) {
                await axios.put(`${API_URL}/${id}`, payload)
            } else {
                await axios.post(API_URL, payload)
            }
            router.back()
        } catch (error) {
            console.log(error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <ScrollView
            className='flex-1 bg-violet-50'
            contentContainerStyle={{ padding: 20 }}
            keyboardShouldPersistTaps='handled'
        >
            <Stack.Screen
                options={{
                    headerTitle: isEdit ? 'Edit Post' : 'New Post',
                    headerStyle: { backgroundColor: '#faf5ff' },
                    headerTitleStyle: { fontWeight: '800', color: '#6d28d9' },
                    headerTintColor: '#6d28d9',
                    headerShadowVisible: false,
                }}
            />

            <View className='gap-4 rounded-3xl bg-white p-5 shadow-md'>
                <View className='gap-1'>
                    <Text className='font-bold text-violet-900'>Title</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="What's on your mind?"
                        className='h-12 rounded-2xl bg-violet-50 px-4 text-base'
                    />
                </View>

                <View className='gap-1'>
                    <Text className='font-bold text-violet-900'>Description</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder='Post something...'
                        multiline
                        className='min-h-24 rounded-2xl bg-violet-50 px-4 py-3 text-base'
                        style={{ textAlignVertical: 'top' }}
                    />
                </View>

                <View className='gap-1'>
                    <Text className='font-bold text-violet-900'>Image URL</Text>
                    <TextInput
                        value={image}
                        onChangeText={setImage}
                        placeholder='https://...'
                        autoCapitalize='none'
                        className='h-12 rounded-2xl bg-violet-50 px-4 text-base'
                    />
                </View>

                <Button
                    label={isEdit ? 'Save Changes' : 'Post'}
                    variant='brand'
                    onPress={submit}
                    disabled={saving}
                />
            </View>
        </ScrollView>
    )
}