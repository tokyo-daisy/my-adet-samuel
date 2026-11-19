import { Pencil, Trash2 } from 'lucide-react-native'
import { Image, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    name: string
    description: string
    image: string
    onEdit?: () => void
    onDelete?: () => void
}

export default function Card({ name, description, image, onEdit, onDelete }: Props) {
    return (
        <View className='overflow-hidden rounded-3xl bg-white shadow-md'>
            <Image source={{ uri: image }} style={{ width: '100%', aspectRatio: 4 / 3 }} />

            <View className='gap-1 p-4'>
                <Text className='text-xl font-extrabold text-violet-900'>{name}</Text>
                <Text className='text-sm text-gray-600'>{description}</Text>
            </View>

            {(onEdit || onDelete) && (
                <View className='flex-row justify-end gap-3 px-4 pb-4'>
                    {onEdit && (
                        <TouchableOpacity
                            onPress={onEdit}
                            className='h-10 w-10 items-center justify-center rounded-full bg-violet-100'
                        >
                            <Pencil size={18} color='#6d28d9' />
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity
                            onPress={onDelete}
                            className='h-10 w-10 items-center justify-center rounded-full bg-rose-100'
                        >
                            <Trash2 size={18} color='#e11d48' />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    )
}