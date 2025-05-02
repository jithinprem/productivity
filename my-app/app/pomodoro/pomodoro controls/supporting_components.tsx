import { useMemo } from 'react';

const useAdaptiveColors = (isDarkMode: boolean, isWorking: boolean) => {
    return useMemo(() => ({
        primary: isWorking
            ? isDarkMode ? '#ff6b6b' : '#fa5252'
            : isDarkMode ? 'rgba(59, 130, 246, 0.85)' : 'rgba(37, 99, 235, 0.85)',
        secondaryBorder: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
        secondaryText: isDarkMode ? 'rgba(229, 231, 235, 0.9)' : 'rgba(75, 85, 99, 0.9)',
        white: 'rgba(255, 255, 255, 0.95)',
        divider: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        background: isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(250, 250, 250, 0.7)'
    }), [isDarkMode, isWorking]);
};

export default useAdaptiveColors;