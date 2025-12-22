import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  // TODO: Remplacez ces valeurs par vos propres clés Supabase
  // Vous pouvez les trouver dans: Supabase Dashboard > Settings > API
  static const String supabaseUrl = 'VOTRE_SUPABASE_URL';
  static const String supabaseAnonKey = 'VOTRE_SUPABASE_ANON_KEY';

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      authOptions: const FlutterAuthClientOptions(
        authFlowType: AuthFlowType.pkce,
      ),
    );
  }

  static SupabaseClient get client => Supabase.instance.client;
  static GoTrueClient get auth => Supabase.instance.client.auth;
}
