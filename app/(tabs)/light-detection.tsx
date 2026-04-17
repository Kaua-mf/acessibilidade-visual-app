import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { LightSensor } from 'expo-sensors';
import {
  playLightDetectionWhistle,
  stopWhistle,
  cleanup,
  lightPercentageToFrequency,
} from '@/lib/audio-synthesis';

export default function LightDetectionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [lightLevel, setLightLevel] = useState<number>(0);
  const [lightPercentage, setLightPercentage] = useState<number>(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [isWhistleActive, setIsWhistleActive] = useState<boolean>(true);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const colors = useColors();

  // Initialize whistle on component mount
  useEffect(() => {
    // Start whistle when component mounts
    if (permission?.granted) {
      setIsWhistleActive(true);
      playLightDetectionWhistle(lightPercentage, 0.3);
    }

    return () => {
      // Clean up whistle on unmount
      stopWhistle();
      cleanup();
    };
  }, [permission?.granted]);

  // Update whistle frequency based on light changes
  useEffect(() => {
    if (isWhistleActive) {
      playLightDetectionWhistle(lightPercentage, 0.3);
    }
  }, [lightPercentage, isWhistleActive]);

  // Subscribe to light sensor on Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      const subscribe = () => {
        const sub = LightSensor.addListener((data: any) => {
          // Light sensor returns illuminance in lux
          // Normalize to 0-100 percentage (0-10000 lux range)
          const percentage = Math.min(100, Math.round((data.illuminance / 10000) * 100));
          setLightLevel(data.illuminance);
          setLightPercentage(percentage);
        });
        setSubscription(sub);
      };

      subscribe();

      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    } else {
      // For iOS and Web, simulate light detection
      const simulateLightDetection = () => {
        const randomLight = Math.floor(Math.random() * 100);
        setLightPercentage(randomLight);
        setLightLevel(randomLight * 100);
      };

      const interval = setInterval(simulateLightDetection, 500);
      return () => clearInterval(interval);
    }
  }, [subscription]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center p-6 bg-background">
        <Text className="text-2xl font-bold text-foreground text-center mb-4">
          Permissão de Câmera Necessária
        </Text>
        <Text className="text-lg text-foreground text-center mb-6">
          Este app precisa de acesso à câmera para detectar luz.
        </Text>
        <Pressable
          onPress={async () => {
            if (Platform.OS !== 'web') {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
            requestPermission();
          }}
          style={({ pressed }) => [
            pressed && { opacity: 0.8 },
          ]}
          className="bg-primary px-8 py-4 rounded-full"
        >
          <Text className="text-lg font-bold text-black text-center">
            Permitir Câmera
          </Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const handleNavigateToColors = async () => {
    // Stop whistle before navigation
    stopWhistle();
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Navigate back to home
    router.back();
  };

  const toggleWhistle = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    if (isWhistleActive) {
      stopWhistle();
      setIsWhistleActive(false);
    } else {
      setIsWhistleActive(true);
      playLightDetectionWhistle(lightPercentage, 0.3);
    }
  };

  // Calculate indicator size based on light level
  const indicatorSize = 60 + (lightPercentage / 100) * 80;
  const currentFrequency = lightPercentageToFrequency(lightPercentage);

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        {/* Overlay with light indicator */}
        <View style={styles.overlay}>
          {/* Light indicator (circle that grows with light) */}
          <View style={styles.indicatorContainer}>
            <View
              style={[
                styles.lightIndicator,
                {
                  width: indicatorSize,
                  height: indicatorSize,
                },
              ]}
            />
          </View>

          {/* Light level text display */}
          <View style={styles.lightDisplayContainer}>
            <Text style={styles.lightLabel}>Intensidade de Luz</Text>
            <Text style={styles.lightPercentage}>
              {lightPercentage}%
            </Text>
            <Text style={styles.frequencyLabel}>
              {currentFrequency} Hz
            </Text>
          </View>

          {/* Control buttons */}
          <View style={styles.buttonContainer}>
            {/* Toggle whistle button */}
            <Pressable
              onPress={toggleWhistle}
              style={({ pressed }) => [
                styles.toggleButton,
                pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 },
                !isWhistleActive && styles.toggleButtonInactive,
              ]}
            >
              <Text style={styles.toggleButtonText}>
                {isWhistleActive ? '🔊' : '🔇'}
              </Text>
            </Pressable>

            {/* Back button */}
            <Pressable
              onPress={handleNavigateToColors}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 },
              ]}
            >
              <Text style={styles.backButtonText}>← Voltar</Text>
            </Pressable>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  indicatorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightIndicator: {
    width: 180,
    height: 180,
    borderWidth: 8,
    borderColor: '#000000',
    backgroundColor: '#FFFF00',
    borderRadius: 0,
  },
  lightDisplayContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  lightLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  lightPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFF00',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  frequencyLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#FFFF00',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000000',
  },
  toggleButtonInactive: {
    backgroundColor: '#CCCCCC',
    borderColor: '#666666',
  },
  toggleButtonText: {
    fontSize: 32,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FFFF00',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000000',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
});
