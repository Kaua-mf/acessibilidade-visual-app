# Acessibilidade Visual - TODO

## Funcionalidades Principais

- [x] Tela 1 - Identificação de Cores
  - [x] Integração da câmera em tempo real
  - [x] Detecção e análise de cores
  - [x] Exibição do nome da cor em texto grande
  - [x] Feedback por voz (text-to-speech)
  - [x] Moldura de leitura visível e com alto contraste
  - [x] Botão "Modo Luz" grande e acessível
  - [x] Feedback haptic ao tocar botão

- [x] Tela 2 - Detecção de Luz
  - [x] Integração da câmera em tempo real
  - [x] Detecção de intensidade de luz
  - [x] Indicador visual simples (círculo dinâmico)
  - [x] Exibição de percentagem de luz
  - [x] Botão "Voltar" grande e acessível
  - [x] Feedback haptic ao tocar botão

## Design e Interface

- [x] Paleta de cores com alto contraste
- [x] Tipografia grande e legível (32-40px)
- [x] Botões grandes (80x80px)
- [x] Moldura de leitura com bordas grossas
- [x] Indicador visual de luz (círculo dinâmico)
- [x] Espaçamento generoso entre elementos
- [x] Sem elementos decorativos que causem distração
- [x] Logo personalizado (olho + lâmpada)

## Acessibilidade

- [x] Permissão de câmera solicitada
- [x] Text-to-speech funcionando
- [x] Haptic feedback funcionando
- [x] Contraste máximo em todos os elementos
- [x] Fontes grandes e legíveis
- [x] Navegação simples e intuitiva
- [x] Sem tela de login ou onboarding

## Navegação

- [x] Sem tela de login ou onboarding
- [x] Acesso direto ao app com três abas
- [x] Navegação entre Tela 1 e Tela 2
- [x] Botões de navegação grandes e acessíveis
- [x] Tela inicial com instruções

## Testes

- [ ] Testar detecção de cores em diferentes iluminações
- [ ] Testar feedback sonoro em diferentes volumes
- [ ] Testar haptic feedback em diferentes dispositivos
- [ ] Testar navegação entre telas
- [ ] Testar permissões de câmera e áudio
- [ ] Testar acessibilidade com screen reader


## Síntese de Apito Variável

- [x] Criar utilitário de síntese de áudio com Web Audio API
- [x] Implementar geração de apito com frequência variável (200-2000 Hz)
- [x] Integrar síntese na Tela 2 de Detecção de Luz
- [x] Botão para ativar/desativar apito
- [x] Exibição de frequência em Hz
- [ ] Testar síntese em diferentes dispositivos
- [ ] Otimizar performance da síntese de áudio
