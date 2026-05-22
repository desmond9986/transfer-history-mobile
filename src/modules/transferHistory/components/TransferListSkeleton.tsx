import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { SkeletonBox } from '../../../shared/components/SkeletonBox';
import { COLOR, SPACING } from '../../../shared/theme/tokens';

const SKELETON_ROW_COUNT = 6;

export function TransferListSkeleton() {
    const rows: ReactElement[] = [];

    for (let index = 0; index < SKELETON_ROW_COUNT; index += 1) {
        rows.push(
            <View key={index} style={styles.row}>
                <View style={styles.info}>
                    <SkeletonBox height={16} width="72%" />
                    <SkeletonBox height={14} width="52%" />
                </View>
                <SkeletonBox height={16} width={88} />
            </View>,
        );
    }

    return <View style={styles.container}>{rows}</View>;
}

const styles = StyleSheet.create({
    container: {
        paddingTop: SPACING.Lg,
    },
    row: {
        alignItems: 'center',
        borderBottomColor: COLOR.Border,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: SPACING.Md,
        minHeight: 76,
        paddingVertical: SPACING.Md,
    },
    info: {
        flex: 1,
        gap: SPACING.Sm,
    },
});
