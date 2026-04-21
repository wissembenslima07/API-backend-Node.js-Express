# Summary
- 2026-04-21: Initialisation du fichier de mémoire de travail pour ce dépôt.
- Contexte en cours: intégration de Google OAuth (backend Node/Express + frontend Angular) avec secrets fournis ultérieurement par l'utilisateur.
- Implémenté: routes backend Google OAuth (/api/auth/google, /api/auth/google/callback) avec Passport, création/liaison utilisateur Google, génération JWT interne, et redirection frontend via fragment OAuth.
- Implémenté: callback Angular /oauth/callback pour finaliser la session locale (token + user) et rediriger vers dashboard.
- Validation: build Angular OK. Tests backend existants passent, mais la commande racine npm test échoue sur un test Angular (app.spec.ts) inclus par la config Jest racine.
