import React, { createContext, useContext, useState } from 'react';
import {custom_colors} from "@/constants/colors";

interface ThemeContextProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: {
        background: string;
        text: string;
        primary: string;
    };
}

const ThemeContext = createContext<ThemeContextProps>({
    isDarkMode: false,
    toggleTheme: () => {},
    colors: {
        background: '#f9f9f9',
        text: '#333',
        primary: "#88304E",
    },
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const colors = {
        background: isDarkMode ? '#333' : '#f9f9f9',
        text: isDarkMode ? '#f9f9f9' : '#333',
        primary: "#88304E",
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;