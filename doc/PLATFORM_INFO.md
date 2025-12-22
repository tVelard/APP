# Information Plateforme - iOS Uniquement

## 🍎 Plateforme Cible

Ce projet est configuré **exclusivement pour iOS** (iPhone et iPad).

### Pourquoi iOS uniquement ?

- ✅ Développement ciblé et optimisé
- ✅ Moins de configurations à gérer
- ✅ Focus sur l'écosystème Apple
- ✅ Utilisation des fonctionnalités natives iOS
- ✅ Meilleure expérience utilisateur sur iPhone/iPad

## 📱 Compatibilité iOS

### Version iOS Minimale
- **iOS 12.0+**

### Appareils Supportés

#### iPhone
- iPhone 6s et plus récents
- iPhone SE (1ère génération et suivantes)
- iPhone 7, 7 Plus
- iPhone 8, 8 Plus
- iPhone X, XR, XS, XS Max
- iPhone 11, 11 Pro, 11 Pro Max
- iPhone 12, 12 mini, 12 Pro, 12 Pro Max
- iPhone 13, 13 mini, 13 Pro, 13 Pro Max
- iPhone 14, 14 Plus, 14 Pro, 14 Pro Max
- iPhone 15, 15 Plus, 15 Pro, 15 Pro Max

#### iPad
- iPad (5ème génération et suivantes)
- iPad mini (4ème génération et suivantes)
- iPad Air (2ème génération et suivantes)
- iPad Pro (tous les modèles)

### Simulateurs
- ✅ Support complet de tous les simulateurs iOS
- ✅ Testable sur Xcode Simulator
- ✅ Compatible avec tous les formats d'écran iOS

## 🛠️ Configuration Requise

### Système de Développement
- **macOS** (obligatoire pour le développement iOS)
- **Xcode** 12.0+ installé
- **CocoaPods** installé (`sudo gem install cocoapods`)
- **Flutter SDK** 3.0.0+

### Vérification de l'Environnement

```bash
# Vérifier Flutter
flutter doctor

# Vérifier Xcode
xcode-select --print-path

# Vérifier CocoaPods
pod --version

# Lister les simulateurs disponibles
xcrun simctl list devices
```

## 📦 Structure du Projet

### Dossier iOS
```
ios/
├── Runner/
│   ├── Info.plist          # Configuration de l'app
│   ├── AppDelegate.swift   # Point d'entrée iOS
│   └── Assets.xcassets/    # Ressources (icônes, images)
├── Runner.xcodeproj/       # Projet Xcode
├── Runner.xcworkspace/     # Workspace Xcode (utilisé avec CocoaPods)
└── Podfile                 # Dépendances CocoaPods
```

### Fichiers Importants

#### Info.plist
Configuration de l'application iOS :
- Permissions
- Deep linking
- Orientations supportées
- URL schemes

#### Podfile
Gère les dépendances natives iOS via CocoaPods.

## 🚀 Commandes de Développement

### Lancer l'Application

```bash
# Sur simulateur (sélection automatique)
flutter run

# Sur simulateur spécifique
flutter run -d "iPhone 15 Pro"

# Sur iPhone physique connecté
flutter run

# Lister les appareils disponibles
flutter devices
```

### Build

```bash
# Build de debug
flutter build ios --debug

# Build de release
flutter build ios --release

# Build avec profiling
flutter build ios --profile
```

### Installation des Pods

```bash
# Aller dans le dossier iOS
cd ios

# Installer les dépendances
pod install

# Mettre à jour les pods
pod update

# Nettoyer le cache
pod cache clean --all
rm -rf Pods
pod install

# Retour au dossier racine
cd ..
```

### Nettoyage

```bash
# Nettoyer Flutter
flutter clean

# Nettoyer les pods iOS
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Nettoyage complet
flutter clean && cd ios && rm -rf Pods Podfile.lock && pod install && cd .. && flutter pub get
```

## 🔧 Configuration iOS Spécifique

### 1. Permissions (Info.plist)

Déjà configurées :
- **NSAppTransportSecurity** : Autorise les connexions HTTPS
- **FlutterDeepLinkingEnabled** : Active les deep links
- **CFBundleURLTypes** : Configure les URL schemes pour Supabase

### 2. Orientations

Par défaut, l'application supporte :
- Portrait
- Paysage gauche
- Paysage droite

Pour modifier, éditez `ios/Runner/Info.plist` :
```xml
<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <!-- Commentez pour désactiver le paysage -->
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

### 3. Icône de l'Application

Remplacez les icônes dans :
```
ios/Runner/Assets.xcassets/AppIcon.appiconset/
```

Tailles requises :
- 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5
- Versions @2x et @3x pour les écrans Retina

### 4. Bundle Identifier

Par défaut : `com.tracktraining.app`

Pour changer, éditez dans Xcode ou `ios/Runner.xcodeproj/project.pbxproj`.

## 📱 Tests sur Appareil Physique

### Prérequis
1. Compte Apple Developer (gratuit pour le test)
2. iPhone connecté en USB
3. Confiance établie entre Mac et iPhone

### Configuration

1. Ouvrir le projet dans Xcode :
```bash
open ios/Runner.xcworkspace
```

2. Dans Xcode :
   - Sélectionnez votre équipe (Team) dans Signing & Capabilities
   - Connectez votre iPhone
   - Sélectionnez votre iPhone comme cible
   - Cliquez sur Run (▶️)

3. Sur votre iPhone :
   - Allez dans Réglages > Général > Gestion des appareils
   - Faites confiance au certificat de développement

### Via Flutter CLI

```bash
# Flutter détecte automatiquement l'iPhone connecté
flutter devices

# Lancer sur l'iPhone
flutter run
```

## 🏗️ Build pour Production

### Prérequis
- Compte Apple Developer Program (99$/an)
- Certificats de distribution configurés
- Profils de provisioning créés

### Étapes

1. **Configuration dans Xcode** :
```bash
open ios/Runner.xcworkspace
```
   - Configurer le Bundle Identifier
   - Sélectionner l'équipe
   - Configurer les certificats

2. **Build de release** :
```bash
flutter build ios --release
```

3. **Archive dans Xcode** :
   - Product > Archive
   - Distribute App
   - App Store Connect
   - Upload

### App Store Connect

1. Créer une nouvelle app sur [App Store Connect](https://appstoreconnect.apple.com)
2. Remplir les informations :
   - Nom de l'app
   - Catégorie
   - Description
   - Screenshots (obligatoire)
   - Politique de confidentialité
3. Soumettre pour review

## 🐛 Résolution de Problèmes

### Erreur : "No such module 'connectivity_plus'"

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
flutter clean
flutter run
```

### Erreur : "Signing for 'Runner' requires a development team"

1. Ouvrir Xcode : `open ios/Runner.xcworkspace`
2. Sélectionner Runner dans le navigateur
3. Dans Signing & Capabilities, sélectionner votre Team

### Erreur : "Unable to boot device"

```bash
# Réinitialiser le simulateur
xcrun simctl erase all
xcrun simctl boot "iPhone 15 Pro"
```

### Simulateur lent

```bash
# Redémarrer le simulateur
killall Simulator
open -a Simulator
```

### Build échoue après mise à jour iOS

```bash
# Nettoyer et reconstruire
flutter clean
cd ios
rm -rf Pods Podfile.lock
pod cache clean --all
pod repo update
pod install
cd ..
flutter pub get
flutter run
```

## 📚 Ressources iOS

### Documentation Officielle
- [iOS Development - Flutter](https://flutter.dev/docs/deployment/ios)
- [Apple Developer](https://developer.apple.com)
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [CocoaPods](https://cocoapods.org)

### Guides Utiles
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

## 🎯 Checklist de Vérification iOS

Avant de soumettre à l'App Store :

- [ ] Bundle Identifier configuré
- [ ] Icône de l'app créée (toutes les tailles)
- [ ] Screenshots pris (tous les formats requis)
- [ ] Description et texte marketing rédigés
- [ ] Politique de confidentialité publiée
- [ ] Compte de test créé pour la review
- [ ] Build de release testé sur appareil physique
- [ ] Pas d'erreurs dans Xcode
- [ ] Certificats et profils valides
- [ ] Version et build number correctement incrémentés

## ✅ Avantages d'iOS Uniquement

### Pour le Développement
- Configuration simplifiée
- Moins de fichiers à maintenir
- Workflow de développement unifié
- Meilleur support d'Xcode

### Pour l'Utilisateur
- Expérience optimisée pour iOS
- Intégration native avec l'écosystème Apple
- Meilleures performances
- Design cohérent avec iOS

### Pour le Déploiement
- Un seul store à gérer (App Store)
- Process de review unifié
- Moins de tests de compatibilité
- Focus sur une seule plateforme

---

**Note** : Si vous avez besoin d'ajouter le support Android à l'avenir, vous devrez :
1. Créer le dossier `android/` avec la configuration appropriée
2. Mettre à jour la documentation
3. Tester sur Android
4. Configurer Google Play Console

Pour l'instant, restez concentré sur iOS pour une meilleure qualité ! 🍎
