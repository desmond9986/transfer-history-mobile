import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLOR, FONT_SIZE, RADIUS, SPACING } from '../../../shared/theme/tokens';
import { TransferHistoryRoute } from '../navigation/routes';
import type { TransferHistoryStackScreenProps } from '../navigation/types';
import { useTransferHistoryStore } from '../store/useTransferHistoryStore';
import type { Transfer } from '../types';
import {
    formatTransferAmount,
    formatTransferDetailDate,
    formatTransferShareMessage,
} from '../utils/formatTransfer';

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

    async function shareTransferDetails(currentTransfer: Transfer) {
        try {
            await Share.share({
                message: formatTransferShareMessage(currentTransfer),
                title: 'Transfer details',
            });
        } catch {
            Alert.alert('Unable to share transfer details', 'Please try again.');
        }
    }

    function renderSummary(currentTransfer: Transfer) {
        const amountText = formatTransferAmount(currentTransfer.amount);
        const transferDirection = currentTransfer.amount >= 0 ? 'Received' : 'Sent';

        return (
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
        );
    }

    function renderTransferName(currentTransfer: Transfer) {
        return (
            <Text ellipsizeMode="tail" numberOfLines={2} style={styles.transferName}>
                {currentTransfer.transferName}
            </Text>
        );
    }

    function renderDetailList(currentTransfer: Transfer) {
        return (
            <View style={styles.detailList}>
                {renderDetailRow('Reference ID', currentTransfer.refId)}
                {renderDetailRow(
                    'Date & time',
                    formatTransferDetailDate(currentTransfer.transferDate),
                )}
                {renderDetailRow('Recipient', currentTransfer.recipientName)}
            </View>
        );
    }

    function renderShareButton(currentTransfer: Transfer) {
        return (
            <Pressable
                accessibilityRole="button"
                onPress={() => {
                    void shareTransferDetails(currentTransfer);
                }}
                style={({ pressed }) => [
                    styles.shareButton,
                    pressed ? styles.shareButtonPressed : null,
                ]}
            >
                <Text style={styles.shareButtonText}>Share details</Text>
            </Pressable>
        );
    }

    function renderTransferDetail(currentTransfer: Transfer) {
        return (
            <View style={styles.receiptCard}>
                {renderSummary(currentTransfer)}
                {renderTransferName(currentTransfer)}
                {renderDetailList(currentTransfer)}
                {renderShareButton(currentTransfer)}
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
    transferName: {
        backgroundColor: COLOR.PrimarySoft,
        color: COLOR.Ink,
        fontSize: FONT_SIZE.Md,
        fontWeight: '800',
        paddingHorizontal: SPACING.Xl,
        paddingVertical: SPACING.Lg,
        textAlign: 'center',
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
    shareButton: {
        alignItems: 'center',
        backgroundColor: COLOR.Primary,
        borderRadius: 999,
        marginHorizontal: SPACING.Xl,
        marginTop: SPACING.Md,
        marginBottom: SPACING.Xl,
        paddingVertical: SPACING.Md,
    },
    shareButtonPressed: {
        opacity: 0.7,
    },
    shareButtonText: {
        color: COLOR.Surface,
        fontSize: FONT_SIZE.Md,
        fontWeight: '800',
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
