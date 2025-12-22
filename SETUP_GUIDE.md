# Guide de Configuration Complète

## 1. Installation de Flutter

### Windows
```bash
# Téléchargez Flutter depuis https://flutter.dev/docs/get-started/install/windows
# Extrayez l'archive et ajoutez flutter/bin au PATH
flutter doctor
```

### macOS
```bash
# Installez avec Homebrew
brew install --cask flutter

# Ou téléchargez depuis https://flutter.dev/docs/get-started/install/macos
flutter doctor
```

### Linux
```bash
# Téléchargez Flutter depuis https://flutter.dev/docs/get-started/install/linux
# Extrayez et ajoutez au PATH
flutter doctor
```

## 2. Configuration du Projet Supabase

### Étape 1: Créer un compte Supabase

1. Allez sur https://supabase.com
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub, Google ou Email

### Étape 2: Créer un nouveau projet

1. Cliquez sur "New Project"
2. Remplissez les informations:
   - **Name**: TrackTraining (ou votre nom)
   - **Database Password**: Choisissez un mot de passe fort
   - **Region**: Choisissez la région la plus proche
   - **Pricing Plan**: Free (gratuit pour commencer)
3. Cliquez sur "Create new project"
4. Attendez 2-3 minutes que le projet soit créé

### Étape 3: Configuration de l'authentification

1. Dans le menu latéral, allez dans **Authentication** > **Providers**
2. Vérifiez que **Email** est activé (par défaut)
3. Options recommandées:
   - **Enable email confirmations**: Désactivé pour le développement, activé pour la production
   - **Enable auto confirm**: Activé pour le développement
   - **Minimum password length**: 6 caractères minimum

### Étape 4: Récupérer les clés API

1. Allez dans **Settings** (icône engrenage) > **API**
2. Dans la section **Project API keys**, copiez:
   - **URL**: C'est votre `supabaseUrl`
   - **anon public**: C'est votre `supabaseAnonKey`

### Étape 5: Configurer l'application

Ouvrez `lib/core/config/supabase_config.dart` et remplacez:

```dart
static const String supabaseUrl = 'https://xxxxx.supabase.co';
static const String supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 3. Installation des Dépendances

```bash
# Dans le répertoire du projet
flutter pub get
```

## 4. Configuration Android

### Étape 1: AndroidManifest.xml

Ouvrez `android/app/src/main/AndroidManifest.xml` et ajoutez les permissions Internet:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Ajoutez ces permissions avant <application> -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

    <application
        android:label="TrackTraining"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher">

        <!-- Configuration existante -->

        <!-- Ajoutez ceci pour les deep links (optionnel) -->
        <meta-data
            android:name="io.supabase.FlutterDeepLinkingEnabled"
            android:value="true" />
    </application>

    <!-- Ajoutez ceci avant </manifest> pour les deep links (optionnel) -->
    <queries>
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="https" />
        </intent>
    </queries>
</manifest>
```

### Étape 2: build.gradle (app)

Ouvrez `android/app/build.gradle` et vérifiez:

```gradle
android {
    compileSdkVersion 34

    defaultConfig {
        minSdkVersion 21  // Minimum requis
        targetSdkVersion 34
    }
}
```

### Étape 3: Tester sur Android

```bash
# Connectez un appareil Android ou lancez un émulateur
flutter run
```

## 5. Configuration iOS

### Étape 1: Info.plist

Ouvrez `ios/Runner/Info.plist` et ajoutez avant `</dict>`:

```xml
<!-- Permissions réseau (déjà présent normalement) -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>

<!-- Deep linking pour réinitialisation de mot de passe (optionnel) -->
<key>FlutterDeepLinkingEnabled</key>
<true/>
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>io.supabase.tracktraining</string>
        </array>
    </dict>
</array>
```

### Étape 2: Podfile

Ouvrez `ios/Podfile` et vérifiez:

```ruby
platform :ios, '12.0'  # Minimum requis
```

### Étape 3: Installer les pods

```bash
cd ios
pod install
cd ..
```

### Étape 4: Tester sur iOS

```bash
# Connectez un iPhone ou lancez le simulateur
flutter run -d ios
```

## 6. Vérification de l'Installation

### Commandes de vérification

```bash
# Vérifier la configuration Flutter
flutter doctor -v

# Lister les appareils disponibles
flutter devices

# Analyser le code
flutter analyze

# Lancer les tests (si vous en avez)
flutter test
```

### Checklist de vérification

- [ ] Flutter installé et dans le PATH
- [ ] `flutter doctor` ne montre pas d'erreurs critiques
- [ ] Projet Supabase créé
- [ ] Clés API copiées dans `supabase_config.dart`
- [ ] `flutter pub get` exécuté avec succès
- [ ] AndroidManifest.xml configuré
- [ ] Info.plist configuré (pour iOS)
- [ ] L'application se lance sans erreur

## 7. Premiers Tests

### Test 1: Inscription

1. Lancez l'application
2. Cliquez sur "S'inscrire"
3. Entrez un email de test: `test@example.com`
4. Entrez un mot de passe: `password123`
5. Cliquez sur "S'inscrire"
6. Vous devriez voir un message de succès

### Test 2: Vérifier dans Supabase

1. Allez dans votre tableau de bord Supabase
2. **Authentication** > **Users**
3. Vous devriez voir l'utilisateur `test@example.com`

### Test 3: Connexion

1. Sur l'écran de connexion
2. Entrez l'email et le mot de passe
3. Vous devriez être redirigé vers l'écran d'accueil

### Test 4: Déconnexion

1. Sur l'écran d'accueil
2. Cliquez sur l'icône de déconnexion
3. Vous devriez être redirigé vers l'écran de connexion

## 8. Problèmes Courants

### "Failed to resolve: supabase_flutter"

```bash
flutter pub cache repair
flutter clean
flutter pub get
```

### "MissingPluginException"

```bash
flutter clean
flutter pub get
flutter run
```

### Erreur de compilation Android

```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter run
```

### Erreur de pods iOS

```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..
flutter clean
flutter run
```

### "Invalid login credentials"

- Vérifiez que l'utilisateur existe dans Supabase
- Vérifiez que l'email est confirmé (ou désactivez la confirmation)
- Vérifiez que le mot de passe est correct

### L'application ne se connecte pas à Supabase

- Vérifiez les URL et clés API dans `supabase_config.dart`
- Vérifiez votre connexion Internet
- Vérifiez que le projet Supabase est actif

## 9. Configuration Avancée

### Email Templates (Templates d'Email)

1. Dans Supabase: **Authentication** > **Email Templates**
2. Personnalisez les templates:
   - **Confirm signup**: Email de confirmation
   - **Invite user**: Invitation d'utilisateur
   - **Magic Link**: Lien de connexion magique
   - **Reset password**: Réinitialisation de mot de passe

### Row Level Security (RLS)

Si vous ajoutez des tables personnalisées:

```sql
-- Exemple: Table profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Politique: Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### Variables d'Environnement

Pour plus de sécurité en production, utilisez flutter_dotenv:

1. Ajoutez dans `pubspec.yaml`:
```yaml
dependencies:
  flutter_dotenv: ^5.1.0
```

2. Créez `.env`:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Modifiez `supabase_config.dart`:
```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

static String get supabaseUrl => dotenv.env['SUPABASE_URL']!;
static String get supabaseAnonKey => dotenv.env['SUPABASE_ANON_KEY']!;
```

## 10. Déploiement

### Android (Google Play Store)

```bash
# Générer un APK de release
flutter build apk --release

# Ou générer un App Bundle (recommandé)
flutter build appbundle --release
```

### iOS (App Store)

```bash
# Générer un build iOS
flutter build ios --release
```

## Support

Pour toute question ou problème:
- Documentation Flutter: https://flutter.dev/docs
- Documentation Supabase: https://supabase.com/docs
- Stack Overflow: https://stackoverflow.com/questions/tagged/flutter
