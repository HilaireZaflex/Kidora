# Sécurité et confidentialité

La tranche publique ne crée aucun compte enfant et ne collecte pas de profil. Aucun profil public, chat, géolocalisation précise, publicité comportementale ni classement. Pas de clés API dans le navigateur. Ne jamais committer `.env`, clés ou dumps personnels.

Avant les comptes : consentement parental adapté aux juridictions, minimisation des données, pseudonymes, autorisation par politique Laravel, contrôle de propriété serveur, validation des entrées et limitation des tentatives, sessions HttpOnly/Secure/SameSite et CSRF. Aucun mode administrateur activé par un paramètre client.

Avant publication commerciale : workflow éditorial validé, sources et licences vérifiées, tests d’accès croisés parent/enfant, export et suppression, ressources privées signées, politique juridique de conservation. Proposition à valider : suppression sous 30 jours, sauvegardes expirant sous 90 jours ; ce ne sont pas des garanties déjà implémentées.

Journaux sans secrets ni contenu enfant, durée limitée. HTTPS en production, debug désactivé, sauvegardes chiffrées et restauration testée. IA future limitée à des ressources vérifiées et soumise à une analyse spécifique aux mineurs.

Offline futur : seulement ressources publiques versionnées, jamais cache automatique de comptes, cookies ou réponses privées.
