import mockTransfers from '../test/mockTransfers.json';
import type { Transfer } from '../types/transfer';
import { validateTransferResponse } from '../utils/validateTransferResponse';

export async function getTransfers(): Promise<Transfer[]> {
    return validateTransferResponse(mockTransfers);
}
