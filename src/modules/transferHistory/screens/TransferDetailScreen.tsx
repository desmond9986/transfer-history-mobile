import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLOR, FONT_SIZE, RADIUS, SPACING } from '../../../shared/theme/tokens';
import { TransferHistoryRoute } from '../navigation/routes';
import type { TransferHistoryStackScreenProps } from '../navigation/types';
import { useTransferHistoryStore } from '../store/useTransferHistoryStore';
import type { Transfer } from '../types';
import { formatTransferAmount, formatTransferDetailDate } from '../utils/formatTransfer';

type TransferDetailScreenProps = TransferHistoryStackScreenProps<
    typeof TransferHistoryRoute.TransferDetail
>;

export function TransferDetailScreen({ route }: TransferDetailScreenProps) {
    const { refId } = route.params;
    const transfers = useTransferHistoryStore((state) => state.transfers);
    const errorMessage = useTransferHistoryStore((state) => state.errorMessage);

    const transfer = useMemo(
        () => transfers.find((currentTransfer) => currentTransfer.refId === refId),
        [refId, transfers],
    );

    function renderMissingState() {
        return (
            <View style={styles.feedbackPanel}>
                <Text style={styles.feedbackTitle}>Transfer unavailable</Text>
                <Text style={styles.feedbackDescription}>
                    {errorMessage ?? 'The selected transfer could not be found.'}
                </Text>
            </View>
        );
    }

    function renderDetailRow(label: string, value: string) {
        return (
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text ellipsizeMode="tail" numberOfLines={2} style={styles.detailValue}>
                    {value}
                </Text>
            </View>
        );
    }

    function renderTransferDetail(currentTransfer: Transfer) {
        const amountText = formatTransferAmount(currentTransfer.amount);
        const transferDirection = currentTransfer.amount >= 0 ? 'Received' : 'Sent';

        return (
            <View style={styles.receiptCard}>
                <View style={styles.summaryPanel}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryLabel}>Transfer</Text>
                        <View style={styles.statusPill}>
                            <Text style={styles.statusPillText}>{transferDirection}</Text>
                        </View>
                    </View>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={styles.amount}>
                        {amountText}
                    </Text>
                </View>

                <View style={styles.transferPanel}>
                    <Text style={styles.transferLabel}>Transfer</Text>
                    <Text ellipsizeMode="tail" numberOfLines={2} style={styles.transferName}>
                        {currentTransfer.transferName}
                    </Text>
                </View>

                <View style={styles.detailList}>
                    {renderDetailRow('Reference ID', currentTransfer.refId)}
                    {renderDetailRow(
                        'Date & time',
                        formatTransferDetailDate(currentTransfer.transferDate),
                    )}
                    {renderDetailRow('Recipient', currentTransfer.recipientName)}
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {transfer ? renderTransferDetail(transfer) : renderMissingState()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.Background,
    },
    content: {
        padding: SPACING.Lg,
    },
    receiptCard: {
        backgroundColor: COLOR.Surface,
        borderRadius: RADIUS.Lg,
        elevation: 2,
        shadowColor: COLOR.PrimaryDark,
        shadowOffset: {
            height: 8,
            width: 0,
        },
        shadowOpacity: 0.08,
        shadowRadius: 18,
    },
    summaryPanel: {
        backgroundColor: COLOR.Primary,
        borderTopLeftRadius: RADIUS.Lg,
        borderTopRightRadius: RADIUS.Lg,
        padding: SPACING.Xl,
    },
    summaryHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryLabel: {
        color: COLOR.Surface,
        fontSize: FONT_SIZE.Md,
        fontWeight: '700',
        opacity: 0.9,
    },
    amount: {
        color: COLOR.Surface,
        fontSize: FONT_SIZE.Xxl,
        fontWeight: '800',
        marginTop: SPACING.Xl,
    },
    statusPill: {
        backgroundColor: COLOR.Surface,
        borderRadius: 999,
        paddingHorizontal: SPACING.Md,
        paddingVertical: SPACING.Xs,
    },
    statusPillText: {
        color: COLOR.PrimaryDark,
        fontSize: FONT_SIZE.Sm,
        fontWeight: '800',
    },
    transferPanel: {
        backgroundColor: COLOR.PrimarySoft,
        flexDirection: 'row',
        gap: SPACING.Md,
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.Xl,
        paddingVertical: SPACING.Lg,
    },
    transferLabel: {
        color: COLOR.PrimaryDark,
        fontSize: FONT_SIZE.Md,
        fontWeight: '700',
    },
    transferName: {
        color: COLOR.Ink,
        flex: 1,
        fontSize: FONT_SIZE.Md,
        fontWeight: '800',
        textAlign: 'right',
    },
    detailList: {
        paddingHorizontal: SPACING.Xl,
    },
    detailRow: {
        borderTopColor: COLOR.Border,
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: SPACING.Lg,
        justifyContent: 'space-between',
        paddingVertical: SPACING.Lg,
    },
    detailLabel: {
        color: COLOR.TextMuted,
        flex: 1,
        fontSize: FONT_SIZE.Md,
    },
    detailValue: {
        color: COLOR.Ink,
        flex: 1.4,
        fontSize: FONT_SIZE.Md,
        fontWeight: '700',
        textAlign: 'right',
    },
    feedbackPanel: {
        alignItems: 'center',
        backgroundColor: COLOR.Surface,
        borderRadius: RADIUS.Lg,
        padding: SPACING.Xl,
    },
    feedbackTitle: {
        color: COLOR.Ink,
        fontSize: FONT_SIZE.Lg,
        fontWeight: '800',
    },
    feedbackDescription: {
        color: COLOR.TextMuted,
        fontSize: FONT_SIZE.Md,
        marginTop: SPACING.Sm,
        textAlign: 'center',
    },
});
