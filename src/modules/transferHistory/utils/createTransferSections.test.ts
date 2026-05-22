import { describe, expect, it } from '@jest/globals';

import type { Transfer } from '../types';
import { createTransferSections } from './createTransferSections';

const transfers: Transfer[] = [
    {
        amount: -25,
        recipientName: 'Farid Hassan',
        refId: 'TRF-003',
        transferDate: '2026-04-30T08:55:00.000Z',
        transferName: 'Carpool share',
    },
    {
        amount: -42.5,
        recipientName: 'Ben Lee',
        refId: 'TRF-001',
        transferDate: '2026-05-22T01:10:00.000Z',
        transferName: 'Dinner split',
    },
    {
        amount: 320,
        recipientName: 'Chloe Wong',
        refId: 'TRF-002',
        transferDate: '2026-05-21T11:45:00.000Z',
        transferName: 'Project reimbursement',
    },
];

describe('createTransferSections', () => {
    it('sorts transfers by newest first and groups them by month', () => {
        const sections = createTransferSections(transfers);

        expect(sections).toHaveLength(2);
        expect(sections[0]).toMatchObject({
            title: 'May 2026',
        });
        expect(sections[0]?.data.map((transfer) => transfer.refId)).toEqual(['TRF-001', 'TRF-002']);
        expect(sections[1]).toMatchObject({
            title: 'April 2026',
        });
        expect(sections[1]?.data.map((transfer) => transfer.refId)).toEqual(['TRF-003']);
    });
});
