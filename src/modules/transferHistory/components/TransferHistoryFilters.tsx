import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLOR, FONT_SIZE, RADIUS, SPACING } from '../../../shared/theme/tokens';
import {
    TRANSFER_DATE_RANGE_FILTER,
    TRANSFER_TYPE_FILTER,
    type TransferDateRangeFilter,
    type TransferTypeFilter,
} from '../types';

type FilterOption<TValue extends string> = {
    label: string;
    value: TValue;
};

type TransferHistoryFiltersProps = {
    dateRangeFilter: TransferDateRangeFilter;
    transferTypeFilter: TransferTypeFilter;
    onChangeDateRangeFilter: (filter: TransferDateRangeFilter) => void;
    onChangeTransferTypeFilter: (filter: TransferTypeFilter) => void;
};

const TRANSFER_TYPE_FILTER_OPTIONS: FilterOption<TransferTypeFilter>[] = [
    { label: 'All', value: TRANSFER_TYPE_FILTER.All },
    { label: 'Received', value: TRANSFER_TYPE_FILTER.Received },
    { label: 'Sent', value: TRANSFER_TYPE_FILTER.Sent },
];

const DATE_RANGE_FILTER_OPTIONS: FilterOption<TransferDateRangeFilter>[] = [
    { label: 'All dates', value: TRANSFER_DATE_RANGE_FILTER.All },
    { label: '7 days', value: TRANSFER_DATE_RANGE_FILTER.Last7Days },
    { label: '30 days', value: TRANSFER_DATE_RANGE_FILTER.Last30Days },
    { label: '90 days', value: TRANSFER_DATE_RANGE_FILTER.Last90Days },
];

export function TransferHistoryFilters({
    dateRangeFilter,
    transferTypeFilter,
    onChangeDateRangeFilter,
    onChangeTransferTypeFilter,
}: TransferHistoryFiltersProps) {
    const [isDateRangeMenuVisible, setIsDateRangeMenuVisible] = useState(false);

    function getSelectedDateRangeOption() {
        return (
            DATE_RANGE_FILTER_OPTIONS.find((option) => option.value === dateRangeFilter) ??
            DATE_RANGE_FILTER_OPTIONS[0]
        );
    }

    function closeDateRangeMenu() {
        setIsDateRangeMenuVisible(false);
    }

    function selectDateRangeFilter(filter: TransferDateRangeFilter) {
        onChangeDateRangeFilter(filter);
        closeDateRangeMenu();
    }

    function renderTransferTypeFilterOption(option: FilterOption<TransferTypeFilter>) {
        const isSelected = option.value === transferTypeFilter;

        return (
            <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                    onChangeTransferTypeFilter(option.value);
                }}
                style={[styles.typeSegment, isSelected ? styles.typeSegmentSelected : null]}
            >
                <Text
                    style={[
                        styles.typeSegmentText,
                        isSelected ? styles.typeSegmentTextSelected : null,
                    ]}
                >
                    {option.label}
                </Text>
            </Pressable>
        );
    }

    function renderDateRangeMenuItem(option: FilterOption<TransferDateRangeFilter>) {
        const isSelected = option.value === dateRangeFilter;

        return (
            <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                    selectDateRangeFilter(option.value);
                }}
                style={[
                    styles.dateRangeMenuItem,
                    isSelected ? styles.dateRangeMenuItemSelected : null,
                ]}
            >
                <Text
                    style={[
                        styles.dateRangeMenuItemText,
                        isSelected ? styles.dateRangeMenuItemTextSelected : null,
                    ]}
                >
                    {option.label}
                </Text>
            </Pressable>
        );
    }

    function renderDateRangeMenu() {
        return (
            <Modal
                transparent
                animationType="fade"
                visible={isDateRangeMenuVisible}
                onRequestClose={closeDateRangeMenu}
            >
                <Pressable style={styles.dateRangeMenuOverlay} onPress={closeDateRangeMenu}>
                    <View style={styles.dateRangeMenuPanel}>
                        {DATE_RANGE_FILTER_OPTIONS.map(renderDateRangeMenuItem)}
                    </View>
                </Pressable>
            </Modal>
        );
    }

    const selectedDateRangeOption = getSelectedDateRangeOption();

    return (
        <View style={styles.filterBar}>
            <View style={styles.typeSegmentedControl}>
                {TRANSFER_TYPE_FILTER_OPTIONS.map(renderTransferTypeFilterOption)}
            </View>
            <Pressable
                accessibilityRole="button"
                onPress={() => {
                    setIsDateRangeMenuVisible(true);
                }}
                style={styles.dateRangeButton}
            >
                <Text style={styles.dateRangeButtonText}>{selectedDateRangeOption.label}</Text>
                <Text style={styles.dateRangeChevron}>⌄</Text>
            </Pressable>
            {renderDateRangeMenu()}
        </View>
    );
}

const styles = StyleSheet.create({
    filterBar: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: SPACING.Sm,
        marginTop: SPACING.Lg,
    },
    typeSegmentedControl: {
        backgroundColor: COLOR.PrimarySoft,
        borderRadius: 999,
        flex: 1,
        flexDirection: 'row',
        padding: 3,
    },
    typeSegment: {
        alignItems: 'center',
        borderRadius: 999,
        flex: 1,
        paddingVertical: SPACING.Sm,
    },
    typeSegmentSelected: {
        backgroundColor: COLOR.Primary,
    },
    typeSegmentText: {
        color: COLOR.PrimaryDark,
        fontSize: FONT_SIZE.Xs,
        fontWeight: '800',
    },
    typeSegmentTextSelected: {
        color: COLOR.Surface,
    },
    dateRangeButton: {
        alignItems: 'center',
        backgroundColor: COLOR.Surface,
        borderColor: COLOR.Border,
        borderRadius: 999,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: SPACING.Xs,
        justifyContent: 'center',
        paddingHorizontal: SPACING.Md,
        paddingVertical: 10,
        width: 104,
    },
    dateRangeButtonText: {
        color: COLOR.Ink,
        fontSize: FONT_SIZE.Xs,
        fontWeight: '800',
    },
    dateRangeChevron: {
        color: COLOR.PrimaryDark,
        fontSize: FONT_SIZE.Xs,
        fontWeight: '800',
    },
    dateRangeMenuOverlay: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: SPACING.Lg,
        paddingTop: 152,
    },
    dateRangeMenuPanel: {
        alignSelf: 'flex-end',
        backgroundColor: COLOR.Surface,
        borderColor: COLOR.Border,
        borderRadius: RADIUS.Md,
        borderWidth: StyleSheet.hairlineWidth,
        elevation: 4,
        minWidth: 156,
        paddingHorizontal: SPACING.Xs,
        paddingVertical: SPACING.Xs,
        shadowColor: COLOR.PrimaryDark,
        shadowOffset: {
            height: 8,
            width: 0,
        },
        shadowOpacity: 0.12,
        shadowRadius: 16,
    },
    dateRangeMenuItem: {
        borderRadius: RADIUS.Sm,
        paddingHorizontal: SPACING.Lg,
        paddingVertical: SPACING.Md,
    },
    dateRangeMenuItemSelected: {
        backgroundColor: COLOR.PrimarySoft,
    },
    dateRangeMenuItemText: {
        color: COLOR.TextMuted,
        fontSize: FONT_SIZE.Md,
        fontWeight: '700',
    },
    dateRangeMenuItemTextSelected: {
        color: COLOR.PrimaryDark,
        fontWeight: '800',
    },
});
