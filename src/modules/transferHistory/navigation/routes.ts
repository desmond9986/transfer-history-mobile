import type { TransferHistoryStackParamList } from './types';

export const TransferHistoryRoute = {
    TransferHistory: 'TransferHistory',
    TransferDetail: 'TransferDetail',
} as const satisfies Record<
    keyof TransferHistoryStackParamList,
    keyof TransferHistoryStackParamList
>;
