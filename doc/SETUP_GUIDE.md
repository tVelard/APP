# Guide de Configuration Complète

## Installation de Flutter

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

## Configuration du Projet Supabase

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

## Installation des Dépendances

```bash
# Dans le répertoire du projet
flutter pub get
```

##  Configuration iOS

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

## Vérification de l'Installation

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
- [ ] Info.plist configuré (pour iOS)
- [ ] L'application se lance sans erreur

## Configuration Avancée

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


## Quick start

### Lancer l'application

```bash
# Sur simulateur iOS
flutter run -d ios

# Sur iPhone physique
flutter run
```

### Commandes Utiles

```bash
# Vérifier la configuration
flutter doctor -v

# Lister les appareils iOS disponibles
flutter devices

# Nettoyer le projet
flutter clean

# Obtenir les dépendances
flutter pub get

# Analyser le code
flutter analyze

# Lancer sur iOS
flutter run -d ios

# Build iOS
flutter build ios --release
```

### Prochaines Étapes

- Lisez [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) pour voir comment utiliser l'auth
- Consultez [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) pour comprendre l'architecture
- Référez-vous à [SETUP_GUIDE.md](SETUP_GUIDE.md) pour la configuration avancée

### Pour ajouter des fonctionnalités

1. **Ajouter un profil utilisateur**: Voir [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) section 7
2. **Ajouter une nouvelle page**: Créer un fichier dans `features/` et ajouter une route
3. **Modifier le thème**: Éditez `main.dart` section `theme`

### Configuration de Production

Avant de déployer en production:

1.  Activez la confirmation d'email dans Supabase
2.  Configurez les Row Level Security (RLS) policies
3.  Utilisez des variables d'environnement pour les secrets
4.  Testez sur de vrais iPhones
5.  Configurez le signing iOS et les certificats



## Déploiement

### iOS (App Store)

```bash
# Générer un build iOS
flutter build ios --release
```