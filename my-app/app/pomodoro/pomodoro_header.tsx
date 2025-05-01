import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Feather} from "@expo/vector-icons";
import React from "react";
import {useTheme} from "@/app/themecontext";
const PomodoroHeader = ({ getSessionLabel, setShowSettings }: any) => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    return (<View style={styles.header}>
        <Text style={[styles.sessionText, { color: colors.text }]}>
            {getSessionLabel()}
        </Text>
        <View style={styles.headerControls}>
            {/* Night Mode Toggle Button */}
            <TouchableOpacity
                onPress={toggleTheme} // Use the toggleTheme from context
                style={styles.headerButton}
            >
                <Feather
                    name={isDarkMode ? "sun" : "moon"}
                    size={22}
                    color={colors.text}
                />
            </TouchableOpacity>

            {/* Settings Button */}
            <TouchableOpacity
                onPress={() => setShowSettings(true)}
                style={styles.headerButton}
            >
                <Feather
                    name="settings"
                    size={22}
                    color={colors.text}
                />
            </TouchableOpacity>
        </View>
    </View>);
}

const styles = StyleSheet.create({
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
    headerControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: 8,
        marginLeft: 16,
    },
});

export default PomodoroHeader;
