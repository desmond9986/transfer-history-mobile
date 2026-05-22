import { create } from 'zustand';

import { TRANSFER_ERROR_MESSAGE } from '../constants';
import { getTransfers } from '../services/mockTransferService';
import type { Transfer } from '../types';

type LoadTransfersOptions = {
    force?: boolean;
};

type TransferHistoryStore = {
    transfers: Transfer[];
    isLoading: boolean;
    isRefreshing: boolean;
    errorMessage: string | null;
    hasLoaded: boolean;
    loadTransfers: (options?: LoadTransfersOptions) => Promise<void>;
};

export const useTransferHistoryStore = create<TransferHistoryStore>((set, get) => ({
    transfers: [],
    isLoading: false,
    isRefreshing: false,
    errorMessage: null,
    hasLoaded: false,
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
}));
