import type { Transfer, TransferSection } from '../types';
import { formatTransferMonth } from './formatTransfer';

export function createTransferSections(transfers: Transfer[]): TransferSection[] {
    const groupedTransfers = new Map<string, TransferSection>();
    const sortedTransfers = [...transfers].sort(
        (firstTransfer, secondTransfer) =>
            Date.parse(secondTransfer.transferDate) - Date.parse(firstTransfer.transferDate),
    );

    for (const transfer of sortedTransfers) {
        const sectionKey = getLocalMonthKey(transfer.transferDate);
        const existingSection = groupedTransfers.get(sectionKey);

        if (existingSection) {
            existingSection.data.push(transfer);
            continue;
        }

        groupedTransfers.set(sectionKey, {
            title: formatTransferMonth(transfer.transferDate),
            data: [transfer],
        });
    }

    return Array.from(groupedTransfers.values());
}

function getLocalMonthKey(transferDate: Transfer['transferDate']) {
    const date = new Date(transferDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
}
