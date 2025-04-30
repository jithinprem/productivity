import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useLocalSearchParams} from "expo-router";

const PomodoroHome = () => {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Text>Movie details: {id}</Text>
        </View>
    );
}

export default PomodoroHome
const styles = StyleSheet.create({})