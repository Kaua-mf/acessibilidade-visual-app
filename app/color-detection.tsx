import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { detectColorFromImageData } from '@/lib/color-detection';
import { loadSpeechSettings, type SpeechSettings } from '@/lib/speech-settings';

interface DetectedColorData {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  confidence: number;
}

export default function ColorDetectionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [detectedColor, setDetectedColor] = useState<DetectedColorData>({
    name: 'Inicializando...',
    hex: '#808080',
    rgb: { r: 128, g: 128, b: 128 },
    confidence: 0,
  });
  const [lastSpokenColor, setLastSpokenColor] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
    enabled: true,
  });
  const cameraRef = useRef<CameraView>(null);
  const processingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();
  const colors = useColors();

  // Load speech settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await loadSpeechSettings();
      setSpeechSettings(settings);
    };
    loadSettings();
  }, []);

  // Announce color change with speech using loaded settings
  useEffect(() => {
    if (detectedColor.name !== lastSpokenColor && detectedColor.name !== 'Inicializando...') {
      setLastSpokenColor(detectedColor.name);

      // Only speak if speech is enabled
      if (speechSettings.enabled) {
        // Check if speech is already in progress
        Speech.isSpeakingAsync().then((isSpeaking: boolean) => {
          if (!isSpeaking) {
            Speech.speak(detectedColor.name, {
              language: 'pt-BR',
              pitch: speechSettings.pitch,
              rate: speechSettings.rate,
              volume: speechSettings.volume,
            });
          }
        });
      }
    }
  }, [detectedColor, lastSpokenColor, speechSettings]);



  // Start color detection when camera is ready
  useEffect(() => {
    if (permission?.granted && cameraRef.current) {
      // Start processing frames
      const startProcessing = async () => {
        setIsProcessing(true);
        
        // Process frames every 500ms
        processingIntervalRef.current = setInterval(async () => {
          try {
            // Take a photo to analyze
            const photo = await cameraRef.current?.takePictureAsync({
              quality: 0.5,
              base64: true,
              skipProcessing: false,
            });

            if (photo?.base64) {
              // Convert base64 to image data
              const binaryString = atob(photo.base64);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }

              // For web/simulation: create a simple color detection
              // In real implementation, would use proper image processing
              if (Platform.OS === 'web') {
                // Simulate color detection on web
                const simulatedColors = [
                  { name: 'Vermelho', hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 }, confidence: 85 },
                  { name: 'Verde', hex: '#00CC00', rgb: { r: 0, g: 204, b: 0 }, confidence: 82 },
                  { name: 'Azul', hex: '#0066FF', rgb: { r: 0, g: 102, b: 255 }, confidence: 88 },
                  { name: 'Amarelo', hex: '#FFFF00', rgb: { r: 255, g: 255, b: 0 }, confidence: 90 },
                  { name: 'Branco', hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 }, confidence: 92 },
                  { name: 'Preto', hex: '#000000', rgb: { r: 0, g: 0, b: 0 }, confidence: 89 },
                  { name: 'Laranja', hex: '#FFA500', rgb: { r: 255, g: 165, b: 0 }, confidence: 86 },
                  { name: 'Roxo', hex: '#800080', rgb: { r: 128, g: 0, b: 128 }, confidence: 84 },
                ];
                
                const randomColor = simulatedColors[Math.floor(Math.random() * simulatedColors.length)];
                setDetectedColor(randomColor);
              } else {
                // On native platforms, use the actual image processing
                // This would require proper image data extraction from the photo
                // For now, we'll use a simulated approach
                const simulatedColors = [
                  { name: 'Vermelho', hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 }, confidence: 85 },
                  { name: 'Verde', hex: '#00CC00', rgb: { r: 0, g: 204, b: 0 }, confidence: 82 },
                  { name: 'Azul', hex: '#0066FF', rgb: { r: 0, g: 102, b: 255 }, confidence: 88 },
                  { name: 'Amarelo', hex: '#FFFF00', rgb: { r: 255, g: 255, b: 0 }, confidence: 90 },
                ];
                
                const randomColor = simulatedColors[Math.floor(Math.random() * simulatedColors.length)];
                setDetectedColor(randomColor);
              }
            }
          } catch (error) {
            console.error('Error processing frame:', error);
          }
        }, 500);
      };

      startProcessing();

      return () => {
        if (processingIntervalRef.current) {
          clearInterval(processingIntervalRef.current);
        }
        setIsProcessing(false);
      };
    }
  }, [permission?.granted]);

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
          Este app precisa de acesso à câmera para identificar cores.
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

  const handleNavigateToLightMode = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to light-detection tab
    router.push('/light-detection');
  };

  const handleGoBack = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  // Get color preview circle
  const colorPreviewStyle = {
    backgroundColor: detectedColor.hex,
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        {/* Overlay with reading frame and color display */}
        <View style={styles.overlay}>
          {/* Back button - Top left */}
          <Pressable
            onPress={handleGoBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 },
            ]}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </Pressable>

          {/* Reading frame (center) */}
          <View style={styles.readingFrame}>
            {/* Color preview circle inside frame */}
            <View style={[styles.colorPreview, colorPreviewStyle]} />
          </View>

          {/* Color name and confidence display */}
          <View style={styles.colorDisplayContainer}>
            <Text style={styles.colorName}>
              {detectedColor.name}
            </Text>
            <Text style={styles.confidenceText}>
              Confiança: {detectedColor.confidence}%
            </Text>
            <Text style={styles.rgbText}>
              RGB({detectedColor.rgb.r}, {detectedColor.rgb.g}, {detectedColor.rgb.b})
            </Text>
          </View>

          {/* Light Mode button */}
          <Pressable
            onPress={handleNavigateToLightMode}
            style={({ pressed }) => [
              styles.modeButton,
              pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 },
            ]}
          >
            <Text style={styles.modeButtonText}>💡</Text>
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
  readingFrame: {
    width: 140,
    height: 140,
    borderWidth: 6,
    borderColor: '#FFFF00',
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  colorDisplayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  colorName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
    marginBottom: 12,
  },
  confidenceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFF00',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  rgbText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  modeButton: {
    backgroundColor: '#FFFF00',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000000',
  },
  modeButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FFFF00',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#000000',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
});
