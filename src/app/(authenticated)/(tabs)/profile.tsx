import Button from '@/src/components/button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { Camera, User } from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

const STORAGE_KEY = 'profile'

type ProfileType = {
  name: string
  photo: string | null
}

export default function Profile() {
  const { edit } = useLocalSearchParams<{ edit?: string }>()

  const [profile, setProfile] = useState<ProfileType>({ name: 'Your Name', photo: null })
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftPhoto, setDraftPhoto] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(STORAGE_KEY)
        .then((raw) => {
          if (raw) setProfile(JSON.parse(raw))
        })
        .catch((error) => console.log(error))
    }, [])
  )

  const openEdit = () => {
    setDraftName(profile.name)
    setDraftPhoto(profile.photo)
    setEditing(true)
  }

  useEffect(() => {
    if (edit) openEdit()
  }, [edit])

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Palihug allow-a ang access sa photos.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled) {
      setDraftPhoto(result.assets[0].uri)
    }
  }

  const save = async () => {
    if (!draftName.trim()) {
      Alert.alert('Oops', 'It needs to have a name.')
      return
    }
    const updated = { name: draftName.trim(), photo: draftPhoto }
    setProfile(updated)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setEditing(false)
  }

  return (
    <View className='flex-1 bg-violet-50'>
      <View className='h-36 bg-violet-600' />

      <View className='-mt-16 items-center px-6'>
        <View className='h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-violet-200'>
          {profile.photo ? (
            <Image source={{ uri: profile.photo }} style={{ width: 128, height: 128 }} />
          ) : (
            <User size={60} color='white' />
          )}
        </View>

        <Text className='mt-3 text-2xl font-extrabold text-violet-900'>{profile.name}</Text>
        <Text className='text-sm text-violet-500'>Member sa SamBokya</Text>

        <View className='mt-8 w-full gap-3'>
          <Button label='Edit Profile' variant='brand' onPress={openEdit} />
          <Button label='Logout' variant='dangerSoft' onPress={() => router.replace('/login')} />
        </View>
      </View>

      <Modal
        visible={editing}
        transparent
        animationType='slide'
        onRequestClose={() => setEditing(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className='flex-1 justify-end bg-black/40'
        >
          <View className='items-center gap-4 rounded-t-3xl bg-white p-6 pb-10'>
            <Text className='text-xl font-extrabold text-violet-900'>Edit Profile</Text>

            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <View className='h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-violet-200'>
                {draftPhoto ? (
                  <Image source={{ uri: draftPhoto }} style={{ width: 112, height: 112 }} />
                ) : (
                  <User size={52} color='white' />
                )}
              </View>
              <View className='absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full bg-violet-600'>
                <Camera size={18} color='white' />
              </View>
            </TouchableOpacity>

            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder='Name'
              className='h-12 w-full rounded-2xl bg-violet-50 px-4 text-base'
            />

            <View className='w-full gap-3'>
              <Button label='Save' variant='brand' onPress={save} />
              <Button label='Cancel' variant='soft' onPress={() => setEditing(false)} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}