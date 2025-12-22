# Configuration Git pour TrackTraining

Guide pour initialiser et gérer le dépôt Git de votre projet.

## 🚀 Initialisation Rapide

### 1. Initialiser le dépôt Git

```bash
# Dans le répertoire du projet
git init
```

### 2. Ajouter tous les fichiers

```bash
git add .
```

### 3. Premier commit

```bash
git commit -m "Initial commit: Application TrackTraining avec authentification Supabase

- Configuration Flutter avec null safety
- Authentification email/mot de passe avec Supabase
- Navigation avec GoRouter
- Gestion d'état avec Riverpod
- Écrans de connexion et inscription
- Documentation complète en français
- Compatible Android et iOS"
```

### 4. Créer un dépôt distant (GitHub)

```bash
# Remplacez USERNAME et REPO_NAME par vos valeurs
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 📋 Branches Recommandées

### Structure des branches

```
main (production)
├── develop (développement)
│   ├── feature/user-profile
│   ├── feature/workout-tracking
│   └── feature/statistics
└── hotfix/critical-bug
```

### Créer les branches principales

```bash
# Créer la branche de développement
git checkout -b develop
git push -u origin develop

# Retourner sur main
git checkout main
```

### Workflow de développement

```bash
# Créer une nouvelle feature
git checkout develop
git checkout -b feature/nom-de-la-feature

# Faire vos modifications
git add .
git commit -m "feat: description de la feature"

# Pousser la feature
git push -u origin feature/nom-de-la-feature

# Créer une Pull Request sur GitHub
# Après review et merge, supprimer la branche locale
git checkout develop
git pull
git branch -d feature/nom-de-la-feature
```

## 🔐 Configuration de Sécurité

### Vérifier que .gitignore est correct

```bash
# Vérifier que .env n'est PAS tracké
git status

# Si .env apparaît, l'ajouter à .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: add .env to gitignore"
```

### Important: Ne JAMAIS commit

- ❌ Fichiers `.env` avec des secrets
- ❌ Clés API Supabase en clair
- ❌ Keystores Android
- ❌ Certificats iOS
- ❌ Fichiers de configuration locaux
- ❌ Données utilisateur

### Vérification avant commit

```bash
# Vérifier ce qui va être commité
git diff --cached

# Vérifier qu'aucun secret n'est présent
git diff --cached | grep -i "supabase"
git diff --cached | grep -i "password"
git diff --cached | grep -i "secret"
```

## 📝 Convention de Commits

### Format recommandé

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types de commits

| Type | Description | Exemple |
|------|-------------|---------|
| `feat` | Nouvelle fonctionnalité | `feat(auth): add password reset` |
| `fix` | Correction de bug | `fix(login): resolve keyboard issue` |
| `docs` | Documentation | `docs: update README with setup` |
| `style` | Formatage, style | `style(login): improve button spacing` |
| `refactor` | Refactoring | `refactor(auth): extract validation logic` |
| `test` | Tests | `test(auth): add login tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `perf` | Performance | `perf(home): optimize image loading` |

### Exemples de commits

```bash
# Nouvelle fonctionnalité
git commit -m "feat(profile): add user profile screen"

# Correction de bug
git commit -m "fix(auth): handle network errors gracefully"

# Documentation
git commit -m "docs: add usage examples for providers"

# Refactoring
git commit -m "refactor(auth): split auth service into smaller methods"

# Tests
git commit -m "test(auth): add unit tests for email validation"

# Performance
git commit -m "perf(images): add caching for user avatars"
```

## 🏷️ Tags et Versions

### Créer un tag pour une version

```bash
# Version 1.0.0 (première release)
git tag -a v1.0.0 -m "Release 1.0.0: Initial production release"
git push origin v1.0.0

# Version 1.0.1 (bugfix)
git tag -a v1.0.1 -m "Release 1.0.1: Fix login issue"
git push origin v1.0.1

# Version 1.1.0 (nouvelle feature)
git tag -a v1.1.0 -m "Release 1.1.0: Add user profiles"
git push origin v1.1.0
```

### Lister les tags

```bash
git tag
git tag -l "v1.*"
```

### Voir un tag spécifique

```bash
git show v1.0.0
```

## 🔄 Workflow Complet

### Nouvelle fonctionnalité

```bash
# 1. Partir de develop
git checkout develop
git pull

# 2. Créer une branche feature
git checkout -b feature/workout-tracking

# 3. Développer et commiter régulièrement
git add .
git commit -m "feat(workout): add workout model"

git add .
git commit -m "feat(workout): add workout service"

git add .
git commit -m "feat(workout): add workout screen"

# 4. Pousser la branche
git push -u origin feature/workout-tracking

# 5. Créer une Pull Request sur GitHub

# 6. Après merge, nettoyer
git checkout develop
git pull
git branch -d feature/workout-tracking
```

### Correction urgente (hotfix)

```bash
# 1. Partir de main
git checkout main
git pull

# 2. Créer une branche hotfix
git checkout -b hotfix/critical-login-bug

# 3. Corriger le bug
git add .
git commit -m "fix(auth): resolve critical login bug"

# 4. Pousser
git push -u origin hotfix/critical-login-bug

# 5. Merger dans main ET develop
# Via Pull Request ou:
git checkout main
git merge hotfix/critical-login-bug
git push

git checkout develop
git merge hotfix/critical-login-bug
git push

# 6. Tag la version
git checkout main
git tag -a v1.0.1 -m "Hotfix 1.0.1: Critical login bug"
git push origin v1.0.1

# 7. Nettoyer
git branch -d hotfix/critical-login-bug
git push origin --delete hotfix/critical-login-bug
```

## 🛠️ Commandes Utiles

### Voir l'historique

```bash
# Historique complet
git log

# Historique condensé
git log --oneline

# Graphique des branches
git log --oneline --graph --all

# Historique avec auteurs
git log --pretty=format:"%h - %an, %ar : %s"
```

### Annuler des modifications

```bash
# Annuler les modifications non commitées
git checkout -- fichier.dart

# Annuler tous les changements non committés
git reset --hard

# Annuler le dernier commit (garder les changements)
git reset --soft HEAD~1

# Annuler le dernier commit (supprimer les changements)
git reset --hard HEAD~1
```

### Nettoyer le dépôt

```bash
# Supprimer les fichiers non trackés
git clean -n  # Voir ce qui sera supprimé
git clean -f  # Supprimer

# Supprimer les branches locales mergées
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d
```

## 📊 Statistiques et Insights

### Voir les contributions

```bash
# Nombre de commits par auteur
git shortlog -sn

# Statistiques détaillées
git log --stat

# Lignes ajoutées/supprimées
git log --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s removed lines: %s total lines: %s\n", add, subs, loc }'
```

## 🔍 Recherche dans l'historique

```bash
# Rechercher un commit contenant du texte
git log --all --grep="auth"

# Rechercher dans le code
git log -S"AuthService"

# Voir qui a modifié une ligne
git blame lib/main.dart
```

## 🚨 En cas de problème

### Conflit de merge

```bash
# 1. Identifier les fichiers en conflit
git status

# 2. Ouvrir les fichiers et résoudre les conflits
# Chercher les marqueurs: <<<<<<<, =======, >>>>>>>

# 3. Ajouter les fichiers résolus
git add fichier-resolu.dart

# 4. Continuer le merge
git commit
```

### Récupérer un fichier supprimé

```bash
# Trouver le commit où le fichier existait
git log --all --full-history -- fichier.dart

# Restaurer le fichier
git checkout COMMIT_HASH -- fichier.dart
```

### Réinitialiser complètement

```bash
# ⚠️ ATTENTION: Supprime TOUS les changements
git fetch origin
git reset --hard origin/main
git clean -fd
```

## 📦 .gitignore Recommandé

Vérifiez que votre `.gitignore` contient au minimum:

```gitignore
# Secrets et configuration
.env
.env.local
*.env

# IDE
.vscode/
.idea/
*.iml

# Flutter/Dart
.dart_tool/
.packages
.pub-cache/
.pub/
build/

# Android
*.keystore
*.jks
local.properties
android/app/google-services.json

# iOS
*.mobileprovision
*.p12
ios/Runner/GoogleService-Info.plist
```

## 🤝 Collaboration

### Forker le projet

```bash
# 1. Forker sur GitHub (bouton Fork)

# 2. Cloner votre fork
git clone https://github.com/VOTRE_USERNAME/TrackTraining.git
cd TrackTraining

# 3. Ajouter le dépôt original comme upstream
git remote add upstream https://github.com/ORIGINAL_USERNAME/TrackTraining.git

# 4. Synchroniser avec l'upstream
git fetch upstream
git merge upstream/main
```

### Contribuer

```bash
# 1. Créer une branche depuis develop
git checkout develop
git checkout -b feature/ma-contribution

# 2. Faire vos modifications
git add .
git commit -m "feat: ma contribution"

# 3. Pousser sur votre fork
git push origin feature/ma-contribution

# 4. Créer une Pull Request sur GitHub
```

## 📚 Ressources Git

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

---

**Note**: Adaptez ces workflows à votre équipe et vos besoins spécifiques !
