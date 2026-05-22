import {
    TRANSFER_DATE_RANGE_FILTER,
    TRANSFER_TYPE_FILTER,
    type Transfer,
    type TransferDateRangeFilter,
    type TransferTypeFilter,
} from '../types';

type FilterTransfersParams = {
    transfers: Transfer[];
    transferTypeFilter: TransferTypeFilter;
    dateRangeFilter: TransferDateRangeFilter;
};

const DATE_RANGE_DAYS = {
    [TRANSFER_DATE_RANGE_FILTER.Last7Days]: 7,
    [TRANSFER_DATE_RANGE_FILTER.Last30Days]: 30,
    [TRANSFER_DATE_RANGE_FILTER.Last90Days]: 90,
} as const;

export function filterTransfers({
    transfers,
    transferTypeFilter,
    dateRangeFilter,
}: FilterTransfersParams) {
    const dateRangeStart = getDateRangeStart(dateRangeFilter);

    return transfers.filter(
        (transfer) =>
            matchesTransferType(transfer, transferTypeFilter) &&
            matchesDateRange(transfer, dateRangeStart),
    );
}

function matchesTransferType(transfer: Transfer, transferTypeFilter: TransferTypeFilter) {
    if (transferTypeFilter === TRANSFER_TYPE_FILTER.Received) {
        return transfer.amount >= 0;
    }

    if (transferTypeFilter === TRANSFER_TYPE_FILTER.Sent) {
        return transfer.amount < 0;
    }

    return true;
}

function matchesDateRange(transfer: Transfer, dateRangeStart: Date | null) {
    if (!dateRangeStart) {
        return true;
    }

    return new Date(transfer.transferDate) >= dateRangeStart;
}

function getDateRangeStart(dateRangeFilter: TransferDateRangeFilter) {
    if (dateRangeFilter === TRANSFER_DATE_RANGE_FILTER.All) {
        return null;
    }

    const rangeDays = DATE_RANGE_DAYS[dateRangeFilter];
    const startDate = new Date();

    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - rangeDays + 1);

    return startDate;
}
