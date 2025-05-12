import * as Location from 'expo-location';
import React, { Children, createContext, ReactNode, useEffect, useState } from 'react';


interface LocationContextProps {
    location: Location.LocationObject | null;
    errorMsg: string | null;
}

interface LocationProviderProps {
    children: ReactNode;
}

export const LocationContext = createContext<LocationContextProps>({
    location: null,
    errorMsg: null,
});

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            // Verifica a permissão para acessar a localização
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar a localização foi negada.');
                return;
            }

            //Obtém a localização em tempo real
            const locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval:3
                }, 
                (newLocation) =>{
                    setLocation(newLocation);
                }
            );

            // Limpiza ao desmontar o componente
            return ()=>{
                locationSubscription.remove();
            };
        })();
    }, []);

    return (
        <LocationContext.Provider value={{location, errorMsg}}>
            {children}
        </LocationContext.Provider>
    )
}