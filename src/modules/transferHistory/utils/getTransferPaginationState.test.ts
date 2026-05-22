import { describe, expect, it } from '@jest/globals';

import { TRANSFER_PAGE_SIZE } from '../constants';
import type { Transfer } from '../types';
import { getTransferPaginationState } from './getTransferPaginationState';

function createTransfers(count: number): Transfer[] {
    return Array.from({ length: count }, (_, index) => ({
        amount: index,
        recipientName: `Recipient ${index}`,
        refId: `TRF-${index}`,
        transferDate: '2026-05-22T00:00:00.000Z',
        transferName: `Transfer ${index}`,
    }));
}

describe('getTransferPaginationState', () => {
    it('keeps pagination open when the returned page is full', () => {
        expect(
            getTransferPaginationState({
                offset: 10,
                transfers: createTransfers(TRANSFER_PAGE_SIZE),
            }),
        ).toEqual({
            hasMoreTransfers: true,
            nextOffset: 20,
        });
    });

    it('closes pagination when the returned page is partial', () => {
        expect(
            getTransferPaginationState({
                offset: 20,
                transfers: createTransfers(3),
            }),
        ).toEqual({
            hasMoreTransfers: false,
            nextOffset: 23,
        });
    });
});
