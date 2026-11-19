import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface BtnProps extends TouchableOpacityProps {
    label: string
    variant?: 'primary' | 'danger' | 'brand' | 'soft' | 'dangerSoft'
}

const styles = {
    primary: { box: 'h-14 bg-blue-500', text: 'text-white uppercase text-xl font-extrabold' },
    danger: { box: 'h-14 bg-red-500', text: 'text-white uppercase text-xl font-extrabold' },
    brand: { box: 'h-12 rounded-full bg-violet-600', text: 'text-white text-base font-bold' },
    soft: { box: 'h-12 rounded-full bg-violet-100', text: 'text-violet-700 text-base font-bold' },
    dangerSoft: { box: 'h-12 rounded-full bg-rose-100', text: 'text-rose-600 text-base font-bold' },
}

export default function Button({ label, variant = 'primary', className, ...props }: BtnProps) {
    const s = styles[variant]

    return (
        <TouchableOpacity
            className={`items-center justify-center ${s.box} ${props.disabled ? 'opacity-50' : ''} ${className ?? ''}`}
            {...props}
        >
            <Text className={s.text}>{label}</Text>
        </TouchableOpacity>
    )
}