import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { LightSensor } from 'expo-sensors';

export default function LightDetectionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [lightLevel, setLightLevel] = useState<number>(0);
  const [lightPercentage, setLightPercentage] = useState<number>(0);
  const [subscription, setSubscription] = useState<any>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    // Subscribe to light sensor on Android
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
          onPress={requestPermission}
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
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate back to color-detection tab
    router.push('/color-detection');
  };

  // Calculate indicator size based on light level
  const indicatorSize = 60 + (lightPercentage / 100) * 80;

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
          </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightIndicator: {
    borderWidth: 4,
    borderColor: '#FFFF00',
    backgroundColor: 'rgba(255, 255, 0, 0.2)',
    borderRadius: 100,
  },
  lightDisplayContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
  backButton: {
    backgroundColor: '#FFFF00',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 60,
    minWidth: 80,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000000',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
});
