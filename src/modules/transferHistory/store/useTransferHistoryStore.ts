import { create } from 'zustand';

import { TRANSFER_ERROR_MESSAGE } from '../constants';
import { getTransfers } from '../services/mockTransferService';
import {
    TRANSFER_DATE_RANGE_FILTER,
    TRANSFER_TYPE_FILTER,
    type Transfer,
    type TransferDateRangeFilter,
    type TransferTypeFilter,
} from '../types';
import { getTransferPaginationState } from '../utils/getTransferPaginationState';

type LoadTransfersOptions = {
    force?: boolean;
};

type TransferHistoryState = {
    transfers: Transfer[];
    isLoading: boolean;
    isLoadingMore: boolean;
    isRefreshing: boolean;
    errorMessage: string | null;
    hasLoaded: boolean;
    hasMoreTransfers: boolean;
    nextOffset: number;
    transferTypeFilter: TransferTypeFilter;
    dateRangeFilter: TransferDateRangeFilter;
};

type TransferHistoryActions = {
    loadTransfers: (options?: LoadTransfersOptions) => Promise<void>;
    loadMoreTransfers: () => Promise<void>;
    setTransferTypeFilter: (filter: TransferTypeFilter) => void;
    setDateRangeFilter: (filter: TransferDateRangeFilter) => void;
};

type TransferHistoryStore = TransferHistoryState & TransferHistoryActions;

const INITIAL_STATE: TransferHistoryState = {
    transfers: [],
    isLoading: false,
    isLoadingMore: false,
    isRefreshing: false,
    errorMessage: null,
    hasLoaded: false,
    hasMoreTransfers: false,
    nextOffset: 0,
    transferTypeFilter: TRANSFER_TYPE_FILTER.All,
    dateRangeFilter: TRANSFER_DATE_RANGE_FILTER.All,
};

export const useTransferHistoryStore = create<TransferHistoryStore>((set, get) => ({
    ...INITIAL_STATE,
    async loadTransfers(options) {
        const { force = false } = options ?? {};
        const { hasLoaded, isLoading, isLoadingMore, isRefreshing } = get();

        if (isLoading || isRefreshing || isLoadingMore || (hasLoaded && !force)) {
            return;
        }

        set({
            errorMessage: null,
            isLoading: !hasLoaded,
            isRefreshing: force && hasLoaded,
            nextOffset: 0,
        });

        try {
            const nextTransfers = await getTransfers();
            const paginationState = getTransferPaginationState({
                offset: 0,
                transfers: nextTransfers,
            });

            set({
                transfers: nextTransfers,
                hasLoaded: true,
                hasMoreTransfers: paginationState.hasMoreTransfers,
                isLoading: false,
                isRefreshing: false,
                nextOffset: paginationState.nextOffset,
            });
        } catch {
            set({
                errorMessage: TRANSFER_ERROR_MESSAGE.LoadFailed,
                isLoading: false,
                isRefreshing: false,
            });
        }
    },
    async loadMoreTransfers() {
        const { hasMoreTransfers, isLoading, isLoadingMore, isRefreshing, nextOffset } = get();

        if (!hasMoreTransfers || isLoading || isLoadingMore || isRefreshing) {
            return;
        }

        set({
            errorMessage: null,
            isLoadingMore: true,
        });

        try {
            const nextTransfers = await getTransfers({
                offset: nextOffset,
            });
            const paginationState = getTransferPaginationState({
                offset: nextOffset,
                transfers: nextTransfers,
            });

            set((state) => ({
                transfers: [...state.transfers, ...nextTransfers],
                hasMoreTransfers: paginationState.hasMoreTransfers,
                isLoadingMore: false,
                nextOffset: paginationState.nextOffset,
            }));
        } catch {
            set({
                errorMessage: TRANSFER_ERROR_MESSAGE.LoadFailed,
                isLoadingMore: false,
            });
        }
    },
    setTransferTypeFilter(filter) {
        set({ transferTypeFilter: filter });
    },
    setDateRangeFilter(filter) {
        set({ dateRangeFilter: filter });
    },
}));
