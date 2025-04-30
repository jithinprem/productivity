import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from './themecontext';
import './globals.css';
const RootLayout = () => {
  return (
      <ThemeProvider>
        <Stack>
          <Stack.Screen
              name="(tabs)"
              options={{headerShown: false}}
          ></Stack.Screen>
          <Stack.Screen
              name="pomodoro/[id]"
              options={{headerShown: false}}
          ></Stack.Screen>
        </Stack>
      </ThemeProvider>
  );
};

export default RootLayout;