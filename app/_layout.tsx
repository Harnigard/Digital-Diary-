import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import useDeadlineCheck from '@/components/deadlineControl/useDeadline';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    });

    const alertShown = useDeadlineCheck(loaded);

    if (!loaded || !alertShown) {
        return null;
    }

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
