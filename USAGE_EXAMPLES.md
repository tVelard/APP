# Exemples d'Utilisation

Ce document présente des exemples d'utilisation du système d'authentification dans votre application.

## 1. Vérifier si un utilisateur est connecté

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'features/auth/providers/auth_provider.dart';

class MyWidget extends ConsumerWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isAuthenticated = ref.watch(isAuthenticatedProvider);

    if (isAuthenticated) {
      return const Text('Utilisateur connecté');
    } else {
      return const Text('Utilisateur non connecté');
    }
  }
}
```

## 2. Obtenir les informations de l'utilisateur actuel

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'features/auth/providers/auth_provider.dart';

class UserProfileWidget extends ConsumerWidget {
  const UserProfileWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);

    if (user == null) {
      return const Text('Aucun utilisateur connecté');
    }

    return Column(
      children: [
        Text('Email: ${user.email}'),
        Text('ID: ${user.id}'),
        Text('Créé le: ${user.createdAt}'),
      ],
    );
  }
}
```

## 3. Écouter les changements d'état d'authentification

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'features/auth/providers/auth_provider.dart';

class AuthListenerWidget extends ConsumerWidget {
  const AuthListenerWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);

    return authState.when(
      data: (state) {
        if (state.session != null) {
          return Text('Session active: ${state.session!.user.email}');
        } else {
          return const Text('Aucune session');
        }
      },
      loading: () => const CircularProgressIndicator(),
      error: (error, stack) => Text('Erreur: $error'),
    );
  }
}
```

## 4. Créer une page protégée

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/providers/auth_provider.dart';

class ProtectedScreen extends ConsumerWidget {
  const ProtectedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isAuthenticated = ref.watch(isAuthenticatedProvider);

    // Rediriger si non authentifié
    if (!isAuthenticated) {
      Future.microtask(() => context.go('/login'));
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final user = ref.watch(currentUserProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Page Protégée')),
      body: Center(
        child: Text('Bienvenue ${user?.email}'),
      ),
    );
  }
}
```

## 5. Utiliser le service d'authentification directement

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'features/auth/providers/auth_provider.dart';

class CustomAuthWidget extends ConsumerStatefulWidget {
  const CustomAuthWidget({super.key});

  @override
  ConsumerState<CustomAuthWidget> createState() => _CustomAuthWidgetState();
}

class _CustomAuthWidgetState extends ConsumerState<CustomAuthWidget> {
  Future<void> _customSignIn() async {
    try {
      final authService = ref.read(authServiceProvider);

      await authService.signIn(
        email: 'user@example.com',
        password: 'password123',
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Connexion réussie')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
    }
  }

  Future<void> _customSignOut() async {
    try {
      final authService = ref.read(authServiceProvider);
      await authService.signOut();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Déconnexion réussie')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: _customSignIn,
          child: const Text('Connexion personnalisée'),
        ),
        ElevatedButton(
          onPressed: _customSignOut,
          child: const Text('Déconnexion'),
        ),
      ],
    );
  }
}
```

## 6. Changer le mot de passe de l'utilisateur

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'features/auth/providers/auth_provider.dart';

class ChangePasswordScreen extends ConsumerStatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  ConsumerState<ChangePasswordScreen> createState() =>
      _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends ConsumerState<ChangePasswordScreen> {
  final _newPasswordController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _newPasswordController.dispose();
    super.dispose();
  }

  Future<void> _changePassword() async {
    if (_newPasswordController.text.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Le mot de passe doit contenir au moins 6 caractères'),
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final authService = ref.read(authServiceProvider);
      await authService.updatePassword(
        newPassword: _newPasswordController.text,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Mot de passe mis à jour avec succès'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Changer le mot de passe')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            TextField(
              controller: _newPasswordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Nouveau mot de passe',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _isLoading ? null : _changePassword,
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : const Text('Changer le mot de passe'),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 7. Ajouter une table de profils personnalisée

### SQL dans Supabase

```sql
-- Créer la table profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique de lecture
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Politique d'insertion
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Politique de mise à jour
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Fonction pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Modèle Dart

```dart
// lib/features/profile/models/profile_model.dart
class ProfileModel {
  final String id;
  final String email;
  final String? fullName;
  final String? avatarUrl;
  final DateTime createdAt;
  final DateTime? updatedAt;

  ProfileModel({
    required this.id,
    required this.email,
    this.fullName,
    this.avatarUrl,
    required this.createdAt,
    this.updatedAt,
  });

  factory ProfileModel.fromJson(Map<String, dynamic> json) {
    return ProfileModel(
      id: json['id'] as String,
      email: json['email'] as String,
      fullName: json['full_name'] as String?,
      avatarUrl: json['avatar_url'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'avatar_url': avatarUrl,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}
```

### Service de profil

```dart
// lib/features/profile/services/profile_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/config/supabase_config.dart';
import '../models/profile_model.dart';

class ProfileService {
  final SupabaseClient _supabase = SupabaseConfig.client;

  Future<ProfileModel?> getProfile(String userId) async {
    try {
      final response = await _supabase
          .from('profiles')
          .select()
          .eq('id', userId)
          .single();

      return ProfileModel.fromJson(response);
    } catch (e) {
      throw Exception('Erreur lors de la récupération du profil: $e');
    }
  }

  Future<void> updateProfile({
    required String userId,
    String? fullName,
    String? avatarUrl,
  }) async {
    try {
      await _supabase.from('profiles').update({
        'full_name': fullName,
        'avatar_url': avatarUrl,
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('id', userId);
    } catch (e) {
      throw Exception('Erreur lors de la mise à jour du profil: $e');
    }
  }
}
```

## 8. Gestion des erreurs avancée

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'features/auth/providers/auth_provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AdvancedErrorHandling extends ConsumerStatefulWidget {
  const AdvancedErrorHandling({super.key});

  @override
  ConsumerState<AdvancedErrorHandling> createState() =>
      _AdvancedErrorHandlingState();
}

class _AdvancedErrorHandlingState
    extends ConsumerState<AdvancedErrorHandling> {
  Future<void> _signInWithErrorHandling(String email, String password) async {
    try {
      final authService = ref.read(authServiceProvider);
      await authService.signIn(email: email, password: password);
    } on AuthException catch (e) {
      // Erreurs spécifiques à Supabase
      String message;
      switch (e.statusCode) {
        case '400':
          message = 'Requête invalide';
          break;
        case '401':
          message = 'Email ou mot de passe incorrect';
          break;
        case '422':
          message = 'Email non confirmé';
          break;
        default:
          message = e.message;
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(message), backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      // Autres erreurs
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur inattendue: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
```

## 9. Middleware de navigation personnalisé

```dart
// lib/core/router/auth_guard.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/config/supabase_config.dart';

class AuthGuard {
  static String? redirect(BuildContext context, GoRouterState state) {
    final isAuthenticated = SupabaseConfig.auth.currentSession != null;
    final isAuthPage = state.matchedLocation == '/login' ||
        state.matchedLocation == '/register';

    // Rediriger vers login si non authentifié et pas sur une page d'auth
    if (!isAuthenticated && !isAuthPage) {
      return '/login';
    }

    // Rediriger vers home si authentifié et sur une page d'auth
    if (isAuthenticated && isAuthPage) {
      return '/home';
    }

    return null;
  }
}
```

## 10. Tests unitaires

```dart
// test/auth_service_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:track_training/features/auth/services/auth_service.dart';

void main() {
  group('AuthService', () {
    test('signIn with valid credentials should succeed', () async {
      // Arrangez vos tests ici
      final authService = AuthService();

      // Note: Utilisez un mock pour les vrais tests
      // expect(() => authService.signIn(...), returnsNormally);
    });

    test('signIn with invalid credentials should throw', () async {
      final authService = AuthService();

      // expect(
      //   () => authService.signIn(email: 'bad@email.com', password: 'wrong'),
      //   throwsException,
      // );
    });
  });
}
```

## Ressources Supplémentaires

- [Documentation Riverpod](https://riverpod.dev)
- [Documentation GoRouter](https://pub.dev/packages/go_router)
- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Flutter Best Practices](https://flutter.dev/docs/development/best-practices)
