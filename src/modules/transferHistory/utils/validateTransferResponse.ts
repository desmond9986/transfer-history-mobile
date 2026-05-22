import { TRANSFER_ERROR_MESSAGE } from '../constants';
import type { Transfer } from '../types';

export function validateTransferResponse(value: unknown): Transfer[] {
    if (!Array.isArray(value) || !value.every(isTransfer)) {
        throw new Error(TRANSFER_ERROR_MESSAGE.InvalidResponseFormat);
    }

    return value;
}

function isTransfer(value: unknown): value is Transfer {
    return (
        isRecord(value) &&
        isNonEmptyString(value.refId) &&
        isValidDateString(value.transferDate) &&
        isNonEmptyString(value.recipientName) &&
        isNonEmptyString(value.transferName) &&
        isFiniteNumber(value.amount)
    );
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function isValidDateString(value: unknown): value is string {
    return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}
