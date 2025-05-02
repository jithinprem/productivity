import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from './themecontext';
import './globals.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const RootLayout = () => {
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
  );
};

export default RootLayout;