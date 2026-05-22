import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransferHistoryNavigator } from '../modules/transferHistory/navigation/TransferHistoryNavigator';
import { COLOR } from '../shared/theme/tokens';
import { AppRoute } from './routes';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLOR.Surface,
        card: COLOR.Surface,
    },
};

function renderAppStackScreens() {
    return (
        <>
            <Stack.Screen
                name={AppRoute.TransferHistoryStack}
                component={TransferHistoryNavigator}
            />
        </>
    );
}

export function AppNavigator() {
    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                initialRouteName={AppRoute.TransferHistoryStack}
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLOR.Surface },
                }}
            >
                {renderAppStackScreens()}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
