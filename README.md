# LinkedIn Generator - Impalia

Ce projet est la restitution du test technique pour le poste d'Ingénieur(e) IA Full-Stack chez Impalia.
Il s'agit d'une solution web permettant de générer des publications LinkedIn optimisées pour les PME, en s'appuyant sur l'IA (Groq API).

## 🎯 Philosophie du Projet : Qualité & Robustesse

Conformément aux consignes du test technique, ce service privilégie la **qualité d'exécution** et la **fiabilité**. Le design complexe a été écarté au profit d'une interface robuste, ergonomique et directement utilisable.

- **Design Épuré & Simple** : Interface claire, responsive, se concentrant sur la saisie du besoin.
- **Architecture Sécurisée** : Route API backend (`/api/generate`) protégeant totalement la clé d'API Groq.
- **Validation Stricte** : Utilisation de **Zod** côté client et serveur pour garantir le respect des longueurs imposées (Description: 2000, Brief: 500, Publication: 1300).
- **Prompt Engineering Spécialisé** : Format de sortie strictement imposé en JSON natif avec séparation de la publication et de la note d'intention.

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS
- **Validation** : Zod & React Hook Form
- **IA** : API Groq (Modèle `llama-3.3-70b-versatile`) - *Choisi pour son temps de réponse fulgurant.*

## 🚀 Lancement Local

1. **Cloner et installer les dépendances**
   ```bash
   npm install
   ```

2. **Configuration Environnement**
   Créez un fichier `.env.local` à la racine du projet et ajoutez votre clé :
   ```env
   GROQ_API_KEY=votre_cle_api_groq
   ```

3. **Lancement du serveur de développement**
   ```bash
   npm run dev
   ```
   L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## ⚠️ Limites Identifiées (Version Actuelle)

Comme demandé dans l'énoncé, voici les limites actuelles du système :

1. **Mise en cache en mémoire volatile** : Le système utilise une `Map` en RAM (`lib/cache.ts`). Dans un environnement serverless (Vercel, AWS Lambda), ce cache est détruit au redémarrage des instances (cold starts).
2. **Historique local (Local Storage)** : Les archives (si implémentées) reposent sur le navigateur. Aucune donnée n'est persistée en base, empêchant le travail collaboratif.
3. **Absence de système de RAG** : L'IA ne peut actuellement pas analyser l'historique complet d'une entreprise pour imiter ses tournures de phrases passées de manière fine.

*Pour plus de détails sur les pistes d'amélioration à 6 mois, veuillez consulter le document PDF de Restitution.*
