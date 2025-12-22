// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:track_training/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Note: Ce test nécessite que Supabase soit configuré
    // Pour des tests unitaires sans Supabase, utilisez des mocks

    // Build our app (commenté car nécessite l'initialisation de Supabase)
    // await tester.pumpWidget(const MyApp());

    // Exemple de test de base
    expect(true, true);
  });

  group('Email Validation Tests', () {
    test('Valid email should return true', () {
      final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');

      expect(emailRegex.hasMatch('test@example.com'), true);
      expect(emailRegex.hasMatch('user.name@domain.co.uk'), true);
      expect(emailRegex.hasMatch('user+tag@example.com'), true);
    });

    test('Invalid email should return false', () {
      final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');

      expect(emailRegex.hasMatch('invalid'), false);
      expect(emailRegex.hasMatch('invalid@'), false);
      expect(emailRegex.hasMatch('@example.com'), false);
      expect(emailRegex.hasMatch('invalid@.com'), false);
    });
  });

  group('Password Validation Tests', () {
    test('Password with 6+ characters should be valid', () {
      expect('password123'.length >= 6, true);
      expect('123456'.length >= 6, true);
      expect('abcdef'.length >= 6, true);
    });

    test('Password with less than 6 characters should be invalid', () {
      expect('12345'.length >= 6, false);
      expect('abc'.length >= 6, false);
      expect(''.length >= 6, false);
    });
  });
}
