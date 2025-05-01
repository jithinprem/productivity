import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Vibration,
    Animated,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../themecontext';
import { Audio } from 'expo-av';
import Svg, { Circle } from 'react-native-svg';
import PomodoroSettings from "@/app/pomodoro/pomodoro_settings";
import PomodoroHeader from "@/app/pomodoro/pomodoro_header";
import TimerCircle from "@/app/pomodoro/pomodoro_clock";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;

const PomodoroTimer = () => {

    const { isDarkMode, toggleTheme, colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [isWorking, setIsWorking] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [completedSessions, setCompletedSessions] = useState(0);
    const [longBreakInterval, setLongBreakInterval] = useState(4);
    const [longBreakDuration, setLongBreakDuration] = useState(15);
    const [showSettings, setShowSettings] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [autoStartBreaks, setAutoStartBreaks] = useState(true);
    const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null)
    const animatedValue = useRef(new Animated.Value(0)).current;
    const progressAnimation = useRef(new Animated.Value(1)).current;

    // Set initial time based on work duration
    useEffect(() => {
        if (!isActive) {
            if (isWorking) {
                setTime(workDuration * 60);
            } else {
                const isLongBreak = completedSessions > 0 && completedSessions % longBreakInterval === 0;
                setTime(isLongBreak ? longBreakDuration * 60 : breakDuration * 60);
            }
        }
    }, [isWorking, workDuration, breakDuration, longBreakDuration, completedSessions, longBreakInterval]);

    // Load sound effect
    useEffect(() => {
        const loadSound = async () => {
            try {
                const {sound} = await Audio.Sound.createAsync(
                    require('../../assets/sounds/bell.mp3')
                );
                soundRef.current = sound;
            } catch (error) {
                console.log('Error loading sound', error);
            }
        };

        loadSound();

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    // Timer logic
    useEffect(() => {
        if (isActive && !isPaused) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime <= 1) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        handleTimerComplete();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (isPaused || !isActive) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, isPaused]);

    // Animation for progress
    useEffect(() => {
        const initialDuration = isWorking
            ? workDuration * 60
            : (completedSessions > 0 && completedSessions % longBreakInterval === 0)
                ? longBreakDuration * 60
                : breakDuration * 60;

        const progress = time / initialDuration;

        Animated.timing(progressAnimation, {
            toValue: progress,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [time]);

    // Handle timer completion
    const handleTimerComplete = () => {
        playSound();
        if (vibrationEnabled) {
            Vibration.vibrate([500, 500, 500]);
        }

        if (isWorking) {
            setCompletedSessions(prev => prev + 1);
            setIsWorking(false);
            if (autoStartBreaks) {
                resetTimer(false);
            } else {
                setIsActive(false);
            }
        } else {
            setIsWorking(true);
            if (autoStartPomodoros) {
                resetTimer(true);
            } else {
                setIsActive(false);
            }
        }
    };

    // Play sound
    const playSound = async () => {
        if (soundEnabled && soundRef.current) {
            try {
                await soundRef.current.setPositionAsync(0);
                await soundRef.current.playAsync();
            } catch (error) {
                console.log('Error playing sound', error);
            }
        }
    };

    // Toggle timer
    const toggleTimer = () => {
        if (!isActive) {
            setIsActive(true);
            setIsPaused(false);

            // Pulse animation
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1.1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else if (isPaused) {
            setIsPaused(false);
        } else {
            setIsPaused(true);
        }
    };

    // Reset timer
    const resetTimer = (isWorkTimer: any) => {
        setIsActive(true);
        setIsPaused(false);
        setIsWorking(isWorkTimer);

        if (isWorkTimer) {
            setTime(workDuration * 60);
        } else {
            const isLongBreak = completedSessions > 0 && completedSessions % longBreakInterval === 0;
            setTime(isLongBreak ? longBreakDuration * 60 : breakDuration * 60);
        }
    };

    // Skip to the next timer
    const skipTimer = () => {
        if (isWorking) {
            setCompletedSessions(prev => prev + 1);
            setIsWorking(false);
            setTime(breakDuration * 60);
        } else {
            setIsWorking(true);
            setTime(workDuration * 60);
        }
        setIsActive(false);
        setIsPaused(false);
    };

    // Format time
    const formatTime = (seconds: any) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
    }

    const getSessionLabel = () => {
        if (isWorking) return "Focus Session";

        const isLongBreak = completedSessions > 0 && completedSessions % longBreakInterval === 0;
        return isLongBreak ? "Long Break" : "Short Break";
    };

    // Handler for settings updates
    const handleUpdateSettings = (key: string, value: number | boolean) => {
        switch (key) {
            case 'workDuration':
                setWorkDuration(value as number);
                break;
            case 'breakDuration':
                setBreakDuration(value as number);
                break;
            case 'longBreakDuration':
                setLongBreakDuration(value as number);
                break;
            case 'longBreakInterval':
                setLongBreakInterval(value as number);
                break;
            case 'soundEnabled':
                setSoundEnabled(value as boolean);
                break;
            case 'vibrationEnabled':
                setVibrationEnabled(value as boolean);
                break;
            case 'autoStartBreaks':
                setAutoStartBreaks(value as boolean);
                break;
            case 'autoStartPomodoros':
                setAutoStartPomodoros(value as boolean);
                break;
        }
    };

    // Generate dynamic styles based on theme and state
    const dynamicStyles = {
        container: {
            backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
        },
        timerCircle: {
            borderColor: isWorking
                ? isDarkMode ? '#ff6b6b' : '#fa5252'
                : isDarkMode ? '#4dabf7' : '#339af0',
            shadowColor: isWorking
                ? isDarkMode ? '#ff6b6b' : '#fa5252'
                : isDarkMode ? '#4dabf7' : '#339af0',
        },
        sessionText: {
            color: isWorking
                ? isDarkMode ? '#ff8787' : '#e03131'
                : isDarkMode ? '#74c0fc' : '#1c7ed6',
        },
        timeText: {
            color: isDarkMode ? '#f8f9fa' : '#212529',
        },
        controlButton: {
            backgroundColor: isWorking
                ? isDarkMode ? '#fa5252' : '#e03131'
                : isDarkMode ? '#339af0' : '#1c7ed6',
        },
        secondaryButton: {
            borderColor: isDarkMode ? '#868e96' : '#adb5bd',
        },
        secondaryButtonText: {
            color: isDarkMode ? '#dee2e6' : '#495057',
        },
        statsCount: {
            color: isDarkMode ? '#f8f9fa' : '#212529',
        },
        labelText: {
            color: isDarkMode ? '#dee2e6' : '#495057',
        },
    };

    const interpolatedRotation = progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Current settings object to pass to the settings component
    const pomodoroSettings = {
        workDuration,
        breakDuration,
        longBreakDuration,
        longBreakInterval,
        soundEnabled,
        vibrationEnabled,
        autoStartBreaks,
        autoStartPomodoros
    };

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container, {paddingTop: insets.top}]}>

			<PomodoroHeader
                getSessionLabel={getSessionLabel}
                setShowSettings={setShowSettings}
            ></PomodoroHeader>
            <View style={styles.timerContainer}>
                {/*<View style={[styles.timerCircle, dynamicStyles.timerCircle]}>*/}
                {/*    <Animated.View style={[styles.progressRing, {*/}
                {/*        transform: [{scale: animatedValue}],*/}
                {/*        opacity: progressAnimation*/}
                {/*    }]}>*/}
                {/*        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svgContainer}>*/}
                {/*            <AnimatedCircle*/}
                {/*                cx={CIRCLE_SIZE / 2}*/}
                {/*                cy={CIRCLE_SIZE / 2}*/}
                {/*                r={(CIRCLE_SIZE / 2) - 10} // Slightly smaller than container*/}
                {/*                fill="none"*/}
                {/*                stroke={isWorking ?*/}
                {/*                    (isDarkMode ? '#ff6b6b' : '#fa5252') :*/}
                {/*                    (isDarkMode ? '#4dabf7' : '#339af0')}*/}
                {/*                strokeWidth={10}*/}
                {/*                strokeLinecap="round"*/}
                {/*                strokeDasharray={2 * Math.PI * ((CIRCLE_SIZE / 2) - 10)}*/}
                {/*                strokeDashoffset={progressAnimation.interpolate({*/}
                {/*                    inputRange: [0, 1],*/}
                {/*                    outputRange: [2 * Math.PI * ((CIRCLE_SIZE / 2) - 10), 0]*/}
                {/*                })}*/}
                {/*                transform={[{rotate: '-90deg'}]} // Start from top*/}
                {/*            />*/}
                {/*        </Svg>*/}
                {/*    </Animated.View>*/}

                {/*    <Text style={[styles.timeText, dynamicStyles.timeText]}>*/}
                {/*        {formatTime(time)}*/}
                {/*    </Text>*/}

                {/*    <Text style={[styles.sessionStatus, dynamicStyles.sessionText]}>*/}
                {/*        {isActive*/}
                {/*            ? (isPaused ? 'Paused' : 'Running')*/}
                {/*            : (isWorking ? 'Ready to Focus' : 'Time for a Break')}*/}
                {/*    </Text>*/}
                {/*</View>*/}


                <View style={styles.timerContainer}>
                    <View style={styles.timerContainer}>
                        <TimerCircle
                            time={formatTime(time)}
                            progressAnimation={progressAnimation}
                            isWorking={isWorking}
                            isActive={isActive}
                            isPaused={isPaused}
                            animatedValue={animatedValue}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.controlButton, dynamicStyles.controlButton]}
                    onPress={toggleTimer}
                >
                    <Feather
                        name={isActive ? (isPaused ? 'play' : 'pause') : 'play'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryButton, dynamicStyles.secondaryButton]}
                    onPress={skipTimer}
                >
                    <Text style={[styles.secondaryButtonText, dynamicStyles.secondaryButtonText]}>
                        Skip
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryButton, dynamicStyles.secondaryButton]}
                    onPress={() => resetTimer(isWorking)}
                >
                    <Text style={[styles.secondaryButtonText, dynamicStyles.secondaryButtonText]}>
                        Reset
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.stats}>
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, dynamicStyles.labelText]}>Sessions</Text>
                    <Text style={[styles.statCount, dynamicStyles.statsCount]}>{completedSessions}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, dynamicStyles.labelText]}>Next Long Break</Text>
                    <Text style={[styles.statCount, dynamicStyles.statsCount]}>
                        {longBreakInterval - (completedSessions % longBreakInterval)}
                    </Text>
                </View>
            </View>

            {/* Use the extracted settings component */}
            <PomodoroSettings
                visible={showSettings}
                onClose={() => setShowSettings(false)}
                isDarkMode={isDarkMode}
                settings={pomodoroSettings}
                onUpdateSettings={handleUpdateSettings}
                onResetSessions={() => {
                    setCompletedSessions(0);
                    setShowSettings(false);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    svgContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    progressRing: {
        position: 'absolute',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sessionText: {
        fontSize: 18,
        fontWeight: '600',
    },
    timerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerCircle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    timeText: {
        fontSize: 72,
        fontWeight: '300',
    },
    sessionStatus: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30,
    },
    controlButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        elevation: 3,
    },
    secondaryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        marginHorizontal: 5,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
    },
    statCount: {
        fontSize: 24,
        fontWeight: '600',
    },
    headerControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: 8,
        marginLeft: 16,
    },
});

export default PomodoroTimer;