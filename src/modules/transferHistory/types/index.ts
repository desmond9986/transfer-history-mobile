export type Transfer = {
    refId: string;
    transferDate: string;
    recipientName: string;
    transferName: string;
    amount: number;
};

export type TransferSection = {
    title: string;
    data: Transfer[];
};
