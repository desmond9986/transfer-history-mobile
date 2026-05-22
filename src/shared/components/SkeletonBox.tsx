import { useEffect, useMemo } from 'react';
import {
    Animated,
    StyleSheet,
    type DimensionValue,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

import { COLOR } from '../theme/tokens';

const SKELETON_BORDER_RADIUS = 999;
const SKELETON_OPACITY_MIN = 0.18;
const SKELETON_OPACITY_MAX = 0.36;

type SkeletonBoxProps = {
    height: number;
    width: DimensionValue;
    style?: StyleProp<ViewStyle>;
};

export function SkeletonBox({ height, width, style }: SkeletonBoxProps) {
    const opacity = useMemo(() => new Animated.Value(SKELETON_OPACITY_MIN), []);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    duration: 700,
                    toValue: SKELETON_OPACITY_MAX,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    duration: 700,
                    toValue: SKELETON_OPACITY_MIN,
                    useNativeDriver: true,
                }),
            ]),
        );

        animation.start();

        return () => {
            animation.stop();
        };
    }, [opacity]);

    return <Animated.View style={[styles.box, { height, opacity, width }, style]} />;
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: COLOR.TextMuted,
        borderRadius: SKELETON_BORDER_RADIUS,
    },
});
