
//NOT used but can be used for better purposes

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface TutorialOverlayProps {
    onDismiss: () => void;
    colors: {
        secondaryText: string;
        background: string;
    };
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onDismiss, colors }) => {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, {
            opacity: fadeAnim,
            backgroundColor: colors.background
        }]}>
            <Text style={[styles.text, { color: colors.secondaryText }]}>
                Swipe left/right to adjust time
            </Text>
            <View style={styles.arrowContainer}>
                <Feather name="chevrons-left" size={24} color={colors.secondaryText} />
                <Feather name="chevrons-right" size={24} color={colors.secondaryText} />
            </View>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                <Feather name="x" size={20} color={colors.secondaryText} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '30%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        marginBottom: 8,
    },
    arrowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 100,
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
    }
});

export default TutorialOverlay;