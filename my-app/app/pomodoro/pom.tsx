import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../themecontext';

const workTime = 25 * 60; // 25 minutes in seconds
const breakTime = 5 * 60; // 5 minutes in seconds

export default function Pomodoro() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [timer, setTimer] = useState(workTime);
    const [isActive, setIsActive] = useState(false);
    const [isWorkTime, setIsWorkTime] = useState(true);
    const progress = useRef(new Animated.Value(0)).current;

    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: isWorkTime ? workTime * 1000 : breakTime * 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => progress.setValue(0));
    }, [isWorkTime]);

    useEffect(() => {
        let interval: any = null;

        if (isActive) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 0) {
                        clearInterval(interval);
                        setIsActive(false);
                        setIsWorkTime(!isWorkTime);
                        setTimer(isWorkTime ? breakTime : workTime);
                        return 0;
                    } else {
                        return prevTimer - 1;
                    }
                });
            }, 1000);
        } else if (!isActive && timer !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, timer, isWorkTime]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimer(isWorkTime ? workTime : breakTime);
    };

    const progressAnimation = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
            <View style={styles.timerContainer}>
                <Text style={[styles.timerText, { color: colors.text }]}>{`${minutes}:${seconds}`}</Text>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: progressAnimation,
                            backgroundColor: colors.primary,
                        },
                    ]}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleTimer}>
                    <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={resetTimer}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.modeText, { color: colors.text }]}>
                {isWorkTime ? 'Work Time' : 'Break Time'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    timerContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    timerText: {
        fontSize: 60,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modeText: {
        fontSize: 20,
        fontWeight: '600',
    },
});