import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { TRANSFER_DATE_RANGE_FILTER, TRANSFER_TYPE_FILTER, type Transfer } from '../types';
import { getTransfers } from '../services/mockTransferService';
import { useTransferHistoryStore } from './useTransferHistoryStore';

jest.mock('../services/mockTransferService', () => ({
    getTransfers: jest.fn(),
}));

const mockGetTransfers = jest.mocked(getTransfers);

const transfers: Transfer[] = [
    {
        amount: -42.5,
        recipientName: 'Ben Lee',
        refId: 'TRF-001',
        transferDate: '2026-05-22T01:10:00.000Z',
        transferName: 'Dinner split',
    },
];

function resetStore() {
    useTransferHistoryStore.setState({
        dateRangeFilter: TRANSFER_DATE_RANGE_FILTER.All,
        errorMessage: null,
        hasLoaded: false,
        hasMoreTransfers: false,
        isLoading: false,
        isLoadingMore: false,
        isRefreshing: false,
        loadMoreErrorMessage: null,
        nextOffset: 0,
        transferTypeFilter: TRANSFER_TYPE_FILTER.All,
        transfers: [],
    });
}

describe('useTransferHistoryStore', () => {
    beforeEach(() => {
        resetStore();
        mockGetTransfers.mockReset();
    });

    it('loads the first page of transfers', async () => {
        mockGetTransfers.mockResolvedValueOnce(transfers);

        await useTransferHistoryStore.getState().loadTransfers();

        expect(mockGetTransfers).toHaveBeenCalledWith();
        expect(useTransferHistoryStore.getState()).toMatchObject({
            errorMessage: null,
            hasLoaded: true,
            hasMoreTransfers: false,
            isLoading: false,
            nextOffset: 1,
            transfers,
        });
    });

    it('sets the main error message when first page load fails', async () => {
        mockGetTransfers.mockRejectedValueOnce(new Error('Network failed'));

        await useTransferHistoryStore.getState().loadTransfers();

        expect(useTransferHistoryStore.getState()).toMatchObject({
            errorMessage: 'Unable to load transfers.',
            hasLoaded: false,
            isLoading: false,
        });
    });

    it('appends transfers when loading more succeeds', async () => {
        useTransferHistoryStore.setState({
            hasLoaded: true,
            hasMoreTransfers: true,
            nextOffset: 1,
            transfers,
        });
        const nextTransfers: Transfer[] = [
            {
                amount: 320,
                recipientName: 'Chloe Wong',
                refId: 'TRF-002',
                transferDate: '2026-05-21T11:45:00.000Z',
                transferName: 'Project reimbursement',
            },
        ];
        mockGetTransfers.mockResolvedValueOnce(nextTransfers);

        await useTransferHistoryStore.getState().loadMoreTransfers();

        expect(mockGetTransfers).toHaveBeenCalledWith({ offset: 1 });
        expect(useTransferHistoryStore.getState()).toMatchObject({
            hasMoreTransfers: false,
            isLoadingMore: false,
            nextOffset: 2,
            transfers: [...transfers, ...nextTransfers],
        });
    });

    it('sets a footer-level error when loading more fails', async () => {
        useTransferHistoryStore.setState({
            hasLoaded: true,
            hasMoreTransfers: true,
            nextOffset: 1,
            transfers,
        });
        mockGetTransfers.mockRejectedValueOnce(new Error('Network failed'));

        await useTransferHistoryStore.getState().loadMoreTransfers();

        expect(useTransferHistoryStore.getState()).toMatchObject({
            errorMessage: null,
            isLoadingMore: false,
            loadMoreErrorMessage: 'Unable to load more transfers.',
            transfers,
        });
    });

    it('clears stale load-more errors when filters change', () => {
        useTransferHistoryStore.setState({
            loadMoreErrorMessage: 'Unable to load more transfers.',
        });

        useTransferHistoryStore.getState().setTransferTypeFilter(TRANSFER_TYPE_FILTER.Sent);

        expect(useTransferHistoryStore.getState()).toMatchObject({
            loadMoreErrorMessage: null,
            transferTypeFilter: TRANSFER_TYPE_FILTER.Sent,
        });
    });
});
