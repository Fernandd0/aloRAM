import * as React from 'react';
import { Text, View } from '@/components/ui';

type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isCalling?: boolean;
};

export function AloRAMAvatar({ size = 'md', isCalling = false }: Props) {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-full',
    md: 'w-14 h-14 rounded-full',
    lg: 'w-20 h-20 rounded-2xl',
    xl: 'w-28 h-28 rounded-3xl',
  }[size];

  const textClasses = {
    sm: 'text-sm font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-4xl font-bold',
  }[size];

  return (
    <View className="items-center justify-center">
      {isCalling && (
        <View className="absolute size-36 animate-ping rounded-full bg-emerald-400/20" />
      )}
      <View
        className={`${sizeClasses} items-center justify-center bg-linear-to-tr from-emerald-600 to-teal-500 shadow-md`}
      >
        <Text className={`${textClasses} text-white`}>aR</Text>
      </View>
    </View>
  );
}
