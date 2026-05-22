import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransferHistoryRoute } from '../navigation/routes';
import type { TransferHistoryStackScreenProps } from '../navigation/types';

type TransferHistoryScreenProps = TransferHistoryStackScreenProps<
    typeof TransferHistoryRoute.TransferHistory
>;

export function TransferHistoryScreen({ navigation }: TransferHistoryScreenProps) {
    function openSampleTransfer() {
        navigation.navigate(TransferHistoryRoute.TransferDetail, {
            refId: '123ABC',
        });
    }

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Transfer History</Text>
                <Text style={styles.description}>
                    Placeholder screen for the transfer list. The next step will add mock data and
                    service contracts.
                </Text>
                <Button title="Open sample transfer" onPress={openSampleTransfer} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        rowGap: 16,
    },
    title: {
        color: '#111827',
        fontSize: 28,
        fontWeight: '700',
    },
    description: {
        color: '#4b5563',
        fontSize: 16,
        lineHeight: 24,
    },
});
