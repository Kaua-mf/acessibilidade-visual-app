import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import {
  CalibrationSettings,
  DEFAULT_SETTINGS,
  CALIBRATION_PRESETS,
  loadCalibrationSettings,
  saveCalibrationSettings,
  resetCalibrationSettings,
  applyPreset,
  getCalibrationDescription,
} from '@/lib/calibration-settings';
import {
  SpeechSettings,
  DEFAULT_SPEECH_SETTINGS,
  loadSpeechSettings,
  saveSpeechSettings,
  getSpeechRateDescription,
  getPitchDescription,
} from '@/lib/speech-settings';

export default function CalibrationScreen() {
  const [settings, setSettings] = useState<CalibrationSettings>(DEFAULT_SETTINGS);
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>(DEFAULT_SPEECH_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const colors = useColors();

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [calibration, speech] = await Promise.all([
        loadCalibrationSettings(),
        loadSpeechSettings(),
      ]);
      setSettings(calibration);
      setSpeechSettings(speech);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSensitivityChange = async (value: number) => {
    const updated = { ...settings, colorSensitivity: value, preset: 'custom' as const };
    setSettings(updated);
    await saveCalibrationSettings(updated);
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleMinConfidenceChange = async (value: number) => {
    const updated = { ...settings, minConfidence: value, preset: 'custom' as const };
    setSettings(updated);
    await saveCalibrationSettings(updated);
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleRegionSizeChange = async (value: number) => {
    const updated = { ...settings, regionSize: value, preset: 'custom' as const };
    setSettings(updated);
    await saveCalibrationSettings(updated);
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleUpdateFrequencyChange = async (value: number) => {
    const updated = { ...settings, updateFrequency: value, preset: 'custom' as const };
    setSettings(updated);
    await saveCalibrationSettings(updated);
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleSpeechRateChange = async (value: number) => {
    const updated = { ...speechSettings, rate: value };
    setSpeechSettings(updated);
    await saveSpeechSettings(updated);
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePitchChange = async (value: number) => {
    const updated = { ...speechSettings, pitch: value };
    setSpeechSettings(updated);
    await saveSpeechSettings(updated);
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePresetPress = async (presetName: keyof typeof CALIBRATION_PRESETS) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    const preset = await applyPreset(presetName);
    setSettings(preset);
  };

  const handleReset = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    await resetCalibrationSettings();
    setSettings(DEFAULT_SETTINGS);
  };

  const handleBack = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.back();
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center bg-background">
        <Text className="text-xl font-bold text-foreground">Carregando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 bg-background" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingVertical: 16, paddingBottom: 100 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>⚙️ Calibração</Text>
            <Text style={styles.description}>
              {getCalibrationDescription(settings)}
            </Text>
          </View>

          {/* Presets Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Presets Rápidos</Text>
            <View style={styles.presetsContainer}>
              {Object.entries(CALIBRATION_PRESETS).map(([key, preset]) => (
                <Pressable
                  key={key}
                  onPress={() => handlePresetPress(key as keyof typeof CALIBRATION_PRESETS)}
                  style={({ pressed }) => [
                    styles.presetButton,
                    settings.preset === key && styles.presetButtonActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[
                    styles.presetButtonText,
                    settings.preset === key && styles.presetButtonTextActive,
                  ]}>
                    {key === 'interior' && '🏠 Interior'}
                    {key === 'exterior' && '☀️ Exterior'}
                    {key === 'low-light' && '🌙 Pouca Luz'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Sensitivity Slider */}
          <View style={styles.section}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Sensibilidade de Cores</Text>
              <Text style={styles.sliderValue}>{settings.colorSensitivity}%</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderMin}>Tolerante</Text>
              <View style={styles.slider}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${settings.colorSensitivity}%` },
                  ]}
                />
              </View>
              <Text style={styles.sliderMax}>Rigoroso</Text>
            </View>
            <View style={styles.sliderButtonsContainer}>
              {[0, 25, 50, 75, 100].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => handleSensitivityChange(value)}
                  style={({ pressed }) => [
                    styles.sliderButton,
                    settings.colorSensitivity === value && styles.sliderButtonActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[
                    styles.sliderButtonText,
                    settings.colorSensitivity === value && styles.sliderButtonTextActive,
                  ]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Min Confidence Slider */}
          <View style={styles.section}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Confiança Mínima</Text>
              <Text style={styles.sliderValue}>{settings.minConfidence}%</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderMin}>Baixa</Text>
              <View style={styles.slider}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${settings.minConfidence}%` },
                  ]}
                />
              </View>
              <Text style={styles.sliderMax}>Alta</Text>
            </View>
            <View style={styles.sliderButtonsContainer}>
              {[30, 50, 70, 85, 100].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => handleMinConfidenceChange(value)}
                  style={({ pressed }) => [
                    styles.sliderButton,
                    settings.minConfidence === value && styles.sliderButtonActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[
                    styles.sliderButtonText,
                    settings.minConfidence === value && styles.sliderButtonTextActive,
                  ]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Region Size Slider */}
          <View style={styles.section}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Tamanho da Região</Text>
              <Text style={styles.sliderValue}>{settings.regionSize}px</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderMin}>Pequeno</Text>
              <View style={styles.slider}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${((settings.regionSize - 5) / 45) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.sliderMax}>Grande</Text>
            </View>
            <View style={styles.sliderButtonsContainer}>
              {[10, 15, 20, 30, 40].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => handleRegionSizeChange(value)}
                  style={({ pressed }) => [
                    styles.sliderButton,
                    settings.regionSize === value && styles.sliderButtonActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[
                    styles.sliderButtonText,
                    settings.regionSize === value && styles.sliderButtonTextActive,
                  ]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Update Frequency Slider */}
          <View style={styles.section}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Frequência de Atualização</Text>
              <Text style={styles.sliderValue}>{settings.updateFrequency}ms</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderMin}>Rápido</Text>
              <View style={styles.slider}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${((settings.updateFrequency - 200) / 800) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.sliderMax}>Lento</Text>
            </View>
            <View style={styles.sliderButtonsContainer}>
              {[300, 500, 700, 900, 1000].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => handleUpdateFrequencyChange(value)}
                  style={({ pressed }) => [
                    styles.sliderButton,
                    settings.updateFrequency === value && styles.sliderButtonActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[
                    styles.sliderButtonText,
                    settings.updateFrequency === value && styles.sliderButtonTextActive,
                  ]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Speech Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔊 Configurações de Fala</Text>

            {/* Speech Rate Slider */}
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Velocidade da Fala</Text>
              <Text style={styles.sliderValue}>{getSpeechRateDescription(speechSettings.rate)}</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderMin}>Lento</Text>
              <View style={styles.slider}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${((speechSettings.rate - 0.5) / 1.5) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.sliderMax}>Rápido</Text>
            </View>
            <View style={styles.sliderButtonsContainer}>
              {[0.6, 0.8, 0.9, 1.1, 1.3].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => handleSpeechRateChange(value)}
                  style={({ pressed }) => [
                    styles.sliderButton,
                    Math.abs(speechSettings.rate - value) < 0.05 && styles.sliderButtonActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[
                    styles.sliderButtonText,
                    Math.abs(speechSettings.rate - value) < 0.05 && styles.sliderButtonTextActive,
                  ]}>
                    {value.toFixed(1)}x
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Pitch Slider */}
            <View style={[styles.sliderHeader, { marginTop: 12 }]}>
              <Text style={styles.sliderLabel}>Tom da Voz</Text>
              <Text style={styles.sliderValue}>{getPitchDescription(speechSettings.pitch)}</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderMin}>Grave</Text>
              <View style={styles.slider}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${((speechSettings.pitch - 0.5) / 1.5) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.sliderMax}>Agudo</Text>
            </View>
            <View style={styles.sliderButtonsContainer}>
              {[0.7, 0.85, 1.0, 1.15, 1.3].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => handlePitchChange(value)}
                  style={({ pressed }) => [
                    styles.sliderButton,
                    Math.abs(speechSettings.pitch - value) < 0.05 && styles.sliderButtonActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[
                    styles.sliderButtonText,
                    Math.abs(speechSettings.pitch - value) < 0.05 && styles.sliderButtonTextActive,
                  ]}>
                    {value.toFixed(2)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>💡 Dicas de Calibração</Text>
            <Text style={styles.infoText}>
              • Aumentar sensibilidade em ambientes com iluminação variável{'\n'}
              • Diminuir sensibilidade em ambientes com cores vibrantes{'\n'}
              • Usar presets como ponto de partida{'\n'}
              • Ajustar velocidade da fala conforme sua preferência
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                styles.resetButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.resetButtonText}>🔄 Restaurar Padrão</Text>
            </Pressable>

            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.backButtonText}>← Voltar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#FFFF00',
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFFF00',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  presetsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#666666',
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: '#FFFF00',
    borderColor: '#000000',
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  presetButtonTextActive: {
    color: '#000000',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFF00',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sliderMin: {
    fontSize: 12,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  slider: {
    flex: 1,
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#666666',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#FFFF00',
  },
  sliderMax: {
    fontSize: 12,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  sliderButtonsContainer: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  sliderButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#333333',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#666666',
    alignItems: 'center',
  },
  sliderButtonActive: {
    backgroundColor: '#FFFF00',
    borderColor: '#000000',
  },
  sliderButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sliderButtonTextActive: {
    color: '#000000',
  },
  infoBox: {
    backgroundColor: 'rgba(0, 100, 200, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#0066FF',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#FFFF00',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});
