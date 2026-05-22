import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLOR, FONT_SIZE, SPACING } from '../../../shared/theme/tokens';
import type { Transfer } from '../types';
import {
    formatTransferAmount,
    formatTransferListDate,
    getTransferAmountColor,
} from '../utils/formatTransfer';

type TransferRowProps = {
    transfer: Transfer;
    onPressTransfer: (transfer: Transfer) => void;
};

export const TransferRow = memo(function TransferRow({
    transfer,
    onPressTransfer,
}: TransferRowProps) {
    const amountText = useMemo(() => formatTransferAmount(transfer.amount), [transfer.amount]);
    const transferDateText = useMemo(
        () => formatTransferListDate(transfer.transferDate),
        [transfer.transferDate],
    );
    const amountColor =
        getTransferAmountColor(transfer.amount) === 'credit' ? COLOR.Credit : COLOR.Debit;

    function handlePress() {
        onPressTransfer(transfer);
    }

    return (
        <Pressable
            accessibilityLabel={`${transfer.transferName}, ${transfer.recipientName}`}
            accessibilityRole="button"
            onPress={handlePress}
            style={({ pressed }) => [styles.container, pressed ? styles.pressed : null]}
        >
            <View style={styles.info}>
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
                    {transfer.transferName}
                </Text>
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.subtitle}>
                    {transfer.recipientName} · {transferDateText}
                </Text>
            </View>
            <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[styles.amount, { color: amountColor }]}
            >
                {amountText}
            </Text>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderBottomColor: COLOR.Border,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: SPACING.Md,
        minHeight: 76,
        paddingVertical: SPACING.Md,
    },
    pressed: {
        opacity: 0.6,
    },
    info: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        color: COLOR.Ink,
        fontSize: FONT_SIZE.Lg,
        fontWeight: '700',
    },
    subtitle: {
        color: COLOR.TextMuted,
        fontSize: FONT_SIZE.Md,
        marginTop: SPACING.Xs,
    },
    amount: {
        flexShrink: 1,
        fontSize: FONT_SIZE.Lg,
        fontWeight: '800',
        maxWidth: '42%',
        minWidth: 96,
        textAlign: 'right',
    },
});
