# LinkedIn Generator - Générateur de Publications LinkedIn

Ce projet est une solution Full-Stack robuste permettant de générer des publications LinkedIn optimisées pour les PME, en s'appuyant sur l'IA (Groq API).

## Philosophie du Projet : Sobriété & Efficacité

Conformément aux standards de qualité industrielle, ce service privilégie la **qualité d'exécution** et la **fiabilité** sur la complexité visuelle.

- **Design Épuré** : Une interface professionnelle, sobre et efficace, exempte de distractions inutiles.
- **Architecture Robuste** : Validation stricte des données (Client & Serveur) avec **Zod**.
- **Qualité de Code** : Configuration de **Prettier**, **ESLint** et **EditorConfig** pour un code propre et maintenable.
- **Prompt Engineering Avancé** : Utilisation de techniques de *Few-Shot* et *Chain-of-Thought* pour des publications stratégiques.
- **Design SaaS High-End** : Interface premium, responsive, avec micro-animations fluides via **Framer Motion**.
- **Tests & Fiabilité** : Couverture par des tests unitaires (**Vitest**) et logging structuré.

## Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS
- **Validation** : Zod
- **IA** : Groq API (Modèle `llama-3.3-70b-versatile`)

## Installation & Lancement

1. **Installation**
   ```bash
   npm install
   ```

2. **Configuration**
   Créez un fichier `.env.local` à la racine :
   ```env
   GROQ_API_KEY=votre_cle_groq
   ```

3. **Lancement**
   ```bash
   npm run dev
   ```
   L'application est disponible sur [http://localhost:3000](http://localhost:3000).

## Structure du Projet

- `app/api/generate/route.ts` : API sécurisée avec validation Zod et gestion du cache.
- `lib/prompt.ts` : Logique de construction des prompts stratégiques.
- `lib/schemas.ts` : Schémas de données partagés.
- `lib/cache.ts` : Cache en mémoire (TTL 1h).
- `components/` : Composants UI modulaires et épurés.

## Limites & Perspectives (6 mois)

- **Limites** : Cache volatil (RAM), absence d'authentification utilisateur.
- **Pistes** : Persistance Redis, support multi-langues, analytique de performance des posts, planification directe sur LinkedIn.
