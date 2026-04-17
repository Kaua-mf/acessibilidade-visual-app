import { ScrollView, Text, View, Pressable, Platform, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ScreenContainer } from "@/components/screen-container";

export default function HomeScreen() {
  const router = useRouter();

  const handleColorDetectionPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/color-detection');
  };

  const handleLightDetectionPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/light-detection');
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">
              Acessibilidade Visual
            </Text>
            <Text className="text-base text-foreground text-center">
              Aplicativo para detecção de cores e luz
            </Text>
          </View>

          {/* Feature Cards - Now Clickable */}
          <View className="w-full gap-4">
            {/* Color Detection Card - Clickable */}
            <Pressable
              onPress={handleColorDetectionPress}
              style={({ pressed }) => [
                styles.featureCard,
                pressed && styles.featureCardPressed,
              ]}
            >
              <Text style={styles.cardTitle}>
                🎨 Identificação de Cores
              </Text>
              <Text style={styles.cardDescription}>
                Detecte e identifique cores em tempo real usando a câmera do seu dispositivo. O app anunciará o nome da cor detectada.
              </Text>
              <Text style={styles.cardHint}>
                ➜ Toque para abrir
              </Text>
            </Pressable>

            {/* Light Detection Card - Clickable */}
            <Pressable
              onPress={handleLightDetectionPress}
              style={({ pressed }) => [
                styles.featureCard,
                pressed && styles.featureCardPressed,
              ]}
            >
              <Text style={styles.cardTitle}>
                💡 Detecção de Luz
              </Text>
              <Text style={styles.cardDescription}>
                Ouça um apito que varia de frequência conforme a intensidade da luz. Perfeito para navegação em ambientes com diferentes iluminações.
              </Text>
              <Text style={styles.cardHint}>
                ➜ Toque para abrir
              </Text>
            </Pressable>
          </View>

          {/* Instructions */}
          <View className="w-full bg-surface rounded-2xl p-6 border-2 border-border">
            <Text className="text-lg font-bold text-foreground mb-3">
              Como usar:
            </Text>
            <Text className="text-sm text-foreground leading-relaxed mb-2">
              1. Toque na caixa amarela "Cores" para identificar cores
            </Text>
            <Text className="text-sm text-foreground leading-relaxed mb-2">
              2. Toque na caixa amarela "Luz" para detectar intensidade de luz
            </Text>
            <Text className="text-sm text-foreground leading-relaxed mb-2">
              3. Use a barra de abas para acessar Calibração e outras funções
            </Text>
            <Text className="text-sm text-foreground leading-relaxed">
              4. Toque nos botões grandes para navegar entre as telas
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  featureCard: {
    width: '100%',
    backgroundColor: '#FFFF00',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
  },
  featureCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '500',
  },
  cardHint: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
    fontStyle: 'italic',
  },
});
