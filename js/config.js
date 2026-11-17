// Configuration de l'app Home Trainer (version famille).
// Ce fichier est public (GitHub Pages) : il ne contient AUCUN secret.
// La config Firebase ci-dessous est publique par conception : la sécurité vient
// des règles Firestore (firestore.rules), qui n'autorisent que les comptes de la famille.
window.HT_CONFIG = {
  // ⬇️ À remplir ce soir (Console Firebase → Paramètres du projet → Vos applications → Config).
  // Laisser à null = l'app marche en local uniquement, sans synchro.
  firebase: {
    apiKey: "AIzaSyCBnrgL2qDOb11Rjm8PeKtNC97u7fVxNp0",
    authDomain: "family-home-trainer.firebaseapp.com",
    projectId: "family-home-trainer",
    storageBucket: "family-home-trainer.firebasestorage.app",
    messagingSenderId: "914105153502",
    appId: "1:914105153502:web:dda9c7d8fd175e49838f4f"
  },
  /* Exemple :
  firebase: {
    apiKey: "AIza...",
    authDomain: "home-trainer-famille.firebaseapp.com",
    projectId: "home-trainer-famille",
    appId: "1:1234567890:web:abcdef"
  },
  */
  firebaseVersion: '13.2.0',

  // Règles du jeu (modifiables)
  points: { perKcal: 1 },                                   // 1 point = 1 kcal
  boost:  { everyPoints: 500, mult: 2, minutes: 15, allowSelf: false },
  screen: { minPer100: 20, dailyCapMin: 60 },               // valeurs par défaut pour les enfants
  goal:   { km: 775, label: 'Paris → Marseille', emoji: '🚲' }, // objectif commun du mois
  streak: { minMinutes: 10, bonusFrom: 3, bonus: 0.10 },   // série : +10 % de points dès 3 jours d'affilée
  boss:   { pointsPerMember: 600 }                          // PV du boss de la semaine = 600 × nombre de membres
};
