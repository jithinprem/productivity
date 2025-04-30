import {Feather} from "@expo/vector-icons";
import React from "react";
import {useTheme} from "@/app/themecontext";
import {useRouter} from "expo-router";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import InspirationalQuote from "@/app/quotes/inspirational";

interface ModuleCardProps {
    title: string;
    description: string;
    icon: keyof typeof Feather.glyphMap;
    route: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon, route }: any) => {
    const { colors } = useTheme();
    const router = useRouter();

    return (
        <TouchableOpacity
            style={[
                styles.moduleCard,
                { backgroundColor: colors.background }
            ]}
            onPress={() => router.push(route)}
            activeOpacity={0.8} // Adjust the opacity on press
        >
            <View style={styles.moduleContent}>
                <Feather name={icon} size={24} color={colors.text} style={styles.moduleIcon} />
                <View>
                    <Text style={[styles.moduleTitle, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.moduleDescription, { color: colors.primary }]}>{description}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const Header: React.FC = () => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    return (
        <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Welcome JP!</Text>
            <Text style={[styles.headerSubtitle, { color: colors.text }]}>
                Ready to boost your productivity?
            </Text>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                <Feather name={isDarkMode ? "sun" : "moon"} size={24} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
};

export default function Featurelist() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { paddingTop: 0, backgroundColor: colors.background}]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header Section */}
                <Header />

                {/* Productivity Modules */}
                <View>
                    <ModuleCard
                        title="Pomodoro Timer"
                        description="Focus with timed work intervals."
                        icon="clock"
                        route="../pomodoro/pom"
                    />
                    <ModuleCard
                        title="To-Do List"
                        description="Manage and organize your tasks."
                        icon="list"
                        route="/todo"
                    />
                    <ModuleCard
                        title="Reminders"
                        description="Stay on track with timely notifications."
                        icon="bell"
                        route="/reminders"
                    />
                    <ModuleCard
                        title="Productivity Utilities"
                        description="Tools to enhance your daily workflow."
                        icon="tool"
                        route="/utilities"
                    />
                </View>
                <View style={{ flex: 1 }} /> {/*added to occupy the space between*/}
                {/* Inspirational Quote Section */}
                <View style={styles.quoteContainer}>
                    <InspirationalQuote />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#777',
        marginTop: 5,
    },
    moduleCard: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 16, // Increased spacing between cards
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    moduleContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moduleIcon: {
        marginRight: 15,
    },
    moduleTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    moduleDescription: {
        fontSize: 14,
    },
    quoteContainer: {
        paddingHorizontal: 20,
        marginTop: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    quoteText: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#555',
        textAlign: 'center',
    },
    quoteAuthor: {
        fontSize: 14,
        color: '#777',
        marginTop: 8,
        textAlign: 'center',
    },
    themeToggle: {
        padding: 10,
    },
    spacer: {
        flex: 1,
    },
});