import type { Transfer } from '../types';

const amountFormatter = new Intl.NumberFormat('en-MY', {
    currency: 'MYR',
    minimumFractionDigits: 2,
    style: 'currency',
});

const listDateFormatter = new Intl.DateTimeFormat('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const detailDateFormatter = new Intl.DateTimeFormat('en-MY', {
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
});

const monthFormatter = new Intl.DateTimeFormat('en-MY', {
    month: 'long',
    year: 'numeric',
});

export function formatTransferAmount(amount: Transfer['amount']) {
    const formattedAmount = amountFormatter.format(Math.abs(amount)).replace('MYR', 'RM');
    const sign = amount >= 0 ? '+' : '-';

    return `${sign}${formattedAmount}`;
}

export function formatTransferListDate(transferDate: Transfer['transferDate']) {
    return listDateFormatter.format(new Date(transferDate));
}

export function formatTransferDetailDate(transferDate: Transfer['transferDate']) {
    return detailDateFormatter.format(new Date(transferDate));
}

export function formatTransferShareMessage(transfer: Transfer) {
    return [
        'Transfer details',
        `Amount: ${formatTransferAmount(transfer.amount)}`,
        `Transfer: ${transfer.transferName}`,
        `Recipient: ${transfer.recipientName}`,
        `Reference ID: ${transfer.refId}`,
        `Date & time: ${formatTransferDetailDate(transfer.transferDate)}`,
    ].join('\n');
}

export function formatTransferMonth(transferDate: Transfer['transferDate']) {
    return monthFormatter.format(new Date(transferDate));
}

export function getTransferAmountColor(amount: Transfer['amount']) {
    return amount >= 0 ? 'credit' : 'debit';
}
