import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';

export const useNativeCapabilities = () => {
  useEffect(() => {
    const initNativeFeatures = async () => {
      if (Capacitor.isNativePlatform()) {
        // Set status bar style
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
        
        // Set up keyboard behavior
        Keyboard.addListener('keyboardWillShow', () => {
          document.body.classList.add('keyboard-open');
        });
        
        Keyboard.addListener('keyboardWillHide', () => {
          document.body.classList.remove('keyboard-open');
        });

        // Handle app state changes for better UX
        App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            // App became active - could refresh data here
            console.log('App became active');
          }
        });
      }
    };

    initNativeFeatures();

    return () => {
      if (Capacitor.isNativePlatform()) {
        Keyboard.removeAllListeners();
        App.removeAllListeners();
      }
    };
  }, []);

  const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style });
    }
  };

  const getDeviceInfo = async () => {
    if (Capacitor.isNativePlatform()) {
      return await Device.getInfo();
    }
    return null;
  };

  return {
    hapticFeedback,
    getDeviceInfo,
    isNative: Capacitor.isNativePlatform(),
  };
};