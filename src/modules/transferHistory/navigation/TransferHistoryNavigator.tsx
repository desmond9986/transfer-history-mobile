import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransferDetailScreen } from '../screens/TransferDetailScreen';
import { TransferHistoryScreen } from '../screens/TransferHistoryScreen';
import { TransferHistoryRoute } from './routes';
import type { TransferHistoryStackParamList } from './types';

const Stack = createNativeStackNavigator<TransferHistoryStackParamList>();

function renderTransferHistoryStackScreens() {
    return (
        <>
            <Stack.Screen
                name={TransferHistoryRoute.TransferHistory}
                component={TransferHistoryScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={TransferHistoryRoute.TransferDetail}
                component={TransferDetailScreen}
                options={{
                    headerBackButtonDisplayMode: 'minimal',
                    title: 'Transfer Detail',
                }}
            />
        </>
    );
}

export function TransferHistoryNavigator() {
    return (
        <Stack.Navigator
            initialRouteName={TransferHistoryRoute.TransferHistory}
            screenOptions={{
                contentStyle: { backgroundColor: '#ffffff' },
            }}
        >
            {renderTransferHistoryStackScreens()}
        </Stack.Navigator>
    );
}
