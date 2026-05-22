import mockTransfers from '../test/mockTransfers.json';
import type { Transfer } from '../types';
import { validateTransferResponse } from '../utils/validateTransferResponse';

export async function getTransfers(): Promise<Transfer[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return validateTransferResponse(mockTransfers);
}
