import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TransferHistoryStackParamList = {
    TransferHistory: undefined;
    TransferDetail: {
        refId: string;
    };
};

export type TransferHistoryStackScreenProps<RouteName extends keyof TransferHistoryStackParamList> =
    NativeStackScreenProps<TransferHistoryStackParamList, RouteName>;
