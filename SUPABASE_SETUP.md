# Guide de Configuration Supabase - TrackTraining

Ce guide vous accompagne dans la configuration complète de Supabase pour l'application TrackTraining.

## Table des matières

1. [Création du projet Supabase](#1-création-du-projet-supabase)
2. [Configuration de la base de données](#2-configuration-de-la-base-de-données)
3. [Configuration de l'authentification](#3-configuration-de-lauthentification)
4. [Configuration des variables d'environnement](#4-configuration-des-variables-denvironnement)
5. [Schéma de la base de données](#5-schéma-de-la-base-de-données)
6. [Sécurité et Row Level Security](#6-sécurité-et-row-level-security)
7. [Déploiement en production](#7-déploiement-en-production)

---

## 1. Création du projet Supabase

### Étape 1: Créer un compte Supabase

1. Rendez-vous sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub ou créez un compte

### Étape 2: Créer un nouveau projet

1. Cliquez sur "New project"
2. Sélectionnez votre organisation
3. Remplissez les informations:
   - **Name**: `track-training` (ou le nom de votre choix)
   - **Database Password**: Générez un mot de passe fort et conservez-le
   - **Region**: Choisissez la région la plus proche de vos utilisateurs (ex: `West EU (Paris)`)
4. Cliquez sur "Create new project"

> ⏳ La création du projet prend environ 2 minutes.

---

## 2. Configuration de la base de données

### Étape 1: Accéder à l'éditeur SQL

1. Dans le menu latéral, cliquez sur "SQL Editor"
2. Cliquez sur "New query"

### Étape 2: Exécuter le schéma

1. Ouvrez le fichier `supabase/schema.sql` de ce projet
2. Copiez l'intégralité du contenu
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur "Run" (ou `Ctrl/Cmd + Enter`)

Vous devriez voir un message de succès. Les tables suivantes seront créées:
- `profiles` - Profils utilisateurs
- `workouts` - Séances d'entraînement
- `exercises` - Exercices
- `sets` - Séries
- `dropset_entries` - Sous-séries de dropsets

### Étape 3: Vérifier la création des tables

1. Allez dans "Table Editor" dans le menu latéral
2. Vérifiez que les 5 tables sont bien présentes
3. Cliquez sur chaque table pour voir sa structure

---

## 3. Configuration de l'authentification

### Étape 1: Configurer les providers

1. Allez dans "Authentication" → "Providers"
2. Vérifiez que "Email" est activé (activé par défaut)

### Étape 2: Configurer les paramètres email

1. Allez dans "Authentication" → "Email Templates"
2. Personnalisez les templates si nécessaire:
   - **Confirm signup**: Email de confirmation d'inscription
   - **Reset password**: Email de réinitialisation de mot de passe

### Étape 3: (Optionnel) Configurer un SMTP personnalisé

Pour la production, configurez un service SMTP:

1. Allez dans "Project Settings" → "Auth"
2. Descendez jusqu'à "SMTP Settings"
3. Activez "Enable Custom SMTP"
4. Configurez vos paramètres SMTP (ex: SendGrid, Mailgun, etc.)

### Étape 4: Configurer les URLs de redirection

1. Allez dans "Authentication" → "URL Configuration"
2. Configurez:
   - **Site URL**: `http://localhost:5173` (développement)
   - **Redirect URLs**: Ajoutez les URLs autorisées pour la redirection

---

## 4. Configuration des variables d'environnement

### Étape 1: Récupérer les clés API

1. Allez dans "Project Settings" → "API"
2. Copiez les valeurs suivantes:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key

### Étape 2: Créer le fichier .env

1. À la racine du projet, créez un fichier `.env`:

```bash
cp .env.example .env
```

2. Remplissez les valeurs:

```env
VITE_SUPABASE_URL=https://votre-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key-ici
```

> ⚠️ **Important**: Ne jamais commiter le fichier `.env` dans Git. Il est déjà dans `.gitignore`.

---

## 5. Schéma de la base de données

### Diagramme des relations

```
┌─────────────────┐
│    profiles     │
│─────────────────│
│ id (PK, FK)     │──────────────────────────┐
│ email           │                          │
│ display_name    │                          │
│ created_at      │                          │
│ updated_at      │                          │
└─────────────────┘                          │
                                             │
┌─────────────────┐                          │
│    workouts     │                          │
│─────────────────│                          │
│ id (PK)         │                          │
│ user_id (FK)    │──────────────────────────┘
│ name            │
│ date            │
│ notes           │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│   exercises     │
│─────────────────│
│ id (PK)         │
│ workout_id (FK) │
│ name            │
│ position        │
│ notes           │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│      sets       │
│─────────────────│
│ id (PK)         │
│ exercise_id(FK) │
│ position        │
│ reps            │
│ weight          │
│ rest_time       │
│ is_dropset      │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N (si is_dropset = true)
         ▼
┌─────────────────┐
│dropset_entries  │
│─────────────────│
│ id (PK)         │
│ set_id (FK)     │
│ position        │
│ reps            │
│ weight          │
│ created_at      │
└─────────────────┘
```

### Description des tables

#### profiles
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire, liée à auth.users |
| email | TEXT | Email de l'utilisateur |
| display_name | TEXT | Nom d'affichage (optionnel) |
| created_at | TIMESTAMPTZ | Date de création |
| updated_at | TIMESTAMPTZ | Date de mise à jour |

#### workouts
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| user_id | UUID | Référence vers profiles.id |
| name | TEXT | Nom de la séance (ex: "Push", "Legs") |
| date | DATE | Date de la séance |
| notes | TEXT | Notes optionnelles |

#### exercises
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| workout_id | UUID | Référence vers workouts.id |
| name | TEXT | Nom de l'exercice |
| position | INTEGER | Ordre d'affichage |
| notes | TEXT | Notes optionnelles |

#### sets
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| exercise_id | UUID | Référence vers exercises.id |
| position | INTEGER | Ordre d'affichage |
| reps | INTEGER | Nombre de répétitions |
| weight | DECIMAL | Poids en kg |
| rest_time | INTEGER | Temps de repos en secondes |
| is_dropset | BOOLEAN | Indique si c'est un dropset |

#### dropset_entries
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| set_id | UUID | Référence vers sets.id |
| position | INTEGER | Ordre d'affichage |
| reps | INTEGER | Nombre de répétitions |
| weight | DECIMAL | Poids en kg |

---

## 6. Sécurité et Row Level Security

### Principes de sécurité

L'application utilise **Row Level Security (RLS)** pour garantir que:
- Chaque utilisateur ne peut voir/modifier que ses propres données
- Les données sont isolées par utilisateur au niveau de la base de données
- Même avec la clé `anon`, impossible d'accéder aux données d'autres utilisateurs

### Politiques RLS actives

#### profiles
- `Users can view own profile`: SELECT si `auth.uid() = id`
- `Users can update own profile`: UPDATE si `auth.uid() = id`

#### workouts
- `Users can view own workouts`: SELECT si `auth.uid() = user_id`
- `Users can create own workouts`: INSERT avec CHECK `auth.uid() = user_id`
- `Users can update own workouts`: UPDATE si `auth.uid() = user_id`
- `Users can delete own workouts`: DELETE si `auth.uid() = user_id`

#### exercises, sets, dropset_entries
Ces tables utilisent des politiques qui vérifient la propriété en remontant la chaîne:
- exercise → workout → user
- set → exercise → workout → user
- dropset_entry → set → exercise → workout → user

### Vérification des politiques

Pour vérifier que RLS est actif:

1. Allez dans "Table Editor"
2. Sélectionnez une table
3. Cliquez sur "Policies" en haut à droite
4. Vérifiez que toutes les politiques sont bien créées

---

## 7. Déploiement en production

### Étape 1: Mettre à jour les URLs

1. Dans "Authentication" → "URL Configuration":
   - **Site URL**: Votre URL de production (ex: `https://track-training.com`)
   - **Redirect URLs**: Ajoutez votre URL de production

### Étape 2: Configurer SMTP pour la production

Il est **fortement recommandé** de configurer un SMTP personnalisé:
- Meilleure délivrabilité des emails
- Personnalisation complète
- Pas de limite d'envoi

### Étape 3: Variables d'environnement de production

Configurez les variables dans votre plateforme de déploiement:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Autre: Selon la documentation de votre plateforme

### Étape 4: Sauvegardes

Supabase effectue des sauvegardes automatiques, mais vous pouvez:
1. Configurer des sauvegardes Point-in-Time (plan Pro+)
2. Exporter régulièrement vos données via l'interface

---

## Commandes utiles

### Lancer le projet en local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Build pour production

```bash
npm run build
```

---

## Dépannage

### "Invalid API key"
- Vérifiez que les variables d'environnement sont correctement configurées
- Vérifiez que vous utilisez bien la clé `anon` et non la clé `service_role`

### Les données ne s'affichent pas
- Vérifiez que RLS est activé sur toutes les tables
- Vérifiez que les politiques sont correctement configurées
- Vérifiez que vous êtes bien authentifié

### Erreur lors de l'inscription
- Vérifiez la configuration SMTP si vous avez activé la confirmation par email
- Vérifiez les logs dans "Logs" → "Auth Logs"

### "permission denied for table"
- RLS est activé mais aucune politique n'autorise l'accès
- Vérifiez que les politiques sont bien créées

---

## Support

Pour toute question:
- [Documentation Supabase](https://supabase.com/docs)
- [Discord Supabase](https://discord.supabase.com)
- [GitHub Supabase](https://github.com/supabase/supabase)
