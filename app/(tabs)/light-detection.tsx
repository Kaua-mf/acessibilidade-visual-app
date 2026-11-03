import React, { useState, useRef, useEffect } from 'react';
<<<<<<< HEAD
import { AccessibilityInfo, View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { lightReadingLabel } from '@/lib/accessibility-labels';
import { useScreenReaderEnabled } from '@/lib/use-screen-reader';
import { captureSample } from '@/lib/frame-capture';
import {
  createLightSmoother,
  estimateLight,
  meanLinearLuminance,
} from '@/lib/light-analysis';
=======
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { LightSensor } from 'expo-sensors';
>>>>>>> f3a1d43427e9ed208e3ebf0794154b3a7b6dbf77
import {
  playLightDetectionWhistle,
  stopWhistle,
  cleanup,
  lightPercentageToFrequency,
} from '@/lib/audio-synthesis';

<<<<<<< HEAD
const LIGHT_UPDATE_INTERVAL_MS = 500;
const WHISTLE_VOLUME = 0.3;
// Depois de tantas falhas seguidas, avisa que a câmera não está funcionando
const MAX_CONSECUTIVE_FAILURES = 5;
const CAMERA_UNAVAILABLE_TEXT = 'Câmera indisponível';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function LightDetectionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [lightPercentage, setLightPercentage] = useState<number>(0);
  const [hasReading, setHasReading] = useState<boolean>(false);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [cameraFailed, setCameraFailed] = useState<boolean>(false);
  const [isWhistleActive, setIsWhistleActive] = useState<boolean>(true);
  const cameraRef = useRef<CameraView>(null);
  const screenReaderEnabled = useScreenReaderEnabled();
  // Em ref: o laço de leitura sempre usa o valor mais recente, sem precisar reiniciar
  const screenReaderRef = useRef<boolean>(false);
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    screenReaderRef.current = screenReaderEnabled;
  }, [screenReaderEnabled]);

  // Libera o áudio ao sair da tela
  useEffect(() => {
    return () => {
      stopWhistle();
      cleanup();
    };
  }, []);

  // Laço de leitura: mede a luz do que a câmera está vendo (Android, iOS e web).
  // Uma leitura só começa depois que a anterior terminou (nunca se sobrepõem).
  useEffect(() => {
    if (!permission?.granted || !cameraReady) return;

    let cancelled = false;
    const smoother = createLightSmoother(0.5);

    const run = async () => {
      let failures = 0;
      while (!cancelled) {
        const startedAt = Date.now();

        try {
          const camera = cameraRef.current;
          if (!camera) throw new Error('A câmera ainda não está disponível.');

          // O EXIF traz a exposição escolhida pela câmera, que mede a luz melhor
          // do que o brilho dos pixels (a câmera compensa o brilho sozinha)
          const sample = await captureSample(camera, { includeExif: true });
          if (cancelled) return;

          failures = 0;
          const estimate = estimateLight(meanLinearLuminance(sample.data), sample.exif);
          setLightPercentage(Math.round(smoother.smooth(estimate.percentage)));
          setHasReading(true);
          setCameraFailed(false);
        } catch (error) {
          if (cancelled) return;
          failures++;
          console.warn('Erro ao medir a luz:', error);
          if (failures === MAX_CONSECUTIVE_FAILURES) {
            setHasReading(false);
            setCameraFailed(true);
            // Com leitor de tela ligado, usa a voz dele (evita duas vozes ao mesmo tempo)
            if (screenReaderRef.current) {
              AccessibilityInfo.announceForAccessibility(CAMERA_UNAVAILABLE_TEXT);
            } else {
              Speech.speak(CAMERA_UNAVAILABLE_TEXT, { language: 'pt-BR' });
            }
          }
        }

        const elapsed = Date.now() - startedAt;
        await sleep(Math.max(50, LIGHT_UPDATE_INTERVAL_MS - elapsed));
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [permission?.granted, cameraReady]);

  // O apito só começa depois da primeira leitura real e acompanha a luz
  useEffect(() => {
    if (!permission?.granted || !hasReading || !isWhistleActive) {
      stopWhistle();
      return;
    }
    playLightDetectionWhistle(lightPercentage, WHISTLE_VOLUME);
  }, [permission?.granted, hasReading, isWhistleActive, lightPercentage]);
=======
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
>>>>>>> f3a1d43427e9ed208e3ebf0794154b3a7b6dbf77

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center p-6 bg-background">
<<<<<<< HEAD
        <Text
          accessibilityRole="header"
          className="text-2xl font-bold text-foreground text-center mb-4"
        >
=======
        <Text className="text-2xl font-bold text-foreground text-center mb-4">
>>>>>>> f3a1d43427e9ed208e3ebf0794154b3a7b6dbf77
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
<<<<<<< HEAD
          accessibilityRole="button"
          accessibilityLabel="Permitir acesso à câmera"
          accessibilityHint="Abre a janela do sistema para autorizar o uso da câmera"
=======
>>>>>>> f3a1d43427e9ed208e3ebf0794154b3a7b6dbf77
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
<<<<<<< HEAD
=======
      playLightDetectionWhistle(lightPercentage, 0.3);
>>>>>>> f3a1d43427e9ed208e3ebf0794154b3a7b6dbf77
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
<<<<<<< HEAD
        importantForAccessibility="no"
        onCameraReady={() => setCameraReady(true)}
=======
>>>>>>> f3a1d43427e9ed208e3ebf0794154b3a7b6dbf77
      >
        {/* Overlay with light indicator */}
        <View style={styles.overlay}>
          {/* Light indicator (circle that grows with light) */}
<<<<<<< HEAD
          <View
            style={styles.indicatorContainer}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
          >
=======
          <View style={styles.indicatorContainer}>
>>>>>>> f3a1d43427e9ed208e3ebf0794154b3a7b6dbf77
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
<<<<<<< HEAD
          <View
            style={styles.lightDisplayContainer}
            accessible
            accessibilityRole="text"
            accessibilityLabel={lightReadingLabel(lightPercentage, cameraFailed)}
          >
            <Text style={styles.lightLabel}>
              {cameraFailed ? CAMERA_UNAVAILABLE_TEXT : 'Intensidade de Luz'}
            </Text>
=======
          <View style={styles.lightDisplayContainer}>
            <Text style={styles.lightLabel}>Intensidade de Luz</Text>
>>>>>>> f3a1d43427e9ed208e3ebf0794154b3a7b6dbf77
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
<<<<<<< HEAD
              accessibilityRole="switch"
              accessibilityLabel="Apito de luz"
              accessibilityHint="Liga ou desliga o som que muda conforme a luz"
              accessibilityState={{ checked: isWhistleActive }}
=======
>>>>>>> f3a1d43427e9ed208e3ebf0794154b3a7b6dbf77
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
<<<<<<< HEAD
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              accessibilityHint="Volta para a tela anterior"
=======
>>>>>>> f3a1d43427e9ed208e3ebf0794154b3a7b6dbf77
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
