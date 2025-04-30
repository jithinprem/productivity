import { Tabs } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import {icons} from "@/constants/icons";
import InspirationalQuote from "@/app/quotes/inspirational";

const VERY_LIGHT_RED = "#FFDEDE";
const PRIMARY_RED = "#88304E";
const TabIcon = ({focused, icon}: any) => {
    return (
        <Image
            source={icon}
            style={[
                styles.tabIcon,
                { tintColor: focused ? 'black' : 'white' }
            ]}
        />
    )
}

const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: VERY_LIGHT_RED,
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.home}></TabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.search}></TabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.saved}></TabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.profile}></TabIcon>
                    ),
                }}
            />
        </Tabs>
    );
}

export default _Layout;

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: PRIMARY_RED,
        borderTopWidth: 0,
        height: 60,
        paddingBottom: 5,
        paddingTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: '500',
        marginBottom: 2
    },
    tabIcon: {
        width: 17,
        height: 17,
        resizeMode: 'contain',
    },
});
