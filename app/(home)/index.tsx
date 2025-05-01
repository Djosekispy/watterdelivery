import { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator,Text } from 'react-native';


const HomePage = () => {
  
  return (
    <View className="flex-1 bg-gray-400 justify-center items-center">
    <Text className='text-3xl text-black font-bold'>Ola Mundo</Text>
    <Text className='text-xl text-indigo-500 font-bold'>com</Text>
    <Text className='text-2xl text-gray-950 font-bold'>Tailwind Css</Text>
    </View>
    
  );
};

export default HomePage;
