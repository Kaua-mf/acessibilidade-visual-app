import { ScrollView, Text, View, TouchableOpacity } from "react-native";

import { ScreenContainer } from "@/components/screen-container";

export default function HomeScreen() {
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

          {/* Feature Cards */}
          <View className="w-full gap-4">
            {/* Color Detection Card */}
            <View className="w-full bg-primary rounded-2xl p-6 border-2 border-foreground">
              <Text className="text-2xl font-bold text-black mb-2">
                🎨 Identificação de Cores
              </Text>
              <Text className="text-sm text-black leading-relaxed">
                Detecte e identifique cores em tempo real usando a câmera do seu dispositivo. O app anunciará o nome da cor detectada.
              </Text>
            </View>

            {/* Light Detection Card */}
            <View className="w-full bg-primary rounded-2xl p-6 border-2 border-foreground">
              <Text className="text-2xl font-bold text-black mb-2">
                💡 Detecção de Luz
              </Text>
              <Text className="text-sm text-black leading-relaxed">
                Ouça um apito que varia de frequência conforme a intensidade da luz. Perfeito para navegação em ambientes com diferentes iluminações.
              </Text>
            </View>
          </View>

          {/* Instructions */}
          <View className="w-full bg-surface rounded-2xl p-6 border-2 border-border">
            <Text className="text-lg font-bold text-foreground mb-3">
              Como usar:
            </Text>
            <Text className="text-sm text-foreground leading-relaxed mb-2">
              1. Toque em "Cores" para identificar cores
            </Text>
            <Text className="text-sm text-foreground leading-relaxed mb-2">
              2. Toque em "Luz" para detectar intensidade de luz
            </Text>
            <Text className="text-sm text-foreground leading-relaxed">
              3. Use os botões grandes para navegar entre as telas
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
