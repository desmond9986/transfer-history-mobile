import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransferHistoryRoute } from '../navigation/routes';
import type { TransferHistoryStackScreenProps } from '../navigation/types';
import { useTransferHistoryStore } from '../store/useTransferHistoryStore';

type TransferHistoryScreenProps = TransferHistoryStackScreenProps<
    typeof TransferHistoryRoute.TransferHistory
>;

export function TransferHistoryScreen({ navigation }: TransferHistoryScreenProps) {
    const transfers = useTransferHistoryStore((state) => state.transfers);
    const isLoading = useTransferHistoryStore((state) => state.isLoading);
    const errorMessage = useTransferHistoryStore((state) => state.errorMessage);
    const loadTransfers = useTransferHistoryStore((state) => state.loadTransfers);

    const latestTransfer = transfers[0];
    const statusMessage =
        errorMessage ??
        (isLoading
            ? 'Loading transfer data...'
            : `${transfers.length} mock transfers loaded from the store.`);

    useEffect(() => {
        void loadTransfers();
    }, [loadTransfers]);

    function openSampleTransfer() {
        if (!latestTransfer) {
            return;
        }

        navigation.navigate(TransferHistoryRoute.TransferDetail, {
            refId: latestTransfer.refId,
        });
    }

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Transfer History</Text>
                <Text style={[styles.description, errorMessage ? styles.errorText : null]}>
                    {statusMessage}
                </Text>
                <Button
                    disabled={!latestTransfer}
                    title="Open latest transfer"
                    onPress={openSampleTransfer}
                />
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
    errorText: {
        color: '#b42318',
    },
});
