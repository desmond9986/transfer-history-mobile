import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
    ActivityIndicator,
    Pressable,
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
import { TransferHistoryFilters } from '../components/TransferHistoryFilters';
import { TransferListSkeleton } from '../components/TransferListSkeleton';
import { TransferRow } from '../components/TransferRow';
import { TransferHistoryRoute } from '../navigation/routes';
import type { TransferHistoryStackScreenProps } from '../navigation/types';
import { useTransferHistoryStore } from '../store/useTransferHistoryStore';
import { type Transfer, type TransferSection } from '../types';
import { createTransferSections } from '../utils/createTransferSections';
import { filterTransfers } from '../utils/filterTransfers';

type TransferHistoryScreenProps = TransferHistoryStackScreenProps<
    typeof TransferHistoryRoute.TransferHistory
>;

export function TransferHistoryScreen({ navigation }: TransferHistoryScreenProps) {
    const sectionListRef = useRef<SectionList<Transfer, TransferSection>>(null);

    const transfers = useTransferHistoryStore((state) => state.transfers);
    const isLoading = useTransferHistoryStore((state) => state.isLoading);
    const isLoadingMore = useTransferHistoryStore((state) => state.isLoadingMore);
    const isRefreshing = useTransferHistoryStore((state) => state.isRefreshing);
    const errorMessage = useTransferHistoryStore((state) => state.errorMessage);
    const loadMoreErrorMessage = useTransferHistoryStore((state) => state.loadMoreErrorMessage);
    const hasLoaded = useTransferHistoryStore((state) => state.hasLoaded);
    const hasMoreTransfers = useTransferHistoryStore((state) => state.hasMoreTransfers);
    const transferTypeFilter = useTransferHistoryStore((state) => state.transferTypeFilter);
    const dateRangeFilter = useTransferHistoryStore((state) => state.dateRangeFilter);
    const loadTransfers = useTransferHistoryStore((state) => state.loadTransfers);
    const loadMoreTransfers = useTransferHistoryStore((state) => state.loadMoreTransfers);
    const setTransferTypeFilter = useTransferHistoryStore((state) => state.setTransferTypeFilter);
    const setDateRangeFilter = useTransferHistoryStore((state) => state.setDateRangeFilter);

    const filteredTransfers = useMemo(
        () =>
            filterTransfers({
                transfers,
                transferTypeFilter,
                dateRangeFilter,
            }),
        [dateRangeFilter, transferTypeFilter, transfers],
    );
    const sections = useMemo(() => createTransferSections(filteredTransfers), [filteredTransfers]);

    useEffect(() => {
        void loadTransfers();
    }, [loadTransfers]);

    useEffect(() => {
        if (!loadMoreErrorMessage) {
            return;
        }

        const timeoutId = setTimeout(() => {
            sectionListRef.current?.getScrollResponder()?.scrollToEnd({
                animated: true,
            });
        }, 50);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [loadMoreErrorMessage]);

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

    const requestMoreTransfers = useCallback(() => {
        if (errorMessage || isLoading || isLoadingMore || isRefreshing || !hasMoreTransfers) {
            return;
        }

        void loadMoreTransfers();
    }, [errorMessage, hasMoreTransfers, isLoading, isLoadingMore, isRefreshing, loadMoreTransfers]);

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
                <TransferHistoryFilters
                    dateRangeFilter={dateRangeFilter}
                    transferTypeFilter={transferTypeFilter}
                    onChangeDateRangeFilter={setDateRangeFilter}
                    onChangeTransferTypeFilter={setTransferTypeFilter}
                />
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

    function renderFooter() {
        if (!hasLoaded || errorMessage) {
            return null;
        }

        if (!hasMoreTransfers && filteredTransfers.length === 0) {
            return null;
        }

        if (loadMoreErrorMessage) {
            return (
                <View style={styles.loadMoreErrorPanel}>
                    <Text style={styles.loadMoreErrorText}>{loadMoreErrorMessage}</Text>
                    <Pressable
                        accessibilityRole="button"
                        disabled={isLoadingMore}
                        onPress={requestMoreTransfers}
                        style={({ pressed }) => [
                            styles.retryButton,
                            pressed ? styles.paginationHintPanelPressed : null,
                        ]}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </Pressable>
                </View>
            );
        }

        if (!hasMoreTransfers) {
            return (
                <View style={styles.paginationHintPanel}>
                    <Text style={styles.paginationHintText}>No more transfers</Text>
                </View>
            );
        }

        return (
            <Pressable
                accessibilityRole="button"
                disabled={isLoadingMore}
                onPress={requestMoreTransfers}
                style={({ pressed }) => [
                    styles.loadMoreButton,
                    pressed ? styles.paginationHintPanelPressed : null,
                ]}
            >
                {isLoadingMore ? <ActivityIndicator color={COLOR.Primary} size="small" /> : null}
                <Text style={styles.loadMoreButtonText}>
                    {getPaginationHintText({
                        hasMoreTransfers,
                        isLoadingMore,
                    })}
                </Text>
            </Pressable>
        );
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
                ref={sectionListRef}
                alwaysBounceVertical
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={keyExtractor}
                ListEmptyComponent={renderEmptyState}
                ListFooterComponent={renderFooter}
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

function getPaginationHintText({
    hasMoreTransfers,
    isLoadingMore,
}: {
    hasMoreTransfers: boolean;
    isLoadingMore: boolean;
}) {
    if (isLoadingMore) {
        return 'Loading more transfers...';
    }

    return hasMoreTransfers ? 'Load more' : 'No more transfers';
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
    retryButton: {
        alignSelf: 'center',
        backgroundColor: COLOR.PrimarySoft,
        borderRadius: RADIUS.Md,
        marginTop: SPACING.Md,
        paddingHorizontal: SPACING.Lg,
        paddingVertical: SPACING.Sm,
    },
    retryButtonText: {
        color: COLOR.PrimaryDark,
        fontSize: FONT_SIZE.Sm,
        fontWeight: '800',
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
    paginationHintPanel: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: SPACING.Sm,
        justifyContent: 'center',
        paddingVertical: SPACING.Xl,
    },
    paginationHintPanelPressed: {
        opacity: 0.7,
    },
    paginationHintText: {
        color: COLOR.TextMuted,
        fontSize: FONT_SIZE.Md,
    },
    loadMoreErrorPanel: {
        alignItems: 'center',
        gap: SPACING.Sm,
        paddingVertical: SPACING.Xl,
    },
    loadMoreErrorText: {
        color: COLOR.ErrorText,
        fontSize: FONT_SIZE.Md,
        textAlign: 'center',
    },
    loadMoreButton: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: COLOR.PrimarySoft,
        borderRadius: RADIUS.Md,
        flexDirection: 'row',
        gap: SPACING.Sm,
        justifyContent: 'center',
        marginTop: SPACING.Xl,
        paddingHorizontal: SPACING.Lg,
        paddingVertical: SPACING.Sm,
    },
    loadMoreButtonText: {
        color: COLOR.PrimaryDark,
        fontSize: FONT_SIZE.Sm,
        fontWeight: '800',
    },
    emptyText: {
        color: COLOR.TextMuted,
        fontSize: FONT_SIZE.Md,
        paddingTop: SPACING.Xl,
        textAlign: 'center',
    },
});
