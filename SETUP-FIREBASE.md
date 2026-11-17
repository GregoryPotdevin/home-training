# Brancher la synchro (Firebase) : ~15 minutes

Sans cette étape, l'app marche quand même : familles, profils, points, défis, boss et badges
fonctionnent **sur un seul appareil** (tout reste dans le navigateur). Firebase sert à partager
tout ça entre les appareils, et à gérer plusieurs familles (la tienne, celle d'amis…).

## 1. Créer le projet (offre gratuite Spark, sans carte bancaire)

1. Va sur https://console.firebase.google.com → **Créer un projet** (ex. `home-trainer-famille`).
   Google Analytics : inutile.
2. **Ne passe jamais au forfait Blaze** et n'ajoute pas de compte de facturation : en Spark, si un
   quota est dépassé, le service s'arrête jusqu'au lendemain, mais **aucune facture n'est possible**.

## 2. Activer la connexion Google

1. **Authentication** → **Commencer** → **Méthode de connexion** → **Google** → Activer.
2. Onglet **Paramètres** → **Domaines autorisés** → ajoute `gregorypotdevin.github.io`.

## 3. Créer la base Firestore et ses règles

1. **Firestore Database** → **Créer une base de données** → emplacement `europe-west9 (Paris)` →
   mode **production**.
2. Onglet **Règles** : colle tout le fichier `firestore.rules` du dépôt → **Publier**.
   Il n'y a plus aucune adresse à recopier dedans : l'accès est réglé famille par famille
   (liste des emails de chaque famille), depuis l'app.

## 4. Te déclarer super-admin (à la main, une seule fois)

C'est ce qui te permet de **créer des familles** depuis l'app.

1. **Firestore Database** → onglet **Données** → **Commencer une collection**.
2. ID de la collection : `admins`.
3. ID du document : **ton adresse Gmail en minuscules** (exactement celle de ton compte Google).
4. Ajoute un champ quelconque, par ex. `role` (chaîne) = `super-admin` → **Enregistrer**.

Tu peux déclarer d'autres super-admins de la même façon. Personne ne peut écrire dans `admins`
depuis l'app : seulement toi, depuis la console.

## 5. Récupérer la config web

1. ⚙️ **Paramètres du projet** → **Vos applications** → icône **Web `</>`** → nom `home-trainer`.
2. Copie l'objet `firebaseConfig` dans `js/config.js`, à la place de `firebase: null`.

Cette config n'est **pas un secret** : elle est faite pour être publique. La protection vient des
règles de l'étape 3.

## 6. (Optionnel) Restreindre la clé

Google Cloud Console → **API et services** → **Identifiants** → « Browser key » →
**Restrictions** → **Sites web** → `https://gregorypotdevin.github.io/*` (et `http://localhost:*`).

## 7. Premier lancement

1. Ouvre l'app → **La famille** → **Se connecter avec Google** (avec le compte déclaré à l'étape 4).
2. **🏠 → Créer une famille** : nom, puis chaque personne avec prénom, email, rôle, avatar,
   mascotte et style. Choisis **« Reprendre les profils et l'historique de cet appareil »** pour ta
   propre famille : tes séances déjà faites sont copiées dedans.
3. Pour une famille d'amis : même chose, en mettant **leur** email comme manager. Ils se connectent
   avec leur compte Google et retrouvent leur famille ; un manager peut ensuite ajouter ou modifier
   les membres lui-même.
4. Sur les appareils des enfants sans compte Google : connecte-toi une fois avec un compte de la
   famille, puis chacun choisit son profil dans « Qui pédale ? ».

## Rôles

| Rôle | Peut… |
|------|-------|
| 👑 Manager | modifier la famille et ses membres, accorder le temps d'écran |
| 🧑 Adulte | accorder le temps d'écran |
| 🧒 Enfant | gagner du temps d'écran avec ses points |
| Super-admin (`admins/{email}`) | créer des familles, voir et modifier toutes les familles |

## Ce qui est stocké

| Chemin | Contenu |
|--------|---------|
| `admins/{email}` | super-admins (créés à la main) |
| `families/{id}` | nom, `emails` (tous les comptes autorisés), `managers` |
| `families/{id}/members` | prénom, email, rôle, avatar, mascotte, style, règle de temps d'écran |
| `families/{id}/sessions` | séances : qui, quand, durée, kcal, points, watts moyens par minute… |
| `families/{id}/boosts` | boosts ×2 (gagnés, offerts, actifs, utilisés ; aussi ceux gagnés contre un boss) |
| `families/{id}/challenges` | défis « tous contre un » et revanches |
| `families/{id}/grants` | minutes de temps d'écran accordées |

Les badges, les séries et le boss de la semaine sont **calculés** à partir des séances : rien de
plus à stocker.
