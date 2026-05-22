import { describe, expect, it } from '@jest/globals';

import type { Transfer } from '../types';
import {
    formatTransferAmount,
    formatTransferShareMessage,
    getTransferAmountColor,
} from './formatTransfer';

const transfer: Transfer = {
    amount: -42.5,
    recipientName: 'Ben Lee',
    refId: 'TRF-TEST-001',
    transferDate: '2026-05-22T01:10:00.000Z',
    transferName: 'Dinner split',
};

function normalizeAmountText(value: string) {
    return value.replace(/\u00a0/g, ' ');
}

describe('formatTransfer', () => {
    it('formats sent and received amounts with signs', () => {
        expect(normalizeAmountText(formatTransferAmount(-42.5))).toBe('-RM 42.50');
        expect(normalizeAmountText(formatTransferAmount(320))).toBe('+RM 320.00');
    });

    it('returns amount color intent from the amount sign', () => {
        expect(getTransferAmountColor(1)).toBe('credit');
        expect(getTransferAmountColor(-1)).toBe('debit');
    });

    it('formats the share message without adding extra status text', () => {
        const message = normalizeAmountText(formatTransferShareMessage(transfer));

        expect(message).toContain('Transfer details');
        expect(message).toContain('Amount: -RM 42.50');
        expect(message).toContain('Transfer: Dinner split');
        expect(message).toContain('Recipient: Ben Lee');
        expect(message).toContain('Reference ID: TRF-TEST-001');
        expect(message).not.toContain('Status:');
    });
});
