import { useEffect, useState } from 'react';
import { Alert } from "react-native";
import * as SplashScreen from 'expo-splash-screen';

const deadlineDate = new Date(2024, 7, 30);

export default function useExpiryCheck(loaded:boolean) {
    const [alertShown, setAlertShown] = useState(false);

    useEffect(() => {
        if (loaded && !alertShown) {
            const currentDate = new Date();
            if (currentDate > deadlineDate) {
                Alert.alert("The test has expired", "The program will not be downloaded", [
                    { text: "OK", onPress: () => setAlertShown(true) }
                ]);
            } else {
                Alert.alert("Testing is available", `Testing is available until\n${deadlineDate.toLocaleDateString()}`, [
                    { text: "OK", onPress: () => { setAlertShown(true); SplashScreen.hideAsync(); } }
                ]);
            }
        }
    }, [loaded, alertShown]);

    return alertShown;
}