import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { TRANSFER_DATE_RANGE_FILTER, TRANSFER_TYPE_FILTER, type Transfer } from '../types';
import { filterTransfers } from './filterTransfers';

const transfers: Transfer[] = [
    {
        amount: 100,
        recipientName: 'Alice',
        refId: 'TRF-001',
        transferDate: '2026-05-22T00:00:00.000Z',
        transferName: 'Received transfer',
    },
    {
        amount: -50,
        recipientName: 'Ben',
        refId: 'TRF-002',
        transferDate: '2026-05-20T00:00:00.000Z',
        transferName: 'Sent transfer',
    },
    {
        amount: -25,
        recipientName: 'Chloe',
        refId: 'TRF-003',
        transferDate: '2026-04-01T00:00:00.000Z',
        transferName: 'Old transfer',
    },
];

describe('filterTransfers', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-05-23T12:00:00.000Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('filters by received and sent transfers', () => {
        expect(
            filterTransfers({
                dateRangeFilter: TRANSFER_DATE_RANGE_FILTER.All,
                transferTypeFilter: TRANSFER_TYPE_FILTER.Received,
                transfers,
            }).map((transfer) => transfer.refId),
        ).toEqual(['TRF-001']);

        expect(
            filterTransfers({
                dateRangeFilter: TRANSFER_DATE_RANGE_FILTER.All,
                transferTypeFilter: TRANSFER_TYPE_FILTER.Sent,
                transfers,
            }).map((transfer) => transfer.refId),
        ).toEqual(['TRF-002', 'TRF-003']);
    });

    it('filters by date range using the current system date', () => {
        expect(
            filterTransfers({
                dateRangeFilter: TRANSFER_DATE_RANGE_FILTER.Last7Days,
                transferTypeFilter: TRANSFER_TYPE_FILTER.All,
                transfers,
            }).map((transfer) => transfer.refId),
        ).toEqual(['TRF-001', 'TRF-002']);
    });
});
