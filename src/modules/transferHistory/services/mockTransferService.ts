import mockTransfers from '../test/mockTransfers.json';
import { TRANSFER_PAGE_SIZE } from '../constants';
import type { Transfer } from '../types';
import { validateTransferResponse } from '../utils/validateTransferResponse';

type GetTransfersParams = {
    offset?: number;
    count?: number;
};

export async function getTransfers({
    offset = 0,
    count = TRANSFER_PAGE_SIZE,
}: GetTransfersParams = {}): Promise<Transfer[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const transfers = validateTransferResponse(mockTransfers);
    const sortedTransfers = sortTransfersByNewest(transfers);

    // simulate pagination by slicing the sorted transfers array
    return sortedTransfers.slice(offset, offset + count);
}

function sortTransfersByNewest(transfers: Transfer[]) {
    return [...transfers].sort(
        (firstTransfer, secondTransfer) =>
            Date.parse(secondTransfer.transferDate) - Date.parse(firstTransfer.transferDate),
    );
}
