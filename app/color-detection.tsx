import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';

interface ColorData {
  name: string;
  hex: string;
}

const colorDatabase: Record<string, ColorData> = {
  // Red spectrum
  '#FF0000': { name: 'Vermelho', hex: '#FF0000' },
  '#FF6666': { name: 'Vermelho Claro', hex: '#FF6666' },
  '#CC0000': { name: 'Vermelho Escuro', hex: '#CC0000' },
  
  // Orange spectrum
  '#FF6600': { name: 'Laranja', hex: '#FF6600' },
  '#FFAA33': { name: 'Laranja Claro', hex: '#FFAA33' },
  '#CC5500': { name: 'Laranja Escuro', hex: '#CC5500' },
  
  // Yellow spectrum
  '#FFFF00': { name: 'Amarelo', hex: '#FFFF00' },
  '#FFFF99': { name: 'Amarelo Claro', hex: '#FFFF99' },
  '#CCCC00': { name: 'Amarelo Escuro', hex: '#CCCC00' },
  
  // Green spectrum
  '#00CC00': { name: 'Verde', hex: '#00CC00' },
  '#66FF66': { name: 'Verde Claro', hex: '#66FF66' },
  '#009900': { name: 'Verde Escuro', hex: '#009900' },
  
  // Blue spectrum
  '#0066FF': { name: 'Azul', hex: '#0066FF' },
  '#6699FF': { name: 'Azul Claro', hex: '#6699FF' },
  '#003399': { name: 'Azul Escuro', hex: '#003399' },
  
  // Purple spectrum
  '#9933FF': { name: 'Roxo', hex: '#9933FF' },
  '#CC99FF': { name: 'Roxo Claro', hex: '#CC99FF' },
  '#660099': { name: 'Roxo Escuro', hex: '#660099' },
  
  // Pink spectrum
  '#FF0099': { name: 'Rosa', hex: '#FF0099' },
  '#FF66CC': { name: 'Rosa Claro', hex: '#FF66CC' },
  '#CC0066': { name: 'Rosa Escuro', hex: '#CC0066' },
  
  // Brown spectrum
  '#996633': { name: 'Marrom', hex: '#996633' },
  '#CC9966': { name: 'Marrom Claro', hex: '#CC9966' },
  '#663300': { name: 'Marrom Escuro', hex: '#663300' },
  
  // Gray spectrum
  '#CCCCCC': { name: 'Cinza Claro', hex: '#CCCCCC' },
  '#999999': { name: 'Cinza', hex: '#999999' },
  '#333333': { name: 'Cinza Escuro', hex: '#333333' },
  
  // Black and White
  '#FFFFFF': { name: 'Branco', hex: '#FFFFFF' },
  '#000000': { name: 'Preto', hex: '#000000' },
};

function getClosestColor(r: number, g: number, b: number): ColorData {
  let closestColor = { name: 'Desconhecido', hex: '#808080' };
  let minDistance = Infinity;

  for (const [hex, colorData] of Object.entries(colorDatabase)) {
    const hexR = parseInt(hex.substring(1, 3), 16);
    const hexG = parseInt(hex.substring(3, 5), 16);
    const hexB = parseInt(hex.substring(5, 7), 16);

    const distance = Math.sqrt(
      Math.pow(r - hexR, 2) + Math.pow(g - hexG, 2) + Math.pow(b - hexB, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = colorData;
    }
  }

  return closestColor;
}

export default function ColorDetectionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [detectedColor, setDetectedColor] = useState<ColorData>({ name: 'Inicializando...', hex: '#808080' });
  const [lastSpokenColor, setLastSpokenColor] = useState<string>('');
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    // Announce color change with speech
    if (detectedColor.name !== lastSpokenColor && detectedColor.name !== 'Inicializando...') {
      setLastSpokenColor(detectedColor.name);
      
      // Check if speech is already in progress
      Speech.isSpeakingAsync().then((isSpeaking: boolean) => {
        if (!isSpeaking) {
          Speech.speak(detectedColor.name, {
            language: 'pt-BR',
            pitch: 1.0,
            rate: 0.9,
          });
        }
      });
    }
  }, [detectedColor, lastSpokenColor]);

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

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => {
          // Simulate color detection (in real app, would use image processing)
          const simulateColorDetection = () => {
            const colors = [
              { name: 'Vermelho', hex: '#FF0000' },
              { name: 'Verde', hex: '#00CC00' },
              { name: 'Azul', hex: '#0066FF' },
              { name: 'Amarelo', hex: '#FFFF00' },
              { name: 'Branco', hex: '#FFFFFF' },
              { name: 'Preto', hex: '#000000' },
            ];
            
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            setDetectedColor(randomColor);
          };

          // Simulate detection every 2 seconds
          const interval = setInterval(simulateColorDetection, 2000);
          return () => clearInterval(interval);
        }}
      >
        {/* Overlay with reading frame and color display */}
        <View style={styles.overlay}>
          {/* Reading frame (center) */}
          <View style={styles.readingFrame} />

          {/* Color name display */}
          <View style={styles.colorDisplayContainer}>
            <Text style={styles.colorName}>
              {detectedColor.name}
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
            <Text style={styles.modeButtonText}>🔊 Modo Luz</Text>
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
    width: 120,
    height: 120,
    borderWidth: 6,
    borderColor: '#FFFF00',
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
    borderRadius: 8,
  },
  colorDisplayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  modeButton: {
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
  modeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
});
