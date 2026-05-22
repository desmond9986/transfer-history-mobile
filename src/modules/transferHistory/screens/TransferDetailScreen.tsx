import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransferHistoryRoute } from '../navigation/routes';
import type { TransferHistoryStackScreenProps } from '../navigation/types';

type TransferDetailScreenProps = TransferHistoryStackScreenProps<
    typeof TransferHistoryRoute.TransferDetail
>;

export function TransferDetailScreen({ navigation, route }: TransferDetailScreenProps) {
    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Transfer Detail</Text>
                <Text style={styles.description}>
                    Placeholder detail screen for reference ID {route.params.refId}.
                </Text>
                <Button title="Back to history" onPress={navigation.goBack} />
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
