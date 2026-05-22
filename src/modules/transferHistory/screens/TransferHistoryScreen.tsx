import { useCallback, useEffect, useMemo } from 'react';
import {
    RefreshControl,
    SectionList,
    StyleSheet,
    Text,
    View,
    type ListRenderItem,
    type SectionListData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLOR, FONT_SIZE, RADIUS, SPACING } from '../../../shared/theme/tokens';
import { TransferListSkeleton } from '../components/TransferListSkeleton';
import { TransferRow } from '../components/TransferRow';
import { TransferHistoryRoute } from '../navigation/routes';
import type { TransferHistoryStackScreenProps } from '../navigation/types';
import { useTransferHistoryStore } from '../store/useTransferHistoryStore';
import type { Transfer, TransferSection } from '../types';
import { createTransferSections } from '../utils/createTransferSections';

type TransferHistoryScreenProps = TransferHistoryStackScreenProps<
    typeof TransferHistoryRoute.TransferHistory
>;

export function TransferHistoryScreen({ navigation }: TransferHistoryScreenProps) {
    const transfers = useTransferHistoryStore((state) => state.transfers);
    const isLoading = useTransferHistoryStore((state) => state.isLoading);
    const isRefreshing = useTransferHistoryStore((state) => state.isRefreshing);
    const errorMessage = useTransferHistoryStore((state) => state.errorMessage);
    const hasLoaded = useTransferHistoryStore((state) => state.hasLoaded);
    const loadTransfers = useTransferHistoryStore((state) => state.loadTransfers);

    const sections = useMemo(() => createTransferSections(transfers), [transfers]);

    useEffect(() => {
        void loadTransfers();
    }, [loadTransfers]);

    const openTransferDetail = useCallback(
        (transfer: Transfer) => {
            navigation.navigate(TransferHistoryRoute.TransferDetail, {
                refId: transfer.refId,
            });
        },
        [navigation],
    );

    const refreshTransfers = useCallback(() => {
        void loadTransfers({ force: true });
    }, [loadTransfers]);

    const renderTransferItem: ListRenderItem<Transfer> = useCallback(
        ({ item }) => <TransferRow onPressTransfer={openTransferDetail} transfer={item} />,
        [openTransferDetail],
    );

    const renderSectionHeader = useCallback(
        ({ section }: { section: SectionListData<Transfer, TransferSection> }) => (
            <Text style={styles.sectionTitle}>{section.title}</Text>
        ),
        [],
    );

    function renderHeader() {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>Transfer History</Text>
                {errorMessage ? (
                    <View style={styles.errorPanel}>
                        <Text style={styles.errorTitle}>Transfer history unavailable</Text>
                        <Text style={styles.errorDescription}>{errorMessage}</Text>
                    </View>
                ) : null}
            </View>
        );
    }

    function renderEmptyState() {
        if ((isLoading || isRefreshing) && !hasLoaded) {
            return <TransferListSkeleton />;
        }

        if (errorMessage) {
            return null;
        }

        return <Text style={styles.emptyText}>No transfers found.</Text>;
    }

    function keyExtractor(transfer: Transfer) {
        return transfer.refId;
    }

    function renderSeparator() {
        return <View style={styles.rowSeparator} />;
    }

    return (
        <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.container}>
            <SectionList
                alwaysBounceVertical
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={keyExtractor}
                ListEmptyComponent={renderEmptyState}
                ListHeaderComponent={renderHeader}
                refreshControl={
                    <RefreshControl
                        colors={[COLOR.Primary]}
                        refreshing={isRefreshing}
                        tintColor={COLOR.Primary}
                        onRefresh={refreshTransfers}
                    />
                }
                renderItem={renderTransferItem}
                renderSectionHeader={renderSectionHeader}
                sections={sections}
                stickySectionHeadersEnabled={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.Background,
    },
    listContent: {
        paddingBottom: SPACING.Xl,
        paddingHorizontal: SPACING.Lg,
    },
    header: {
        paddingTop: SPACING.Xl,
    },
    title: {
        color: COLOR.Ink,
        fontSize: FONT_SIZE.Xxl,
        fontWeight: '800',
    },
    errorPanel: {
        backgroundColor: COLOR.ErrorBackground,
        borderRadius: RADIUS.Md,
        marginTop: SPACING.Lg,
        padding: SPACING.Lg,
    },
    errorTitle: {
        color: COLOR.ErrorText,
        fontSize: FONT_SIZE.Lg,
        fontWeight: '800',
    },
    errorDescription: {
        color: COLOR.ErrorText,
        fontSize: FONT_SIZE.Md,
        marginTop: SPACING.Xs,
    },
    sectionTitle: {
        color: COLOR.PrimaryDark,
        fontSize: FONT_SIZE.Sm,
        fontWeight: '800',
        marginTop: SPACING.Lg,
        paddingBottom: SPACING.Sm,
        textTransform: 'uppercase',
    },
    rowSeparator: {
        height: 0,
    },
    emptyText: {
        color: COLOR.TextMuted,
        fontSize: FONT_SIZE.Md,
        paddingTop: SPACING.Xl,
        textAlign: 'center',
    },
});
