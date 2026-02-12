# Marco Neves - Consultor Imobiliário
App móvel para gestão de leads imobiliários.

## 📱 Instalação no iPhone (Conta Apple Gratuita)

### Pré-requisitos no Mac:
- Xcode 15+ (da App Store)
- Node.js 18+
- CocoaPods: `sudo gem install cocoapods`

### Comandos no Terminal:

```bash
# 1. Navegar para a pasta do projeto
cd caminho/para/marconeves-app

# 2. Instalar dependências
npm install

# 3. Gerar pasta iOS
npx expo prebuild --platform ios --clean

# 4. Instalar CocoaPods
cd ios
pod install
cd ..

# 5. Abrir Xcode
open ios/MarcoNeves.xcworkspace
```

### No Xcode:
1. Xcode → Settings → Accounts → Adicionar Apple ID
2. Selecionar projeto → Signing & Capabilities
3. Marcar "Automatically manage signing"
4. Selecionar Team (Personal Team)
5. Ligar iPhone → Selecionar dispositivo → Play ▶️

### No iPhone (após instalação):
Definições → Geral → Gestão VPN e Dispositivos → Confiar

## 🔑 Configuração
- Bundle ID: `com.marconeves.consultor.imobiliario`
- PIN Admin: `1234`

## 📞 Contacto
Marco Neves - Consultor Imobiliário REMAX
