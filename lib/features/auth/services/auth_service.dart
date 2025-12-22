import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/config/supabase_config.dart';

class AuthService {
  final SupabaseClient _supabase = SupabaseConfig.client;

  // Obtenir l'utilisateur actuellement connecté
  User? get currentUser => _supabase.auth.currentUser;

  // Stream pour écouter les changements d'état d'authentification
  Stream<AuthState> get authStateChanges => _supabase.auth.onAuthStateChange;

  // Vérifier si l'utilisateur est connecté
  bool get isAuthenticated => currentUser != null;

  // Inscription avec email et mot de passe
  Future<AuthResponse> signUp({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _supabase.auth.signUp(
        email: email,
        password: password,
      );
      return response;
    } on AuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw Exception('Erreur lors de l\'inscription: $e');
    }
  }

  // Connexion avec email et mot de passe
  Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );
      return response;
    } on AuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw Exception('Erreur lors de la connexion: $e');
    }
  }

  // Déconnexion
  Future<void> signOut() async {
    try {
      await _supabase.auth.signOut();
    } on AuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw Exception('Erreur lors de la déconnexion: $e');
    }
  }

  // Réinitialisation du mot de passe
  Future<void> resetPassword({required String email}) async {
    try {
      await _supabase.auth.resetPasswordForEmail(email);
    } on AuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw Exception('Erreur lors de la réinitialisation du mot de passe: $e');
    }
  }

  // Mise à jour du mot de passe
  Future<UserResponse> updatePassword({required String newPassword}) async {
    try {
      final response = await _supabase.auth.updateUser(
        UserAttributes(password: newPassword),
      );
      return response;
    } on AuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw Exception('Erreur lors de la mise à jour du mot de passe: $e');
    }
  }

  // Gestion des erreurs d'authentification
  String _handleAuthException(AuthException e) {
    switch (e.message) {
      case 'Invalid login credentials':
        return 'Email ou mot de passe incorrect';
      case 'User already registered':
        return 'Cet email est déjà utilisé';
      case 'Email not confirmed':
        return 'Veuillez confirmer votre email';
      case 'Password should be at least 6 characters':
        return 'Le mot de passe doit contenir au moins 6 caractères';
      default:
        return e.message;
    }
  }
}
