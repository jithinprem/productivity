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
    Switch,
    Modal,
    ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../themecontext';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import Svg, { Circle } from 'react-native-svg';


const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;

export default function PomodoroTimer() {
    const insets = useSafeAreaInsets();
    const { colors, isDarkMode } = useTheme();
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
                const { sound } = await Audio.Sound.createAsync(
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
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getSessionLabel = () => {
        if (isWorking) return "Focus Session";

        const isLongBreak = completedSessions > 0 && completedSessions % longBreakInterval === 0;
        return isLongBreak ? "Long Break" : "Short Break";
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
        settingsTitle: {
            color: isDarkMode ? '#f8f9fa' : '#212529',
        },
        settingsModal: {
            backgroundColor: isDarkMode ? '#212529' : '#ffffff',
        },
        labelText: {
            color: isDarkMode ? '#dee2e6' : '#495057',
        },
        valueText: {
            color: isDarkMode ? '#f8f9fa' : '#212529',
        },
        sliderThumb: {
            color: isWorking
                ? isDarkMode ? '#fa5252' : '#e03131'
                : isDarkMode ? '#339af0' : '#1c7ed6'
        },
        sliderTrack: {
            backgroundColor: isDarkMode ? '#343a40' : '#e9ecef',
        },
        statsCount: {
            color: isDarkMode ? '#f8f9fa' : '#212529',
        },
        progressRing: {
            tintColor: isWorking
                ? isDarkMode ? '#ff6b6b' : '#fa5252'
                : isDarkMode ? '#4dabf7' : '#339af0',
        },
    };

    const interpolatedRotation = progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Settings modal
    const renderSettingsModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showSettings}
            onRequestClose={() => setShowSettings(false)}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, dynamicStyles.settingsModal]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, dynamicStyles.settingsTitle]}>Settings</Text>
                        <TouchableOpacity onPress={() => setShowSettings(false)}>
                            <Feather name="x" size={24} color={isDarkMode ? '#dee2e6' : '#495057'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.settingsScroll}>
                        <View style={styles.settingSection}>
                            <Text style={[styles.settingSectionTitle, dynamicStyles.settingsTitle]}>Time (Minutes)</Text>

                            <View style={styles.settingRow}>
                                <Text style={[styles.settingLabel, dynamicStyles.labelText]}>Work</Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={60}
                                    step={1}
                                    value={workDuration}
                                    onValueChange={setWorkDuration}
                                    minimumTrackTintColor={isDarkMode ? '#fa5252' : '#e03131'}
                                    maximumTrackTintColor={dynamicStyles.sliderTrack.backgroundColor}
                                    thumbTintColor={isDarkMode ? '#fa5252' : '#e03131'}
                                />
                                <Text style={[styles.settingValue, dynamicStyles.valueText]}>{workDuration}</Text>
                            </View>

                            <View style={styles.settingRow}>
                                <Text style={[styles.settingLabel, dynamicStyles.labelText]}>Short Break</Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={30}
                                    step={1}
                                    value={breakDuration}
                                    onValueChange={setBreakDuration}
                                    minimumTrackTintColor={isDarkMode ? '#339af0' : '#1c7ed6'}
                                    maximumTrackTintColor={dynamicStyles.sliderTrack.backgroundColor}
                                    thumbTintColor={isDarkMode ? '#339af0' : '#1c7ed6'}
                                />
                                <Text style={[styles.settingValue, dynamicStyles.valueText]}>{breakDuration}</Text>
                            </View>

                            <View style={styles.settingRow}>
                                <Text style={[styles.settingLabel, dynamicStyles.labelText]}>Long Break</Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={30}
                                    step={1}
                                    value={longBreakDuration}
                                    onValueChange={setLongBreakDuration}
                                    minimumTrackTintColor={isDarkMode ? '#339af0' : '#1c7ed6'}
                                    maximumTrackTintColor={dynamicStyles.sliderTrack.backgroundColor}
                                    thumbTintColor={isDarkMode ? '#339af0' : '#1c7ed6'}
                                />
                                <Text style={[styles.settingValue, dynamicStyles.valueText]}>{longBreakDuration}</Text>
                            </View>

                            <View style={styles.settingRow}>
                                <Text style={[styles.settingLabel, dynamicStyles.labelText]}>Long Break Interval</Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={10}
                                    step={1}
                                    value={longBreakInterval}
                                    onValueChange={setLongBreakInterval}
                                    minimumTrackTintColor={isDarkMode ? '#fa5252' : '#e03131'}
                                    maximumTrackTintColor={dynamicStyles.sliderTrack.backgroundColor}
                                    thumbTintColor={isDarkMode ? '#fa5252' : '#e03131'}
                                />
                                <Text style={[styles.settingValue, dynamicStyles.valueText]}>{longBreakInterval}</Text>
                            </View>
                        </View>

                        <View style={styles.settingSection}>
                            <Text style={[styles.settingSectionTitle, dynamicStyles.settingsTitle]}>Preferences</Text>

                            <View style={styles.switchRow}>
                                <Text style={[styles.switchLabel, dynamicStyles.labelText]}>Sound</Text>
                                <Switch
                                    value={soundEnabled}
                                    onValueChange={setSoundEnabled}
                                    trackColor={{ false: '#767577', true: isDarkMode ? '#4dabf7' : '#1c7ed6' }}
                                    thumbColor={soundEnabled ? '#f4f3f4' : '#f4f3f4'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={[styles.switchLabel, dynamicStyles.labelText]}>Vibration</Text>
                                <Switch
                                    value={vibrationEnabled}
                                    onValueChange={setVibrationEnabled}
                                    trackColor={{ false: '#767577', true: isDarkMode ? '#4dabf7' : '#1c7ed6' }}
                                    thumbColor={vibrationEnabled ? '#f4f3f4' : '#f4f3f4'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={[styles.switchLabel, dynamicStyles.labelText]}>Auto-start Breaks</Text>
                                <Switch
                                    value={autoStartBreaks}
                                    onValueChange={setAutoStartBreaks}
                                    trackColor={{ false: '#767577', true: isDarkMode ? '#4dabf7' : '#1c7ed6' }}
                                    thumbColor={autoStartBreaks ? '#f4f3f4' : '#f4f3f4'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={[styles.switchLabel, dynamicStyles.labelText]}>Auto-start Pomodoros</Text>
                                <Switch
                                    value={autoStartPomodoros}
                                    onValueChange={setAutoStartPomodoros}
                                    trackColor={{ false: '#767577', true: isDarkMode ? '#4dabf7' : '#1c7ed6' }}
                                    thumbColor={autoStartPomodoros ? '#f4f3f4' : '#f4f3f4'}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={[styles.sessionText, dynamicStyles.sessionText]}>
                    {getSessionLabel()}
                </Text>
                <TouchableOpacity onPress={() => setShowSettings(true)}>
                    <Feather name="settings" size={24} color={isDarkMode ? '#dee2e6' : '#495057'} />
                </TouchableOpacity>
            </View>

            <View style={styles.timerContainer}>
                <View style={[styles.timerCircle, dynamicStyles.timerCircle]}>
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

                    <Text style={[styles.timeText, dynamicStyles.timeText]}>
                        {formatTime(time)}
                    </Text>

                    <Text style={[styles.sessionStatus, dynamicStyles.sessionText]}>
                        {isActive
                            ? (isPaused ? 'Paused' : 'Running')
                            : (isWorking ? 'Ready to Focus' : 'Time for a Break')}
                    </Text>
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

            {renderSettingsModal()}
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
    progressRingImage: {
        width: '100%',
        height: '100%',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        height: '70%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    settingsScroll: {
        flex: 1,
    },
    settingSection: {
        marginBottom: 25,
    },
    settingSectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    settingLabel: {
        width: 120,
        fontSize: 16,
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
    },
    settingValue: {
        width: 30,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'right',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchLabel: {
        fontSize: 16,
    },
});