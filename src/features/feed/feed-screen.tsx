import type { Post } from './api';
import { FlashList } from '@shopify/flash-list';

import * as React from 'react';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';
import { useAuthStore } from '@/features/auth/use-auth-store';
import { usePosts } from './api';
import { PostCard } from './components/post-card';

export function FeedScreen() {
  const { data, isPending, isError } = usePosts();
  const user = useAuthStore.use.user();

  const renderItem = React.useCallback(
    ({ item }: { item: Post }) => <PostCard {...item} />,
    [],
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-neutral-950">
      <FocusAwareStatusBar />

      {/* Header Card with User DNI */}
      <View className="m-3 rounded-2xl bg-primary-600 p-4 text-white shadow-md">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold tracking-wider text-primary-100 uppercase">
            Carnet Digital de Vacunación
          </Text>
          <Text className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
            ✓ ACTIVO
          </Text>
        </View>

        <Text className="mt-2 text-xl font-bold text-white">
          {user?.name ?? 'Usuario Registrado'}
        </Text>

        <View className="mt-3 flex-row justify-between border-t border-primary-500/40 pt-2">
          <View>
            <Text className="text-xs text-primary-200">DNI / Documento</Text>
            <Text className="text-base font-bold text-white">
              {user?.dni ?? '72849102'}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-primary-200">Estado de Esquema</Text>
            <Text className="text-base font-semibold text-emerald-300">
              Completo
            </Text>
          </View>
        </View>
      </View>

      <Text className="mx-4 mb-1 text-lg font-bold text-gray-800 dark:text-gray-100">
        Registro de Vacunas Aplicadas
      </Text>

      {isError
        ? (
            <View className="p-4">
              <Text className="text-red-500">Error al cargar registros</Text>
            </View>
          )
        : (
            <FlashList
              data={data}
              renderItem={renderItem}
              keyExtractor={(_, index) => `item-${index}`}
              ListEmptyComponent={<EmptyList isLoading={isPending} />}
            />
          )}
    </View>
  );
}
