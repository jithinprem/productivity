// app/pomodoro/timer_animations.tsx
import React, { useEffect, useRef } from 'react';
import {Animated, View, StyleSheet, Text, Platform} from 'react-native';
import Svg, { Circle, Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import {useTheme} from "@/app/themecontext";
// After installing the font package
import { useFonts } from 'expo-font';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const CIRCLE_SIZE = 260;
// const [fontsLoaded] = useFonts({
//     'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),
// });

// Common properties for all animations
export interface AnimationProps {
    size: number;
    isWorking: boolean;
    isDarkMode: boolean;
    progressAnimation: Animated.AnimatedInterpolation<any>;
    animatedValue: Animated.Value;
}

// 1. Ghost Particles Animation
export const GhostParticlesAnimation: React.FC<AnimationProps> = ({
                                                                      size, isWorking, isDarkMode, progressAnimation
                                                                  }) => {
    const particleAnim1 = useRef(new Animated.Value(0)).current;
    const particleAnim2 = useRef(new Animated.Value(0)).current;
    const particleAnim3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createParticleAnimation = (particleAnim: Animated.Value) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(particleAnim, {
                        toValue: 1,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(particleAnim, {
                        toValue: 0,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        };

        createParticleAnimation(particleAnim1);
        setTimeout(() => createParticleAnimation(particleAnim2), 700);
        setTimeout(() => createParticleAnimation(particleAnim3), 1400);

        return () => {
            particleAnim1.stopAnimation();
            particleAnim2.stopAnimation();
            particleAnim3.stopAnimation();
        };
    }, []);

    const particleColor = isWorking
        ? isDarkMode ? 'rgba(255, 107, 107, 0.3)' : 'rgba(250, 82, 82, 0.2)'
        : isDarkMode ? 'rgba(77, 171, 247, 0.3)' : 'rgba(51, 154, 240, 0.2)';

    return (
        <>
            <Animated.View
                style={[
                    styles.ghostParticle,
                    {
                        transform: [
                            { translateX: particleAnim1.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-30, 30]
                                })},
                            { translateY: particleAnim1.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-50, 50]
                                })},
                            { scale: particleAnim1.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0.3, 1.2, 0.3]
                                })}
                        ],
                        opacity: particleAnim1.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 0.7, 0]
                        }),
                        backgroundColor: particleColor
                    }
                ]}
            />
            <Animated.View
                style={[
                    styles.ghostParticle,
                    {
                        transform: [
                            { translateX: particleAnim2.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [40, -40]
                                })},
                            { translateY: particleAnim2.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, -30]
                                })},
                            { scale: particleAnim2.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0.2, 1, 0.2]
                                })}
                        ],
                        opacity: particleAnim2.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 0.5, 0]
                        }),
                        backgroundColor: particleColor
                    }
                ]}
            />
            <Animated.View
                style={[
                    styles.ghostParticle,
                    {
                        transform: [
                            { translateX: particleAnim3.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [10, -60]
                                })},
                            { translateY: particleAnim3.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-40, 10]
                                })},
                            { scale: particleAnim3.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0.4, 1.1, 0.4]
                                })}
                        ],
                        opacity: particleAnim3.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 0.6, 0]
                        }),
                        backgroundColor: particleColor
                    }
                ]}
            />
        </>
    );
};

// 2. Pulsating Waves Animation
export const PulsatingWavesAnimation: React.FC<AnimationProps> = ({
                                                                      size, isWorking, isDarkMode, progressAnimation, animatedValue
                                                                  }) => {
    const wave1 = useRef(new Animated.Value(0)).current;
    const wave2 = useRef(new Animated.Value(0)).current;
    const wave3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startWaveAnimation = (waveAnim: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(waveAnim, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true
                    }),
                    Animated.timing(waveAnim, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true
                    }),
                ])
            ).start();
        };

        startWaveAnimation(wave1, 0);
        startWaveAnimation(wave2, 666);
        startWaveAnimation(wave3, 1333);

        return () => {
            wave1.stopAnimation();
            wave2.stopAnimation();
            wave3.stopAnimation();
        };
    }, []);

    // Increased opacity in the wave colors for better visibility
    const waveColor = isWorking
        ? isDarkMode ? 'rgba(255, 107, 107, 0.3)' : 'rgba(250, 82, 82, 0.2)'
        : isDarkMode ? 'rgba(77, 171, 247, 0.3)' : 'rgba(51, 154, 240, 0.2)';

    return (
        <>
            {[wave1, wave2, wave3].map((wave, i) => (
                <Animated.View
                    key={`wave-${i}`}
                    style={[
                        {
                            position: 'absolute',
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            borderWidth: 4, // Increased from default 2 for more visibility
                            borderColor: waveColor,
                            transform: [
                                { scale: wave.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 2.2] // Increased maximum scale for wider pulse
                                    })},
                            ],
                            opacity: wave.interpolate({
                                inputRange: [0, 0.3, 1],
                                outputRange: [0.9, 0.6, 0] // Adjusted opacity curve for better visibility
                            }),
                        }
                    ]}
                />
            ))}
        </>
    );
};

// 3. Orbital Particles Animation
export const OrbitalParticlesAnimation: React.FC<AnimationProps> = ({
                                                                        size, isWorking, isDarkMode, progressAnimation
                                                                    }) => {
    const orbit1 = useRef(new Animated.Value(0)).current;
    const orbit2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(orbit1, {
                toValue: 1,
                duration: 8000,
                useNativeDriver: true
            })
        ).start();

        Animated.loop(
            Animated.timing(orbit2, {
                toValue: 1,
                duration: 12000,
                useNativeDriver: true
            })
        ).start();

        return () => {
            orbit1.stopAnimation();
            orbit2.stopAnimation();
        };
    }, []);

    const particleColor = isWorking
        ? isDarkMode ? '#ff6b6b' : '#fa5252'
        : isDarkMode ? '#4dabf7' : '#339af0';

    // Create 8 particles for orbit1
    const orbit1Particles = [...Array(8)].map((_, i) => {
        const angle = (i / 8) * 2 * Math.PI;
        const offsetX = Math.cos(angle) * (size * 0.4);
        const offsetY = Math.sin(angle) * (size * 0.4);

        return (
            <Animated.View
                key={`orbit3-${i}`}
                style={{
                    position: 'absolute',
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: particleColor,
                    opacity: 0.7,
                    transform: [
                        { translateX: orbit1.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, offsetX]
                            })},
                        { translateY: orbit1.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, offsetY]
                            })},
                        { rotate: orbit1.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', (360 + angle * (180/Math.PI))+"deg"]
                            })}
                    ]
                }}
            />
        );
    });

    // Create 12 particles for orbit2
    const orbit2Particles = [...Array(12)].map((_, i) => {
        const angle = (i / 12) * 2 * Math.PI;
        const offsetX = Math.cos(angle) * (size * 0.35);
        const offsetY = Math.sin(angle) * (size * 0.35);

        return (
            <Animated.View
                key={`orbit3a-${i}`}
                style={{
                    position: 'absolute',
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: particleColor,
                    opacity: 0.5,
                    transform: [
                        { translateX: orbit2.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, offsetX]
                            })},
                        { translateY: orbit2.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, offsetY]
                            })},
                        { rotate: orbit2.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', (-360 + angle * (180/Math.PI))+'deg']
                })}
                    ]
                }}
            />
        );
    });

    return (
        <View style={{ position: 'absolute', width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            {orbit1Particles}
            {orbit2Particles}
        </View>
    );
};

// 4. Spiral Loader Animation
export const SpiralLoaderAnimation: React.FC<AnimationProps> = ({
                                                                    size, isWorking, isDarkMode, progressAnimation
                                                                }) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true
            })
        ).start();

        return () => {
            rotateAnim.stopAnimation();
        };
    }, []);

    const spiralColor = isWorking
        ? isDarkMode ? '#ff6b6b' : '#fa5252'
        : isDarkMode ? '#4dabf7' : '#339af0';

    return (
        <Animated.View
            style={{
                position: 'absolute',
                width: size,
                height: size,
                transform: [
                    { rotate: rotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg']
                        })}
                ]
            }}
        >
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <Defs>
                    <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <Stop offset="0%" stopColor={spiralColor} stopOpacity="0.1" />
                        <Stop offset="90%" stopColor={spiralColor} stopOpacity="0.6" />
                        <Stop offset="100%" stopColor={spiralColor} stopOpacity="0.8" />
                    </RadialGradient>
                </Defs>
                {[...Array(8)].map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    const length = size * 0.3;
                    const startX = size / 2;
                    const startY = size / 2;
                    const endX = startX + Math.cos(angle) * length;
                    const endY = startY + Math.sin(angle) * length;

                    return (
                        <Path
                            key={`spiral-${i}`}
                            d={`M ${startX} ${startY} L ${endX} ${endY}`}
                            stroke={spiralColor}
                            strokeWidth={3}
                            strokeOpacity={(i + 1) / 8}
                            strokeLinecap="round"
                        />
                    );
                })}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={size * 0.1}
                    fill="url(#grad)"
                />
            </Svg>
        </Animated.View>
    );
};

// 5. Digital Glitch Animation
export const DigitalGlitchAnimation: React.FC<AnimationProps> = ({
                                                                     size, isWorking, isDarkMode, progressAnimation
                                                                 }) => {
    const glitchAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const runGlitchAnimation = () => {
            Animated.sequence([
                Animated.timing(glitchAnim, {
                    toValue: 1,
                    duration: 50,
                    useNativeDriver: true
                }),
                Animated.timing(glitchAnim, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true
                }),
                Animated.delay(Math.random() * 3000 + 1000)
            ]).start(runGlitchAnimation);
        };

        runGlitchAnimation();

        return () => {
            glitchAnim.stopAnimation();
        };
    }, []);

    const glitchColor = isWorking
        ? isDarkMode ? '#ff6b6b' : '#fa5252'
        : isDarkMode ? '#4dabf7' : '#339af0';

    // Create glitch elements
    const createGlitchElements = (count: number) => {
        return [...Array(count)].map((_, i) => {
            const randomPosition = Math.random() * size * 0.8 - size * 0.4;
            const randomHeight = Math.random() * 5 + 2;

            return (
                <Animated.View
                    key={"orbit5-"+{i}}
                    style={{
                        position: 'absolute',
                        width: Math.random() * size * 0.5 + size * 0.1,
                        height: randomHeight,
                        backgroundColor: glitchColor,
                        left: size / 2 - size * 0.25,
                        top: size / 2 + randomPosition,
                        opacity: glitchAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 0.8, 0]
                        }),
                        transform: [
                            { translateX: glitchAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, (Math.random() - 0.5) * 20]
                                })},
                        ]
                    }}
                />
            );
        });
    };

    return (
        <View style={{ position: 'absolute', width: size, height: size }}>
            {createGlitchElements(15)}
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
        overflow: 'hidden', // Important for containing the animations
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
        fontSize: 68,
        fontWeight: '300',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-condensed-light',
        letterSpacing: -1,
        marginBottom: 10,
    },
    sessionStatus: {
        fontSize: 11,
        opacity: 0.8,
        letterSpacing: 0.2,
        textTransform: 'uppercase',
    },
    ghostParticle: {
        position: 'absolute',
        width: 45,
        height: 45,
        borderRadius: 25,
        opacity: 0.5,
    },
    wave: {
        position: 'absolute',
        borderWidth: 2,
        opacity: 0.5,
    },
    timerTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    }
});

// Animation type for settings
export enum TimerAnimationType {
    GHOST_PARTICLES = 'ghost_particles',
    PULSATING_WAVES = 'pulsating_waves',
    ORBITAL_PARTICLES = 'orbital_particles',
    SPIRAL_LOADER = 'spiral_loader',
    DIGITAL_GLITCH = 'digital_glitch',
    NONE = 'none'
}

// Function to get animation component based on type
export const getAnimationComponent = (type: TimerAnimationType): React.FC<AnimationProps> | null => {
    switch (type) {
        case TimerAnimationType.GHOST_PARTICLES:
            return GhostParticlesAnimation;
        case TimerAnimationType.PULSATING_WAVES:
            return PulsatingWavesAnimation;
        case TimerAnimationType.ORBITAL_PARTICLES:
            return OrbitalParticlesAnimation;
        case TimerAnimationType.SPIRAL_LOADER:
            return SpiralLoaderAnimation;
        case TimerAnimationType.DIGITAL_GLITCH:
            return DigitalGlitchAnimation;
        case TimerAnimationType.NONE:
        default:
            return null;
    }
};

interface TimerCircleProps {
    time: string;
    isActive: boolean;
    isPaused: boolean;
    isWorking: boolean;
    animatedValue: Animated.Value;
    progressAnimation: Animated.AnimatedInterpolation<any>;
    animationType?: TimerAnimationType;
}

const TimerCircle: React.FC<TimerCircleProps> = ({
     time,
     isActive,
     isPaused,
     isWorking,
     animatedValue,
     progressAnimation,
     animationType = TimerAnimationType.GHOST_PARTICLES,
 }) => {
    const { isDarkMode } = useTheme();

    const dynamicStyles = {
        timerCircle: {
            borderColor: isWorking
                ? isDarkMode ? '#ff6b6b' : '#fa5252'
                : isDarkMode ? '#4dabf7' : '#339af0',
            shadowColor: isWorking
                ? isDarkMode ? '#ff6b6b' : '#fa5252'
                : isDarkMode ? '#4dabf7' : '#339af0',
        },
    };

    // Get the animation component from your separate file
    const AnimationComponent = getAnimationComponent(animationType);

    return (
        <View style={[styles.timerContainer, dynamicStyles.timerCircle]}>
            <View style={[
                styles.timerCircle,
                { backgroundColor: isDarkMode ? '#2d3436' : '#f8f9fa' }
            ]}>
                {/* Render the selected animation if it exists */}
                {AnimationComponent && (
                    <AnimationComponent
                        size={CIRCLE_SIZE}
                        isWorking={isWorking}
                        isDarkMode={isDarkMode}
                        progressAnimation={progressAnimation}
                        animatedValue={animatedValue}
                    />
                )}

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

                <View style={styles.timerTextContainer}>
                    <Text
                        style={[
                            styles.timeText,
                            {
                                color: isDarkMode ? '#f8f9fa' : '#212529',
                                textShadowColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 2
                            }
                        ]}
                    >
                        {time}
                    </Text>

                    <View style={styles.statusContainer}>
                        <View style={[
                            styles.statusIndicator,
                            {
                                backgroundColor: isWorking
                                    ? (isDarkMode ? '#ff6b6b' : '#fa5252')
                                    : (isDarkMode ? '#4dabf7' : '#339af0')
                            }
                        ]} />
                        <Text
                            style={[
                                styles.sessionStatus,
                                {
                                    color: isDarkMode ? '#e9ecef' : '#495057',
                                    letterSpacing: 0.7
                                }
                            ]}
                        >
                            {isActive
                                ? (isPaused ? 'PAUSED' : 'RUNNING')
                                : (isWorking ? 'READY TO FOCUS' : 'TIME FOR A BREAK')}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default TimerCircle;