# Guia per publicar Nutria a l'Apple App Store 🍎

Ja hem deixat **Nutria 100% preparada i el projecte natiu d'iOS (`ios/App/App.xcodeproj`) JA està generat i sincronitzat en aquest codi**!

---

## Què hem deixat ja llest al projecte?
✅ **Capacitor 8** i `@capacitor/ios` instal·lats i sincronitzats.
✅ Carpeta nativa `/ios` generada amb el projecte Xcode oficial (`App.xcodeproj`).
✅ **App Icon oficial d'Apple** generat amb la imatge de la Nutria amb el carretó.
✅ **Permisos de càmera (`NSCameraUsageDescription`)** configurats a `Info.plist` (imprescindible per passar la revisió d'Apple pel lector de codis de barres).
✅ Codi web compilat a `dist` i sincronitzat dins dels actius de l'app nativa.

---

## Com penjar-la a l'App Store Connect pas a pas:

### Requisits d'Apple (obligatoris per a qualsevol persona o empresa):
1. **Compte d'Apple Developer:** Apple requereix estar inscrit a l'[Apple Developer Program](https://developer.apple.com/programs/) (99 $ USD/any). Sense aquest compte, Apple no permet pujar apps a la botiga pública.
2. **Un Mac amb Xcode:** Xcode (gratuït a la Mac App Store) s'encarrega de signar el paquet `.ipa` i pujar-lo als servidors d'Apple.

---

### Opció 1: Descarregar aquest projecte i obrir Xcode al Mac (Recomanat) 💻

Com que ja hem generat la carpeta nativa `ios/`:

1. Descarrega el codi d'aquest projecte al teu Mac.
2. Obre un terminal a la carpeta del projecte i executa:
   ```bash
   npx cap open ios
   ```
   *(Això obrirà directament l'Xcode amb el projecte de Nutria).*
3. A Xcode, a la pestanya **Signing & Capabilities**:
   - Marca **Automatically manage signing**.
   - Selecciona el teu **Team** (el teu compte d'Apple Developer).
   - Bundle Identifier: `com.nutria.app`
4. Al menú superior d'Xcode, tria la destinació **Any iOS Device (arm64)**.
5. Ves a **Product > Archive**.
6. Quan acabi de compilar, fes clic a **Distribute App** > **App Store Connect** > **Upload**.
7. En 10-15 minuts l'aplicació apareixerà al teu panell d'[App Store Connect](https://appstoreconnect.apple.com) llesta per passar la revisió i publicar-se!

---

### Opció 2: Mitjançant PWABuilder (Sense necessitat de tocar Xcode manualment) ⚡

Com que **Nutria** és una Progressive Web App de primer nivell amb manifest i icones:

1. Entra a [PWABuilder.com](https://www.pwabuilder.com/).
2. Introdueix la URL pública de la teva app (la que et dóna Vercel com `https://nutria-app.vercel.app`, o obrint la pestanya emergent de la preview d'AI Studio).
3. Fes clic a **«Package for Stores»** i tria **iOS**.
4. PWABuilder et genera el paquet d'iOS llest per pujar directament amb TestFlight o App Store Connect!

---

## Com provar-la com a Web App al teu mòbil (iPhone o Android) 📲
1. **Publica el projecte a Vercel** (és 100% gratuït i triga 1 minut amb el botó d'Exportació a GitHub d'AI Studio i `vercel.json` que ja està configurat).
2. Obre la teva URL resultant a **Safari** (iPhone) o **Chrome** (Android).
3. Toca **Compartir > «Afegir a la pantalla d'inici»** (a iOS) o **«Instal·la l'aplicació»** (a Android).
4. Tindràs Nutria instal·lada amb la seva icona de la nutria amb el carretó, sense barres de navegador i funcionant a pantalla completa exactament com una app descarregada de la botiga!
