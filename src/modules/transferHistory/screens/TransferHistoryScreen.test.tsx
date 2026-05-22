import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import type { ComponentProps } from 'react';

import { TransferHistoryRoute } from '../navigation/routes';
import { useTransferHistoryStore } from '../store/useTransferHistoryStore';
import { TRANSFER_DATE_RANGE_FILTER, TRANSFER_TYPE_FILTER, type Transfer } from '../types';
import { TransferHistoryScreen } from './TransferHistoryScreen';

type TransferHistoryScreenProps = ComponentProps<typeof TransferHistoryScreen>;

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
        hasLoaded: true,
        hasMoreTransfers: true,
        isLoading: false,
        isLoadingMore: false,
        isRefreshing: false,
        loadMoreErrorMessage: null,
        nextOffset: 1,
        transferTypeFilter: TRANSFER_TYPE_FILTER.All,
        transfers,
    });
}

function renderTransferHistoryScreen() {
    const navigation = {
        navigate: jest.fn(),
    } as unknown as TransferHistoryScreenProps['navigation'];
    const route = {
        key: TransferHistoryRoute.TransferHistory,
        name: TransferHistoryRoute.TransferHistory,
    } as TransferHistoryScreenProps['route'];

    return render(<TransferHistoryScreen navigation={navigation} route={route} />);
}

describe('TransferHistoryScreen', () => {
    it('shows a footer retry action for load-more failures', () => {
        resetStore();
        useTransferHistoryStore.setState({
            loadMoreErrorMessage: 'Unable to load more transfers.',
        });

        renderTransferHistoryScreen();

        expect(screen.getByText('Unable to load more transfers.')).toBeTruthy();
        expect(screen.getByText('Retry')).toBeTruthy();
        expect(screen.queryByText('Transfer history unavailable')).toBeNull();
    });
});
