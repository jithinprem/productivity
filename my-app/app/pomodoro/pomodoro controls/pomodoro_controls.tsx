import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import ControlButton from './control_button';
import SecondaryControls from './secondary_controls';
import TutorialOverlay from './tutorial_overlay';
import useAdaptiveColors from './supporting_components';
import { State, PanGestureHandler, PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';


interface PomodoroControlsProps {
    isActive: boolean;
    isPaused: boolean;
    isWorking: boolean;
    progress: number;
    toggleTimer: () => void;
    skipTimer: () => void;
    resetTimer: (isWorking: boolean) => void;
    adjustTime: (seconds: number) => void;
    isDarkMode: boolean;
    isFirstTime: boolean;
}

const PomodoroControls: React.FC<PomodoroControlsProps> = ({
                                                               isActive,
                                                               isPaused,
                                                               isWorking,
                                                               progress,
                                                               toggleTimer,
                                                               skipTimer,
                                                               resetTimer,
                                                               adjustTime,
                                                               isDarkMode,
                                                               isFirstTime
                                                           }) => {
    const colors = useAdaptiveColors(isDarkMode, isWorking);
    const [showTutorial, setShowTutorial] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    const handleMainPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleTimer();
    };

    const handleSwipe = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
        if (nativeEvent.state === State.ACTIVE) {
            const adjustment = nativeEvent.translationX > 0 ? 60 : -60;
            if (Math.abs(nativeEvent.translationX) > 30) {
                adjustTime(adjustment);
                Haptics.selectionAsync();
            }
        }
    };

    return (
        <View style={styles.container}>

            <Animated.View>
                <ControlButton
                    isActive={isActive}
                    isPaused={isPaused}
                    progress={progress}
                    onPress={handleMainPress}
                    colors={colors}
                    isDarkMode={isDarkMode}
                />
            </Animated.View>
            <SecondaryControls
                skipTimer={skipTimer}
                resetTimer={resetTimer}
                isWorking={isWorking}
                isActive={isActive}
                colors={colors}
                isMuted={isMuted}
                toggleMute={() => setIsMuted(!isMuted)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 28,
        paddingHorizontal: 24,
    },
    indicator: {
        marginBottom: 16
    }
});

export default PomodoroControls;