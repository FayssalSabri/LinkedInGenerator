# Forge Studio — LinkedIn Content Generator

🔗 **[Accéder à l'application en ligne](https://linked-in-generator-seven.vercel.app/)** | 📄 **[Consulter le rapport de restitution (PDF)](./Restitution/restitution_linkedin_studio_VF.pdf)**

Forge Studio est une application web de pointe dédiée à la génération stratégique de contenus pour LinkedIn. Conçu avec une interface épurée et propulsé par une ingénierie de prompt avancée, cet outil transforme vos idées en publications professionnelles percutantes et prêtes à être partagées.

## 📸 Aperçu

![Interface du Studio](Screenshots/Studio_page.png)
*Interface principale de génération*

![Résultat de la génération](Screenshots/studio_page_apres_generation.png)
*Résultat avec note d'intention stratégique*

![Historique des publications](Screenshots/History_page.png)
*Historique des générations*

## ✨ Fonctionnalités Clés

- **Ergonomie Premium** : Une interface moderne (Dark Mode) pensée pour la concentration et la productivité éditoriale.
- **Conformité LinkedIn** : Validation stricte des données générées (limites de caractères, formatage) garantissant des posts adaptés à l'algorithme.
- **Transparence IA** : Chaque génération inclut une "note d'intention" détaillant les choix de structure, de ton et d'angle d'approche.
- **Sécurité et Performance** : Appels API côté serveur sécurisés, rate limiting, et inférence ultra-rapide grâce au moteur Llama 3 via Groq.
- **Historique Intégré** : Suivi et conservation de vos précédentes générations directement dans l'interface.

## Stack Technique

| Composant | Technologie | Justification |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR + API Routes, déploiement Vercel |
| **Langage** | TypeScript (Strict Mode) | Typage end-to-end, maintenabilité |
| **Style** | Tailwind CSS & CSS Custom Properties | Design tokens centralisés, utility-first |
| **Animations** | Framer Motion | Transitions fluides, feedback utilisateur |
| **Moteur IA** | Groq (Llama-3.3-70b) | Latence sub-seconde, qualité de génération |
| **Validation** | Zod + React Hook Form | Validation isomorphe client/serveur/sortie IA |
| **Tests** | Vitest + Testing Library | Tests unitaires et d'intégration |

## Architecture

```
├── app/
│   ├── api/generate/     # Route API sécurisée (rate limiting, validation Zod, cache)
│   ├── history/           # Page bibliothèque des archives
│   ├── layout.tsx         # Layout racine avec ErrorBoundary
│   ├── page.tsx           # Page studio de génération
│   └── globals.css        # Design tokens (CSS Custom Properties)
├── components/
│   ├── Navbar.tsx         # Navigation partagée
│   ├── Form.tsx           # Formulaire avec accessibilité (a11y)
│   ├── Result.tsx         # Affichage résultat + skeleton loading
│   ├── LinkedInPost.tsx   # Mockup réaliste LinkedIn
│   ├── CopyButton.tsx     # Bouton copie réutilisable
│   ├── ErrorBoundary.tsx  # Gestion d'erreurs globale
│   └── Typewriter.tsx     # Effet de frappe progressive
├── hooks/
│   └── useClipboard.ts   # Hook clipboard avec feedback
├── lib/
│   ├── schemas.ts         # Schémas Zod (entrée + sortie)
│   ├── prompt.ts          # Prompt engineering (CoT + few-shot)
│   ├── cache.ts           # Cache typé en mémoire (TTL 1h)
│   ├── storage.ts         # Wrapper localStorage sécurisé (SSR-safe)
│   └── rateLimit.ts       # Rate limiter par IP
└── __tests__/             # Suite de tests complète
```

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

4. **Exécuter les tests**
   ```bash
   npm run test
   ```

5. **Accéder à l'application**
   Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Qualité du Code

- **TypeScript Strict** — Zéro `any`, typage complet end-to-end
- **Validation triple** — Client (Zod) → Serveur (Zod) → Sortie IA (Zod)
- **Sécurité** — Clé API côté serveur, rate limiting (10 req/min/IP)
- **Accessibilité** — ARIA labels, rôles, navigation clavier (⌘+Entrée)
- **Tests** — Schémas, prompts, cache, rate limiter, stockage
- **CI/CD** — GitHub Actions (type-check → test → build)

## Roadmap & Évolutions

- [ ] **Base de Données Distante** : Intégration de Supabase/PostgreSQL pour la sauvegarde et la synchronisation cross-device de l'historique.
- [ ] **Publication Directe** : Intégration de l'API LinkedIn (OAuth) pour publier directement depuis le studio.
- [ ] **Personnalisation par RAG** : Système de Retrieval-Augmented Generation pour analyser les anciens posts de l'utilisateur et reproduire parfaitement sa "voix".

---
*Conçu avec exigence pour les professionnels de la communication.*