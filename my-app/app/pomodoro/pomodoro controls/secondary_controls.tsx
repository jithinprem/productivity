import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SecondaryControlsProps {
    skipTimer: () => void;
    resetTimer: (isWorking: boolean) => void;
    isWorking: boolean;
    isActive: boolean;
    isMuted: boolean;
    toggleMute: () => void;
    colors: {
        secondaryBorder: string;
        secondaryText: string;
        divider: string;
        background: string;
    };
}

const SecondaryControls: React.FC<SecondaryControlsProps> = ({
                                                                 skipTimer,
                                                                 resetTimer,
                                                                 isWorking,
                                                                 isActive,
                                                                 isMuted,
                                                                 toggleMute,
                                                                 colors
                                                             }) => {
    const getSkipLabel = () => {
        if (!isActive) return isWorking ? 'Start Break' : 'Start Focus';
        return 'Skip';
    };

    return (
        <View style={[styles.container, {
            borderColor: colors.secondaryBorder,
            backgroundColor: colors.background
        }]}>
            <TouchableOpacity
                style={styles.button}
                onPress={skipTimer}
                activeOpacity={0.8}
            >
                <Text style={[styles.text, { color: colors.secondaryText }]}>
                    {getSkipLabel()}
                </Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            <TouchableOpacity
                style={styles.button}
                onPress={() => resetTimer(isWorking)}
                activeOpacity={0.8}
            >
                <Text style={[styles.text, { color: colors.secondaryText }]}>
                    Reset
                </Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleMute}
                activeOpacity={0.8}
            >
                <Feather
                    name={isMuted ? 'volume-x' : 'volume-2'}
                    size={18}
                    color={colors.secondaryText}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    iconButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
    },
    divider: {
        width: 1,
        height: 20,
    }
});

export default SecondaryControls;