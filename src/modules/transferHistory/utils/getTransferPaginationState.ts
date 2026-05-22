import { TRANSFER_PAGE_SIZE } from '../constants';
import type { Transfer } from '../types';

type GetTransferPaginationStateParams = {
    offset: number;
    transfers: Transfer[];
};

export function getTransferPaginationState({
    offset,
    transfers,
}: GetTransferPaginationStateParams) {
    return {
        hasMoreTransfers: transfers.length === TRANSFER_PAGE_SIZE,
        nextOffset: offset + transfers.length,
    };
}
