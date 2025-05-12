import * as Location from 'expo-location';
import React, { Children, createContext, ReactNode, useEffect, useState } from 'react';


interface LocationContextProps {
    location: Location.LocationObject | null;
    errorMsg: string | null;
    loading: boolean;
}

interface LocationProviderProps {
    children: ReactNode;
}

export const LocationContext = createContext<LocationContextProps>({
    location: null,
    errorMsg: null,
    loading: true,
});

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);   
  
    useEffect(() => {
    (async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar a localização foi negada.');
                setLoading(false);
                return;
            }

            // Primeiro obtém a localização atual
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });
            setLocation(currentLocation);

            // Depois inicia o watch
            const locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000, // Aumente o intervalo para economizar bateria
                    distanceInterval: 10
                }, 
                (newLocation) => {
                    setLocation(newLocation);
                }
            );

            setLoading(false);

            return () => {
                locationSubscription.remove();
            };
        } catch (error) {
            setErrorMsg('Erro ao obter localização');
            setLoading(false);
        }
    })();
}, []);

    return (
        <LocationContext.Provider value={{location, errorMsg, loading}}>
            {children}
        </LocationContext.Provider>
    )
}