/*
 * Données de départ du catalogue (10 livres).
 * Ce tableau n'est jamais modifié : app.js en travaille une copie,
 * ce qui permet au bouton « Réinitialiser » de repartir de cet état.
 */
const LIVRES_INITIAUX = [
  { id: 1,  titre: "Gouverneurs de la rosée",        auteur: "Jacques Roumain",        annee: 1944, categorie: "roman",        disponible: true  },
  { id: 2,  titre: "Compère Général Soleil",         auteur: "Jacques Stephen Alexis", annee: 1955, categorie: "roman",        disponible: false },
  { id: 3,  titre: "Dézafi",                         auteur: "Frankétienne",           annee: 1975, categorie: "roman",        disponible: true  },
  { id: 4,  titre: "Cosmos",                         auteur: "Carl Sagan",             annee: 1980, categorie: "science",      disponible: true  },
  { id: 5,  titre: "Une brève histoire du temps",    auteur: "Stephen Hawking",        annee: 1988, categorie: "science",      disponible: false },
  { id: 6,  titre: "Les Jacobins noirs",             auteur: "C. L. R. James",         annee: 1938, categorie: "histoire",     disponible: true  },
  { id: 7,  titre: "Sapiens : une brève histoire de l'humanité", auteur: "Yuval Noah Harari", annee: 2011, categorie: "histoire", disponible: true },
  { id: 8,  titre: "Clean Code",                     auteur: "Robert C. Martin",       annee: 2008, categorie: "informatique", disponible: true  },
  { id: 9,  titre: "Le langage C",                   auteur: "Brian Kernighan et Dennis Ritchie", annee: 1978, categorie: "informatique", disponible: false },
  { id: 10, titre: "L'Énigme du retour",             auteur: "Dany Laferrière",        annee: 2009, categorie: "autre",        disponible: true  }
];
