import { Text, View, Pressable, Platform, StyleSheet } from "react-native";
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
    <ScreenContainer 
      className="flex-1 bg-black" 
      edges={["top", "left", "right", "bottom"]}
      containerClassName="bg-black"
    >
      <View style={styles.container}>
        {/* Title - Logo abaixo da câmera */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Acessibilidade Visual</Text>
        </View>

        {/* Feature Cards - Centered */}
        <View style={styles.cardsContainer}>
          {/* Color Detection Card */}
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
              Detecte e identifique cores em tempo real
            </Text>
            <Text style={styles.cardHint}>
              ➜ Toque para abrir
            </Text>
          </Pressable>

          {/* Light Detection Card */}
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
              Ouça apito que varia com a intensidade de luz
            </Text>
            <Text style={styles.cardHint}>
              ➜ Toque para abrir
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titleSection: {
    position: 'absolute',
    top: 16,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cardsContainer: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  featureCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFF00',
    borderRadius: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: '#000000',
    justifyContent: 'center',
  },
  featureCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cardTitle: {
    fontSize: 20,
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
