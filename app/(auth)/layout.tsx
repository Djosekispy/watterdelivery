import { Slot } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";

export default function HomeLayout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar backgroundColor='transparent' translucent barStyle='dark-content' />
            <Slot/>
        </SafeAreaView>
    );
}
