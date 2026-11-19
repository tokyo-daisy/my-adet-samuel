
import axios from 'axios';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  View,
} from 'react-native';

type ProductProps = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export default function PostById() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<ProductProps | null>(null);
  const [loading, setLoading] = useState(true);

  const getProductById = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    try {
      const { data } = await axios.get<ProductProps>(
        `https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items/${id}`
      );

      setProduct(data);
    } catch (error) {
      console.log('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      getProductById();
    }, [getProductById])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-2">Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-lg font-bold">Product not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-6">
      <Image
        source={{ uri: product.image }}
        className="h-40 w-full rounded-lg"
        resizeMode="cover"
      />

      <View className="gap-2 p-2">
        <Text className="font-bold text-xl">
          {product.name}
        </Text>

        <Text className="text-sm text-gray-700">
          {product.description}
        </Text>
      </View>
    </View>
  );
}
