import type { AppStackParamList } from './types';

export const AppRoute = {
    TransferHistoryStack: 'TransferHistoryStack',
} as const satisfies Record<keyof AppStackParamList, keyof AppStackParamList>;
