# Quick Start - TrackTraining

Guide de démarrage rapide en 5 minutes pour lancer l'application.

## Prérequis

- [Flutter](https://flutter.dev/docs/get-started/install) installé (version ≥3.0.0)
- macOS avec Xcode installé
- Un éditeur de code (VS Code, Xcode, etc.)
- Un compte [Supabase](https://supabase.com) (gratuit)

## Étapes Rapides

### 1. Vérifier l'installation Flutter (1 min)

```bash
flutter doctor
```

Assurez-vous qu'il n'y a pas d'erreurs critiques.

### 2. Créer un projet Supabase (2 min)

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "New Project"
3. Remplissez les informations et créez le projet
4. Attendez 2-3 minutes que le projet soit créé

### 3. Récupérer les clés API (30 sec)

1. Dans le tableau de bord Supabase: **Settings** → **API**
2. Copiez:
   - **URL** (Project URL)
   - **anon public** (Clé anonyme publique)

### 4. Configurer l'application (30 sec)

Ouvrez [lib/core/config/supabase_config.dart](lib/core/config/supabase_config.dart) et remplacez:

```dart
static const String supabaseUrl = 'VOTRE_URL_ICI';
static const String supabaseAnonKey = 'VOTRE_CLE_ICI';
```

Exemple:
```dart
static const String supabaseUrl = 'https://abcdefghij.supabase.co';
static const String supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 5. Installer les dépendances (30 sec)

```bash
flutter pub get
```

### 6. Lancer l'application (30 sec)

```bash
# Sur simulateur iOS
flutter run -d ios

# Sur iPhone physique
flutter run
```

## Test Rapide

### Créer un compte test

1. Sur l'écran d'inscription, entrez:
   - Email: `test@example.com`
   - Mot de passe: `password123`
2. Cliquez sur "S'inscrire"

### Vérifier dans Supabase

1. Allez dans votre tableau de bord Supabase
2. **Authentication** → **Users**
3. Vous devriez voir l'utilisateur `test@example.com`

### Se connecter

1. Sur l'écran de connexion
2. Entrez les identifiants
3. Vous êtes redirigé vers l'écran d'accueil

## Structure des Fichiers Principaux

```
lib/
├── main.dart                                    # Point d'entrée
├── core/
│   ├── config/supabase_config.dart             # ⚠️ À CONFIGURER
│   └── router/app_router.dart                  # Routes
└── features/
    ├── auth/
    │   ├── screens/
    │   │   ├── login_screen.dart               # Page de connexion
    │   │   └── register_screen.dart            # Page d'inscription
    │   ├── services/auth_service.dart          # Service d'auth
    │   └── providers/auth_provider.dart        # Providers
    └── home/
        └── screens/home_screen.dart            # Page d'accueil
```

## Commandes Utiles

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

## Problèmes Courants

### "Invalid login credentials"

**Solution**: Assurez-vous que:
- L'utilisateur existe dans Supabase
- Le mot de passe est correct
- L'email est confirmé (ou désactivez la confirmation d'email dans Supabase)

### Désactiver la confirmation d'email (pour le dev)

1. Supabase Dashboard → **Authentication** → **Providers**
2. Section **Email**
3. Décochez "Enable email confirmations"
4. Sauvegardez

### L'application ne compile pas

```bash
flutter clean
flutter pub get
cd ios && pod install && cd ..
flutter run -d ios
```

### Erreur "MissingPluginException"

```bash
flutter clean
flutter pub get
cd ios && pod install && cd ..
flutter run -d ios
```

### Les clés Supabase ne fonctionnent pas

Vérifiez que vous avez copié:
1. La **Project URL** (pas la référence ou autre URL)
2. La clé **anon public** (pas la clé service_role)

## Prochaines Étapes

### Pour le développement

- Lisez [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) pour voir comment utiliser l'auth
- Consultez [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) pour comprendre l'architecture
- Référez-vous à [SETUP_GUIDE.md](SETUP_GUIDE.md) pour la configuration avancée

### Pour ajouter des fonctionnalités

1. **Ajouter un profil utilisateur**: Voir [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) section 7
2. **Ajouter une nouvelle page**: Créer un fichier dans `features/` et ajouter une route
3. **Modifier le thème**: Éditez `main.dart` section `theme`

### Configuration de Production

Avant de déployer en production:

1. ✅ Activez la confirmation d'email dans Supabase
2. ✅ Configurez les Row Level Security (RLS) policies
3. ✅ Utilisez des variables d'environnement pour les secrets
4. ✅ Testez sur de vrais iPhones
5. ✅ Configurez le signing iOS et les certificats

## Ressources

### Documentation
- [README.md](README.md) - Vue d'ensemble complète
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Configuration détaillée
- [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) - Exemples de code
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture

### Liens Externes
- [Flutter Docs](https://flutter.dev/docs)
- [Supabase Docs](https://supabase.com/docs)
- [supabase_flutter Package](https://pub.dev/packages/supabase_flutter)

## Support

Si vous rencontrez des problèmes:

1. Vérifiez les [Problèmes Courants](#problèmes-courants) ci-dessus
2. Consultez [SETUP_GUIDE.md](SETUP_GUIDE.md) section "Dépannage"
3. Vérifiez les logs Supabase dans le dashboard
4. Utilisez `flutter doctor -v` pour diagnostiquer

---

**Temps total estimé**: 5-10 minutes

**Difficulté**: Débutant

**Compatible avec**: iOS uniquement (iPhone et iPad)
