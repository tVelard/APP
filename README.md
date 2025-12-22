# TrackTraining - Application d'Authentification Flutter avec Supabase

Une application mobile Flutter complète avec authentification par email et mot de passe utilisant Supabase.

## Fonctionnalités

- Inscription avec email et mot de passe
- Connexion avec email et mot de passe
- Déconnexion
- Réinitialisation du mot de passe
- Protection des routes (redirection automatique)
- Gestion d'état avec Riverpod
- Navigation avec GoRouter
- Interface utilisateur Material Design 3

## Prérequis

- Flutter SDK (>=3.0.0)
- macOS avec Xcode installé
- Un compte Supabase (gratuit sur [supabase.com](https://supabase.com))
- Un iPhone ou simulateur iOS pour tester

## Configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte
2. Créez un nouveau projet
3. Attendez que le projet soit configuré (quelques minutes)

### 2. Récupérer les clés API

1. Dans votre tableau de bord Supabase, allez dans **Settings** > **API**
2. Copiez les valeurs suivantes:
   - `Project URL` (URL de votre projet)
   - `anon public` key (clé publique anonyme)

### 3. Configurer l'application

Ouvrez le fichier `lib/core/config/supabase_config.dart` et remplacez les valeurs:

```dart
static const String supabaseUrl = 'VOTRE_URL_SUPABASE';
static const String supabaseAnonKey = 'VOTRE_CLE_ANON_SUPABASE';
```

### 4. Configuration de l'authentification Supabase

1. Dans votre tableau de bord Supabase, allez dans **Authentication** > **Providers**
2. Assurez-vous que **Email** est activé
3. Dans **Authentication** > **Email Templates**, vous pouvez personnaliser les emails

### 5. Configuration des URL de redirection (Optionnel)

Pour la réinitialisation de mot de passe et la confirmation d'email:

#### iOS (ios/Runner/Info.plist)

```xml
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

## Installation

1. Clonez le projet ou créez un nouveau projet Flutter
2. Installez les dépendances:

```bash
flutter pub get
```

3. Lancez l'application:

```bash
# Sur simulateur iOS
flutter run -d ios

# Sur iPhone physique
flutter run
```

## Structure du projet

```
lib/
├── core/
│   ├── config/
│   │   └── supabase_config.dart        # Configuration Supabase
│   └── router/
│       └── app_router.dart             # Configuration du routing
├── features/
│   ├── auth/
│   │   ├── models/
│   │   │   └── user_model.dart         # Modèle utilisateur
│   │   ├── providers/
│   │   │   └── auth_provider.dart      # Providers Riverpod
│   │   ├── screens/
│   │   │   ├── login_screen.dart       # Écran de connexion
│   │   │   └── register_screen.dart    # Écran d'inscription
│   │   └── services/
│   │       └── auth_service.dart       # Service d'authentification
│   └── home/
│       └── screens/
│           └── home_screen.dart        # Écran principal
└── main.dart                            # Point d'entrée
```

## Utilisation

### Inscription

1. Lancez l'application
2. Cliquez sur "S'inscrire"
3. Entrez votre email et mot de passe
4. Vérifiez votre email (si la confirmation est activée dans Supabase)

### Connexion

1. Entrez votre email et mot de passe
2. Cliquez sur "Se connecter"

### Mot de passe oublié

1. Sur l'écran de connexion, entrez votre email
2. Cliquez sur "Mot de passe oublié ?"
3. Vérifiez votre email pour le lien de réinitialisation

### Déconnexion

1. Sur l'écran principal, cliquez sur l'icône de déconnexion dans l'AppBar

## Sécurité

- Les mots de passe doivent contenir au moins 6 caractères
- Les emails sont validés avec une expression régulière
- L'authentification utilise le flow PKCE (Proof Key for Code Exchange)
- Les sessions sont gérées automatiquement par Supabase

## Personnalisation

### Modifier le thème

Éditez le fichier `lib/main.dart`:

```dart
theme: ThemeData(
  colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue), // Changez la couleur
  useMaterial3: true,
  // Ajoutez vos personnalisations
),
```

### Ajouter des champs au profil utilisateur

1. Créez une table `profiles` dans Supabase
2. Modifiez `user_model.dart` pour ajouter les champs
3. Mettez à jour `auth_service.dart` pour gérer les données supplémentaires

## Dépannage

### Erreur "Invalid login credentials"

- Vérifiez que l'email et le mot de passe sont corrects
- Assurez-vous que l'utilisateur a confirmé son email (si activé)

### Erreur de configuration Supabase

- Vérifiez que les URL et clés API sont correctes
- Assurez-vous que le projet Supabase est actif

### Problèmes de navigation

- Vérifiez que `go_router` est correctement configuré
- Assurez-vous que les routes existent dans `app_router.dart`

## Technologies utilisées

- **Flutter** - Framework UI multiplateforme
- **Supabase** - Backend-as-a-Service avec authentification
- **Riverpod** - Gestion d'état réactive
- **GoRouter** - Navigation déclarative
- **Material Design 3** - Design system

## Ressources

- [Documentation Flutter](https://flutter.dev/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation supabase_flutter](https://pub.dev/packages/supabase_flutter)
- [Documentation Riverpod](https://riverpod.dev)
- [Documentation GoRouter](https://pub.dev/packages/go_router)

## Licence

Ce projet est fourni à des fins éducatives et peut être utilisé librement.
