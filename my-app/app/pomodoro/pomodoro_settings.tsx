// PomodoroSettings.tsx
import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Switch
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

// Define types for props
export interface PomodoroSettingsProps {
    visible: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    settings: {
        workDuration: number;
        breakDuration: number;
        longBreakDuration: number;
        longBreakInterval: number;
        soundEnabled: boolean;
        vibrationEnabled: boolean;
        autoStartBreaks: boolean;
        autoStartPomodoros: boolean;
    };
    onUpdateSettings: (key: string, value: number | boolean) => void;
    onResetSessions: () => void;
}

// Define dynamic style generator function
export const getDynamicSettingsStyles = (isDarkMode: boolean) => ({
    settingsModal: {
        backgroundColor: isDarkMode ? '#212529' : '#ffffff',
    },
    settingsTitle: {
        color: isDarkMode ? '#f8f9fa' : '#212529',
    },
    labelText: {
        color: isDarkMode ? '#dee2e6' : '#495057',
    },
    valueText: {
        color: isDarkMode ? '#f8f9fa' : '#212529',
    },
    sliderTrack: {
        backgroundColor: isDarkMode ? '#343a40' : '#e9ecef',
    },
});

const PomodoroSettings: React.FC<PomodoroSettingsProps> = ({
                                                               visible,
                                                               onClose,
                                                               isDarkMode,
                                                               settings,
                                                               onUpdateSettings,
                                                               onResetSessions
                                                           }) => {
    const dynamicStyles = getDynamicSettingsStyles(isDarkMode);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, dynamicStyles.settingsModal]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, dynamicStyles.settingsTitle]}>Settings</Text>
                        <TouchableOpacity onPress={onClose}>
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
                                    value={settings.workDuration}
                                    onValueChange={(value) => onUpdateSettings('workDuration', value)}
                                    minimumTrackTintColor={isDarkMode ? '#fa5252' : '#e03131'}
                                    maximumTrackTintColor={dynamicStyles.sliderTrack.backgroundColor}
                                    thumbTintColor={isDarkMode ? '#fa5252' : '#e03131'}
                                />
                                <Text style={[styles.settingValue, dynamicStyles.valueText]}>{settings.workDuration}</Text>
                            </View>

                            <View style={styles.settingRow}>
                                <Text style={[styles.settingLabel, dynamicStyles.labelText]}>Short Break</Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={30}
                                    step={1}
                                    value={settings.breakDuration}
                                    onValueChange={(value) => onUpdateSettings('breakDuration', value)}
                                    minimumTrackTintColor={isDarkMode ? '#339af0' : '#1c7ed6'}
                                    maximumTrackTintColor={dynamicStyles.sliderTrack.backgroundColor}
                                    thumbTintColor={isDarkMode ? '#339af0' : '#1c7ed6'}
                                />
                                <Text style={[styles.settingValue, dynamicStyles.valueText]}>{settings.breakDuration}</Text>
                            </View>

                            <View style={styles.settingRow}>
                                <Text style={[styles.settingLabel, dynamicStyles.labelText]}>Long Break</Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={30}
                                    step={1}
                                    value={settings.longBreakDuration}
                                    onValueChange={(value) => onUpdateSettings('longBreakDuration', value)}
                                    minimumTrackTintColor={isDarkMode ? '#339af0' : '#1c7ed6'}
                                    maximumTrackTintColor={dynamicStyles.sliderTrack.backgroundColor}
                                    thumbTintColor={isDarkMode ? '#339af0' : '#1c7ed6'}
                                />
                                <Text style={[styles.settingValue, dynamicStyles.valueText]}>{settings.longBreakDuration}</Text>
                            </View>

                            <View style={styles.settingRow}>
                                <Text style={[styles.settingLabel, dynamicStyles.labelText]}>Long Break Interval</Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={10}
                                    step={1}
                                    value={settings.longBreakInterval}
                                    onValueChange={(value) => onUpdateSettings('longBreakInterval', value)}
                                    minimumTrackTintColor={isDarkMode ? '#fa5252' : '#e03131'}
                                    maximumTrackTintColor={dynamicStyles.sliderTrack.backgroundColor}
                                    thumbTintColor={isDarkMode ? '#fa5252' : '#e03131'}
                                />
                                <Text style={[styles.settingValue, dynamicStyles.valueText]}>{settings.longBreakInterval}</Text>
                            </View>
                        </View>

                        <View style={styles.settingSection}>
                            <Text style={[styles.settingSectionTitle, dynamicStyles.settingsTitle]}>Preferences</Text>

                            <View style={styles.switchRow}>
                                <Text style={[styles.switchLabel, dynamicStyles.labelText]}>Sound</Text>
                                <Switch
                                    value={settings.soundEnabled}
                                    onValueChange={(value) => onUpdateSettings('soundEnabled', value)}
                                    trackColor={{ false: '#767577', true: isDarkMode ? '#4dabf7' : '#1c7ed6' }}
                                    thumbColor={settings.soundEnabled ? '#f4f3f4' : '#f4f3f4'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={[styles.switchLabel, dynamicStyles.labelText]}>Vibration</Text>
                                <Switch
                                    value={settings.vibrationEnabled}
                                    onValueChange={(value) => onUpdateSettings('vibrationEnabled', value)}
                                    trackColor={{ false: '#767577', true: isDarkMode ? '#4dabf7' : '#1c7ed6' }}
                                    thumbColor={settings.vibrationEnabled ? '#f4f3f4' : '#f4f3f4'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={[styles.switchLabel, dynamicStyles.labelText]}>Auto-start Breaks</Text>
                                <Switch
                                    value={settings.autoStartBreaks}
                                    onValueChange={(value) => onUpdateSettings('autoStartBreaks', value)}
                                    trackColor={{ false: '#767577', true: isDarkMode ? '#4dabf7' : '#1c7ed6' }}
                                    thumbColor={settings.autoStartBreaks ? '#f4f3f4' : '#f4f3f4'}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={[styles.switchLabel, dynamicStyles.labelText]}>Auto-start Pomodoros</Text>
                                <Switch
                                    value={settings.autoStartPomodoros}
                                    onValueChange={(value) => onUpdateSettings('autoStartPomodoros', value)}
                                    trackColor={{ false: '#767577', true: isDarkMode ? '#4dabf7' : '#1c7ed6' }}
                                    thumbColor={settings.autoStartPomodoros ? '#f4f3f4' : '#f4f3f4'}
                                />
                            </View>
                        </View>

                        <View style={styles.settingSection}>
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={onResetSessions}
                            >
                                <Text style={styles.resetButtonText}>Reset Sessions</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
    resetButton: {
        backgroundColor: '#e03131',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default PomodoroSettings;