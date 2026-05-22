import { describe, expect, it } from '@jest/globals';

import { validateTransferResponse } from './validateTransferResponse';

describe('validateTransferResponse', () => {
    it('returns valid transfers', () => {
        const transfers = [
            {
                amount: 100,
                recipientName: 'Alice',
                refId: 'TRF-001',
                transferDate: '2026-05-22T00:00:00.000Z',
                transferName: 'Valid transfer',
            },
        ];

        expect(validateTransferResponse(transfers)).toBe(transfers);
    });

    it('throws when required fields are missing or invalid', () => {
        expect(() =>
            validateTransferResponse([
                {
                    amount: '100',
                    recipientName: 'Alice',
                    refId: 'TRF-001',
                    transferDate: 'invalid-date',
                    transferName: 'Invalid transfer',
                },
            ]),
        ).toThrow('Invalid transfer response format');
    });
});
