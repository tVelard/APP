# TrackTraining - Application d'Authentification Flutter avec Supabase

Une application mobile Flutter complète avec authentification par email et mot de passe utilisant Supabase.


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
