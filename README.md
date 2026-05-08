# LinkedIn Content Studio

Ce projet est une solution web professionnelle permettant de générer des publications LinkedIn optimisées pour les entreprises, en s'appuyant sur l'intelligence artificielle.

## Philosophie du Projet

Ce service privilégie la qualité d'exécution et la robustesse technique. L'interface est conçue comme un studio de création minimaliste, ergonomique et performant.

- Design Studio : Interface sombre et épurée, optimisée pour la concentration et le confort visuel.
- Architecture Sécurisée : Route API backend protégeant les clés d'API et gérant les requêtes de manière centralisée.
- Validation Stricte : Utilisation de schémas de données rigoureux pour garantir le respect des contraintes de formatage et de longueur.
- Ingénierie de Prompt : Système de génération orchestré pour produire des contenus structurés incluant une note d'intention stratégique.

## Stack Technique

- Framework : Next.js 14 (App Router)
- Langage : TypeScript
- Style : Tailwind CSS
- Animations : Framer Motion
- Validation : Zod & React Hook Form
- Intelligence Artificielle : API Groq (Modèle Llama 3)

## Lancement Local

1. Installation des dépendances
   ```bash
   npm install
   ```

2. Configuration Environnement
   Créez un fichier .env.local à la racine du projet et ajoutez votre clé :
   ```env
   GROQ_API_KEY=votre_cle_api_groq
   ```

3. Lancement du serveur
   ```bash
   npm run dev
   ```
   L'application sera disponible sur http://localhost:3000.

## Limites Identifiées

Voici une analyse des limites techniques actuelles du système :

1. Mise en cache volatile : Le système utilise une gestion de cache en mémoire vive. Dans un environnement serverless, ce cache est réinitialisé lors des redémarrages d'instances.
2. Persistance locale : La gestion de l'historique repose sur le stockage local du navigateur. Les données ne sont pas partagées entre différents appareils.
3. Absence de contexte long : Le système actuel génère des publications à partir d'un brief ponctuel et ne possède pas de mémoire à long terme de l'identité de marque globale au-delà des paramètres saisis.
