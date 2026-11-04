# Sécurité et confidentialité

La tranche publique ne crée aucun compte enfant et ne collecte pas de profil. Aucun profil public, chat, géolocalisation précise, publicité comportementale ni classement. Pas de clés API dans le navigateur. Ne jamais committer `.env`, clés ou dumps personnels.

Avant les comptes : consentement parental adapté aux juridictions, minimisation des données, pseudonymes, autorisation par politique Laravel, contrôle de propriété serveur, validation des entrées et limitation des tentatives, sessions HttpOnly/Secure/SameSite et CSRF. Aucun mode administrateur activé par un paramètre client.

Avant publication commerciale : workflow éditorial validé, sources et licences vérifiées, tests d’accès croisés parent/enfant, export et suppression, ressources privées signées, politique juridique de conservation. Proposition à valider : suppression sous 30 jours, sauvegardes expirant sous 90 jours ; ce ne sont pas des garanties déjà implémentées.

Journaux sans secrets ni contenu enfant, durée limitée. HTTPS en production, debug désactivé, sauvegardes chiffrées et restauration testée. IA future limitée à des ressources vérifiées et soumise à une analyse spécifique aux mineurs.

Offline futur : seulement ressources publiques versionnées, jamais cache automatique de comptes, cookies ou réponses privées.


Espace éditorial : connexion limitée en fréquence, messages d’échec génériques, régénération de session, invalidation à la déconnexion, cookies HttpOnly/SameSite Lax et Secure par défaut avec APP_ENV=production. Les routes HTML exigent des jetons CSRF ; le proxy refuse aussi une origine étrangère. Définir WEB_ORIGIN pour l’origine HTTPS publique derrière un reverse proxy. Réponses privées sans cache et sans indexation, CSP sans script, saisies échappées, références limitées à HTTPS et corps de formulaire limité à 1 Mio.

Les droits, la propriété et l’absence de contribution du validateur sont vérifiés côté serveur, même pour un administrateur. Création des comptes exclusivement par commande interactive, mot de passe masqué, aucun secret livré. Récupération de mot de passe et gestion des comptes par interface restent à construire. Comptes de test uniquement dans kidora_test par un point d’entrée CLI gardé, avec mot de passe aléatoire reçu sur stdin ; les traces navigateur de ce parcours sont désactivées pour ne pas enregistrer des identifiants.
