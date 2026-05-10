# Forge Studio — LinkedIn Content Generator

🔗 **[Accéder à l'application en ligne](https://linked-in-generator-seven.vercel.app/)** | 📄 **[Consulter le rapport de restitution (PDF)](./Restitution/restitution_linkedin_studio_VF.pdf)**

Forge Studio est une application web de pointe dédiée à la génération stratégique de contenus pour LinkedIn. Conçu avec une interface épurée et propulsé par une ingénierie de prompt avancée, cet outil transforme vos idées en publications professionnelles percutantes et prêtes à être partagées.

## 📸 Aperçu

![Interface du Studio](Screenshoots/Studio_page.png)
*Interface principale de génération*

![Résultat de la génération](Screenshoots/studio_page_apres_generation.png)
*Résultat avec note d'intention stratégique*

![Historique des publications](Screenshoots/History_page.png)
*Historique des générations*

## ✨ Fonctionnalités Clés

- **Ergonomie Premium** : Une interface moderne (Dark Mode) pensée pour la concentration et la productivité éditoriale.
- **Conformité LinkedIn** : Validation stricte des données générées (limites de caractères, formatage) garantissant des posts adaptés à l'algorithme.
- **Transparence IA** : Chaque génération inclut une "note d'intention" détaillant les choix de structure, de ton et d'angle d'approche.
- **Sécurité et Performance** : Appels API côté serveur sécurisés et inférence ultra-rapide grâce au moteur Llama 3 via Groq.
- **Historique Intégré** : Suivi et conservation de vos précédentes générations directement dans l'interface.

## Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript (Strict Mode)
- **Style** : Tailwind CSS & Vanilla CSS
- **Animations** : Framer Motion
- **Moteur IA** : Groq (Llama 3)
- **Validation** : Zod

## Guide de Démarrage

### Prérequis
- Node.js 18+ installé
- Une clé API [Groq](https://console.groq.com/)

### Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer l'environnement**
   Créez un fichier `.env.local` à la racine du projet et ajoutez votre clé API :
   ```env
   GROQ_API_KEY=votre_cle_api_groq
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Accéder à l'application**
   Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Roadmap & Évolutions

- [ ] **Base de Données Distante** : Intégration de Supabase/PostgreSQL pour la sauvegarde et la synchronisation cross-device de l'historique.
- [ ] **Publication Directe** : Intégration de l'API LinkedIn (OAuth) pour publier directement depuis le studio.
- [ ] **Personnalisation par RAG** : Système de Retrieval-Augmented Generation pour analyser les anciens posts de l'utilisateur et reproduire parfaitement sa "voix".

---
*Conçu avec exigence pour les professionnels de la communication.*