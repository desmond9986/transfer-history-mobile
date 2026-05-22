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

type LoadTransfersOptions = {
    force?: boolean;
};

type TransferHistoryStore = {
    transfers: Transfer[];
    isLoading: boolean;
    isRefreshing: boolean;
    errorMessage: string | null;
    hasLoaded: boolean;
    transferTypeFilter: TransferTypeFilter;
    dateRangeFilter: TransferDateRangeFilter;
    loadTransfers: (options?: LoadTransfersOptions) => Promise<void>;
    setTransferTypeFilter: (filter: TransferTypeFilter) => void;
    setDateRangeFilter: (filter: TransferDateRangeFilter) => void;
};

export const useTransferHistoryStore = create<TransferHistoryStore>((set, get) => ({
    transfers: [],
    isLoading: false,
    isRefreshing: false,
    errorMessage: null,
    hasLoaded: false,
    transferTypeFilter: TRANSFER_TYPE_FILTER.All,
    dateRangeFilter: TRANSFER_DATE_RANGE_FILTER.All,
    async loadTransfers(options) {
        const { force = false } = options ?? {};
        const { hasLoaded, isLoading, isRefreshing } = get();

        if (isLoading || isRefreshing || (hasLoaded && !force)) {
            return;
        }

        set({
            isLoading: !force,
            isRefreshing: force,
            errorMessage: null,
        });

        try {
            const transfers = await getTransfers();

            set({
                transfers,
                hasLoaded: true,
                isLoading: false,
                isRefreshing: false,
            });
        } catch {
            set({
                errorMessage: TRANSFER_ERROR_MESSAGE.LoadFailed,
                isLoading: false,
                isRefreshing: false,
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
