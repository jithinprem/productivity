import React, {useEffect, useRef, useState} from "react";
import {Animated, Easing, Text, View} from "react-native";
import {useTheme} from "@/app/themecontext";
import {DataType} from "csstype";

const quotes: any[] = [
    {
        text: "The key to success is to focus on goals, not obstacles.",
        author: "Unknown"
    },
    {
        text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
        author: "Unknown"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    // Add more quotes as needed
];
const InspirationalQuote: React.FC= () => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { colors } = useTheme();

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();

        const intervalId = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start(() => {
                setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
                fadeAnim.setValue(0);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }).start();
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, [fadeAnim]);

    const currentQuote: any = quotes[currentQuoteIndex];

    return (
        <View className={"flex flex-col align-baseline justify-end"}>
            <Animated.View style={{ opacity: fadeAnim }}>
                <Text>
                    "{currentQuote.text}"
                </Text>
                <Text>
                    - {currentQuote.author}
                </Text>
            </Animated.View>
        </View>
    );
};

export default InspirationalQuote;