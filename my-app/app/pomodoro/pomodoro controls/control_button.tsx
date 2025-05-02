import React, { useRef } from 'react';
import { TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ControlButtonProps {
    isActive: boolean;
    isPaused: boolean;
    progress: number;
    onPress: () => void;
    colors: {
        primary: string;
        white: string;
    };
    isDarkMode: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({
                                                         isActive,
                                                         isPaused,
                                                         progress,
                                                         onPress,
                                                         colors,
                                                         isDarkMode
                                                     }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const animatePress = () => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 50,
                useNativeDriver: true,
            })
        ]).start();
    };

    const iconName = isActive
        ? (isPaused ? 'play' : 'pause')
        : 'play';

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPressIn={animatePress}
                onPress={onPress}
                activeOpacity={0.9}
            >
                <Feather
                    name={iconName}
                    size={28}
                    color={colors.white}
                    style={{ marginLeft: iconName === 'play' ? 3 : 0 }}
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: 24,
    },
    button: {
        width: 66,
        height: 66,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ControlButton;