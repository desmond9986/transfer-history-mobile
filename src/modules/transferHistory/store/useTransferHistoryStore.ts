import { create } from 'zustand';

import { TRANSFER_ERROR_MESSAGE } from '../constants';
import { getTransfers } from '../services/mockTransferService';
import type { Transfer } from '../types';

type TransferHistoryStore = {
    transfers: Transfer[];
    isLoading: boolean;
    errorMessage: string | null;
    hasLoaded: boolean;
    loadTransfers: () => Promise<void>;
};

export const useTransferHistoryStore = create<TransferHistoryStore>((set, get) => ({
    transfers: [],
    isLoading: false,
    errorMessage: null,
    hasLoaded: false,
    async loadTransfers() {
        const { hasLoaded, isLoading } = get();

        if (isLoading || hasLoaded) {
            return;
        }

        set({
            isLoading: true,
            errorMessage: null,
        });

        try {
            const transfers = await getTransfers();

            set({
                transfers,
                hasLoaded: true,
                isLoading: false,
            });
        } catch {
            set({
                errorMessage: TRANSFER_ERROR_MESSAGE.LoadFailed,
                isLoading: false,
            });
        }
    },
}));
