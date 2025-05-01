import React from 'react';
import { View, Text, StyleSheet, Animated, useColorScheme } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import {useTheme} from "@/app/themecontext";

// Define the AnimatedCircle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Constants
const CIRCLE_SIZE = 260;

interface TimerCircleProps {
    time: string;
    isActive: boolean;
    isPaused: boolean;
    isWorking: boolean;
    animatedValue: Animated.Value;
    progressAnimation: Animated.AnimatedInterpolation<any>;
}
// Format time
const formatTime = (seconds: any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}


const TimerCircle: React.FC<TimerCircleProps> = ({
     time,
     isActive,
     isPaused,
     isWorking,
     animatedValue,
     progressAnimation,
 }) => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    const dynamicStyles = {
        timerCircle: {
            borderColor: isWorking
                ? isDarkMode ? '#ff6b6b' : '#fa5252'
                : isDarkMode ? '#4dabf7' : '#339af0',
            shadowColor: isWorking
                ? isDarkMode ? '#ff6b6b' : '#fa5252'
                : isDarkMode ? '#4dabf7' : '#339af0',
        },
    }

    return (
        <View style={[styles.timerContainer, dynamicStyles.timerCircle]}>
            <View style={[
                styles.timerCircle,
                { backgroundColor: isDarkMode ? '#2d3436' : '#f8f9fa' }
            ]}>
                <Animated.View style={[styles.progressRing, {
                    transform: [{ scale: animatedValue }],
                    opacity: progressAnimation
                }]}>
                    <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svgContainer}>
                        <AnimatedCircle
                            cx={CIRCLE_SIZE / 2}
                            cy={CIRCLE_SIZE / 2}
                            r={(CIRCLE_SIZE / 2) - 10} // Slightly smaller than container
                            fill="none"
                            stroke={isWorking ?
                                (isDarkMode ? '#ff6b6b' : '#fa5252') :
                                (isDarkMode ? '#4dabf7' : '#339af0')}
                            strokeWidth={10}
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * ((CIRCLE_SIZE / 2) - 10)}
                            strokeDashoffset={progressAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [2 * Math.PI * ((CIRCLE_SIZE / 2) - 10), 0]
                            })}
                            transform={[{ rotate: '-90deg' }]} // Start from top
                        />
                    </Svg>
                </Animated.View>

                <Text style={[styles.timeText, { color: isDarkMode ? '#f8f9fa' : '#212529' }]}>
                    {time}
                </Text>

                <Text style={[styles.sessionStatus, { color: isDarkMode ? '#ced4da' : '#495057' }]}>
                    {isActive
                        ? (isPaused ? 'Paused' : 'Running')
                        : (isWorking ? 'Ready to Focus' : 'Time for a Break')}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    timerCircle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    progressRing: {
        position: 'absolute',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    svgContainer: {
        position: 'absolute',
    },
    timeText: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sessionStatus: {
        fontSize: 16,
        opacity: 0.8,
    },
});

export default TimerCircle;