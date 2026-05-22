export type Transfer = {
    refId: string;
    transferDate: string;
    recipientName: string;
    transferName: string;
    amount: number;
};

export const TRANSFER_TYPE_FILTER = {
    All: 'all',
    Received: 'received',
    Sent: 'sent',
} as const;

export type TransferTypeFilter = (typeof TRANSFER_TYPE_FILTER)[keyof typeof TRANSFER_TYPE_FILTER];

export const TRANSFER_DATE_RANGE_FILTER = {
    All: 'all',
    Last7Days: 'last7Days',
    Last30Days: 'last30Days',
    Last90Days: 'last90Days',
} as const;

export type TransferDateRangeFilter =
    (typeof TRANSFER_DATE_RANGE_FILTER)[keyof typeof TRANSFER_DATE_RANGE_FILTER];

export type TransferSection = {
    title: string;
    data: Transfer[];
};
