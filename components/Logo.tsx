
import React from 'react';
import { Droplets } from 'lucide-react';
import { Text, View } from 'react-native';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', vertical = false }) => {
  const sizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  }[size];

  const iconSize = {
    sm: 20,
    md: 28,
    lg: 40
  }[size];

  return (
    <View className={`flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-2`}>
      <Droplets 
        size={iconSize} 
        className="text-agua-600 animate-droplet" 
        fill="rgba(2, 132, 199, 0.2)" 
      />
      <View className={`font-bold ${sizeClass} text-agua-900`}>
        <Text>Água</Text><Text className="text-agua-500">Expressa</Text>
      </View>
    </View>
  );
};

export default Logo;