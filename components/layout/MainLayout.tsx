import React from 'react';
import { View } from 'react-native';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <View className="flex flex-col min-h-screen">
      <Header />
      <View className="flex-1">
        {children}
      </View>
      <Footer />
    </View>
  );
};

export default MainLayout;