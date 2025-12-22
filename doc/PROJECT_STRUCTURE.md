# Structure du Projet TrackTraining

## Architecture de l'Application

L'application suit une architecture en couches avec séparation des responsabilités (Feature-First Architecture).

```
TrackTraining/
│
├── lib/
│   ├── core/                          # Fonctionnalités partagées
│   │   ├── config/
│   │   │   └── supabase_config.dart   # Configuration Supabase
│   │   └── router/
│   │       └── app_router.dart        # Configuration du routing (GoRouter)
│   │
│   ├── features/                      # Fonctionnalités de l'application
│   │   ├── auth/                      # Module d'authentification
│   │   │   ├── models/
│   │   │   │   └── user_model.dart    # Modèle de données utilisateur
│   │   │   ├── providers/
│   │   │   │   └── auth_provider.dart # Providers Riverpod pour l'auth
│   │   │   ├── screens/
│   │   │   │   ├── login_screen.dart  # Écran de connexion
│   │   │   │   └── register_screen.dart # Écran d'inscription
│   │   │   └── services/
│   │   │       └── auth_service.dart  # Service d'authentification
│   │   │
│   │   └── home/                      # Module page d'accueil
│   │       └── screens/
│   │           └── home_screen.dart   # Écran principal après connexion
│   │
│   └── main.dart                      # Point d'entrée de l'application
│
├── test/                              # Tests unitaires et d'intégration
│
├── android/                           # Configuration Android
│   └── app/
│       └── src/
│           └── main/
│               └── AndroidManifest.xml
│
├── ios/                               # Configuration iOS
│   └── Runner/
│       └── Info.plist
│
├── pubspec.yaml                       # Dépendances Flutter
├── analysis_options.yaml              # Configuration de l'analyse statique
├── .gitignore                         # Fichiers à ignorer par Git
├── .env.example                       # Exemple de variables d'environnement
│
├── README.md                          # Documentation principale
├── SETUP_GUIDE.md                     # Guide de configuration détaillé
├── USAGE_EXAMPLES.md                  # Exemples d'utilisation
└── PROJECT_STRUCTURE.md               # Ce fichier
```

## Description des Modules

### 1. Core (lib/core/)

Module contenant les fonctionnalités partagées et la configuration globale.

#### config/
- **supabase_config.dart**: Configuration centralisée de Supabase avec les clés API et méthodes d'initialisation

#### router/
- **app_router.dart**: Configuration du routage avec GoRouter, gestion de la navigation et protection des routes

### 2. Features (lib/features/)

Modules fonctionnels organisés par feature (fonctionnalité métier).

#### auth/ - Module d'Authentification
Gère toute la logique d'authentification de l'application.

**models/**
- `user_model.dart`: Modèle de données représentant un utilisateur (id, email, dates)

**providers/**
- `auth_provider.dart`: Providers Riverpod pour:
  - État d'authentification (stream)
  - Utilisateur actuel
  - Service d'authentification
  - État de connexion

**screens/**
- `login_screen.dart`: Interface de connexion avec:
  - Formulaire email/mot de passe
  - Validation des champs
  - Gestion des erreurs
  - Lien vers l'inscription
  - Réinitialisation du mot de passe

- `register_screen.dart`: Interface d'inscription avec:
  - Formulaire email/mot de passe/confirmation
  - Validation des champs
  - Gestion des erreurs
  - Lien vers la connexion

**services/**
- `auth_service.dart`: Service métier pour:
  - Inscription (signUp)
  - Connexion (signIn)
  - Déconnexion (signOut)
  - Réinitialisation du mot de passe (resetPassword)
  - Mise à jour du mot de passe (updatePassword)
  - Gestion centralisée des erreurs

#### home/ - Module Page d'Accueil
Page principale accessible après authentification.

**screens/**
- `home_screen.dart`: Écran d'accueil avec:
  - Affichage de l'email de l'utilisateur
  - Bouton de déconnexion
  - Message de bienvenue

### 3. Main (lib/main.dart)

Point d'entrée de l'application:
- Initialisation de Flutter
- Initialisation de Supabase
- Configuration du ProviderScope (Riverpod)
- Configuration du thème Material Design 3
- Lancement du router

## Flux de Données

```
┌─────────────────────────────────────────────────────────┐
│                       User Interface                     │
│                    (Screens/Widgets)                     │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ├─ Lecture d'état
                     │
          ┌──────────▼──────────────────┐
          │   Providers (Riverpod)      │
          │  - authStateProvider        │
          │  - currentUserProvider      │
          │  - isAuthenticatedProvider  │
          └─────────────┬───────────────┘
                        │
                        ├─ Appelle les méthodes
                        │
          ┌─────────────▼─────────────────┐
          │   Auth Service                │
          │  - signIn()                   │
          │  - signUp()                   │
          │  - signOut()                  │
          │  - resetPassword()            │
          └─────────────┬─────────────────┘
                        │
                        ├─ Communique avec
                        │
          ┌─────────────▼─────────────────┐
          │   Supabase Client             │
          │  (Configuration)              │
          └─────────────┬─────────────────┘
                        │
                        ├─ API HTTP
                        │
          ┌─────────────▼─────────────────┐
          │   Supabase Backend            │
          │  (Cloud)                      │
          └───────────────────────────────┘
```

## Principes de Conception

### 1. Separation of Concerns (Séparation des Responsabilités)
- **Models**: Structures de données pures
- **Services**: Logique métier et communication API
- **Providers**: Gestion d'état réactive
- **Screens**: Interface utilisateur

### 2. Single Responsibility Principle
Chaque classe a une responsabilité unique:
- `AuthService`: Gestion de l'authentification uniquement
- `SupabaseConfig`: Configuration Supabase uniquement
- `AppRouter`: Routing et navigation uniquement

### 3. Dependency Injection
Utilisation de Riverpod pour l'injection de dépendances:
- Les services sont fournis via des providers
- Les widgets consomment les providers selon leurs besoins
- Facilite les tests et la maintenance

### 4. Feature-First Organization
Organisation par fonctionnalité (auth, home) plutôt que par type:
- Tout ce qui concerne l'auth est dans `features/auth/`
- Facilite l'ajout de nouvelles fonctionnalités
- Meilleure scalabilité

### 5. Null Safety
Tout le code utilise le Null Safety de Dart:
- Types non-nullables par défaut
- Utilisation explicite de `?` pour les nullable
- Réduction des erreurs à l'exécution

## Technologies Utilisées

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| Flutter | >=3.0.0 | Framework UI |
| Dart | >=3.0.0 | Langage |
| supabase_flutter | ^2.5.0 | Authentification et Backend |
| flutter_riverpod | ^2.5.0 | Gestion d'état |
| go_router | ^14.0.0 | Navigation |

## Patterns Utilisés

### 1. Provider Pattern (Riverpod)
- Gestion d'état réactive et déclarative
- Injection de dépendances
- Cache automatique des données

### 2. Repository Pattern (implicite via Services)
- Abstraction de la source de données
- Facilite les changements de backend
- Testabilité améliorée

### 3. MVC-like Architecture
- **Models**: Structures de données
- **Views**: Screens et Widgets
- **Controllers**: Services et Providers

## Extension du Projet

### Ajouter une nouvelle fonctionnalité

1. Créer un nouveau dossier dans `features/`:
```
features/
└── new_feature/
    ├── models/
    ├── providers/
    ├── screens/
    └── services/
```

2. Créer les modèles de données dans `models/`
3. Créer les services dans `services/`
4. Créer les providers dans `providers/`
5. Créer les interfaces dans `screens/`
6. Ajouter les routes dans `app_router.dart`

### Ajouter une nouvelle route

Dans `lib/core/router/app_router.dart`:
```dart
GoRoute(
  path: '/new-route',
  builder: (context, state) => const NewScreen(),
),
```

### Ajouter un nouveau provider

Dans le fichier provider approprié:
```dart
final newProvider = Provider<NewService>((ref) {
  return NewService();
});
```

## Conventions de Code

### Nommage
- **Fichiers**: snake_case (ex: `auth_service.dart`)
- **Classes**: PascalCase (ex: `AuthService`)
- **Variables**: camelCase (ex: `currentUser`)
- **Constantes**: camelCase avec const (ex: `const supabaseUrl`)

### Organisation des imports
1. Packages Dart/Flutter
2. Packages externes
3. Fichiers locaux

```dart
// Dart/Flutter
import 'package:flutter/material.dart';

// Packages externes
import 'package:supabase_flutter/supabase_flutter.dart';

// Fichiers locaux
import '../config/supabase_config.dart';
```

### Structure d'une classe Screen
```dart
class MyScreen extends ConsumerStatefulWidget {
  const MyScreen({super.key});

  @override
  ConsumerState<MyScreen> createState() => _MyScreenState();
}

class _MyScreenState extends ConsumerState<MyScreen> {
  // 1. Variables d'état
  // 2. Controllers
  // 3. Lifecycle methods (initState, dispose)
  // 4. Méthodes privées
  // 5. Build method

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Implementation
  }
}
```

## Sécurité

### Bonnes Pratiques Implémentées
1. ✅ Utilisation de PKCE pour l'authentification
2. ✅ Validation des entrées utilisateur
3. ✅ Gestion sécurisée des erreurs
4. ✅ Pas de secrets dans le code (utiliser des variables d'environnement)
5. ✅ HTTPS uniquement pour les communications

### À Faire pour la Production
1. ⚠️ Activer la confirmation d'email
2. ⚠️ Configurer le rate limiting
3. ⚠️ Implémenter la rotation des tokens
4. ⚠️ Ajouter l'authentification à deux facteurs
5. ⚠️ Logs et monitoring

## Performance

### Optimisations Implémentées
- Utilisation de `const` constructors
- Lazy loading des providers
- Single child scroll view pour les formulaires
- Gestion efficace des streams

### Métriques Cibles
- Temps de démarrage: < 2s
- Temps de connexion: < 1s
- Taille de l'APK: < 20MB

## Tests

### Structure des Tests
```
test/
├── unit/
│   ├── models/
│   ├── services/
│   └── providers/
├── widget/
│   └── screens/
└── integration/
    └── auth_flow_test.dart
```

### Commandes de Test
```bash
# Tous les tests
flutter test

# Tests spécifiques
flutter test test/unit/services/auth_service_test.dart

# Avec couverture
flutter test --coverage
```

## Débogage

### Logs Utiles
```dart
// Dans auth_service.dart
print('Auth: Tentative de connexion pour $email');

// Dans auth_provider.dart
print('Auth State: ${authState.value}');
```

### Outils de Débogage
- Flutter DevTools
- Supabase Dashboard (logs et utilisateurs)
- Network Inspector
- Widget Inspector

## Ressources

### Documentation
- [README.md](README.md) - Guide de démarrage rapide
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Configuration détaillée
- [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) - Exemples de code

### Liens Externes
- [Flutter Docs](https://flutter.dev/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Riverpod Docs](https://riverpod.dev)
- [GoRouter Docs](https://pub.dev/packages/go_router)
