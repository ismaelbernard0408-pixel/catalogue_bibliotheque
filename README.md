# Catalogue de bibliothèque — LOG3550 Devoir 1

**Étudiant(e) :** Prénom Nom  
**Dépôt Git :** https://github.com/VOTRE-COMPTE/VOTRE-DEPOT  ← *à remplacer*

## Description

Frontend d'un catalogue de bibliothèque en HTML, CSS et JavaScript pur (sans framework ni bibliothèque). On peut consulter 10 livres de départ, les rechercher, les filtrer, les trier, en ajouter et en supprimer. Les données sont conservées dans le `localStorage` du navigateur. Ce frontend sera relié à une API FastAPI dans le devoir 2.

## Mode d'emploi

1. Ouvrir `index.html` dans un navigateur récent (aucun serveur nécessaire).
2. **Rechercher** : taper dans la zone de recherche (titre ou auteur, sans tenir compte de la casse ni des accents).
3. **Filtrer** : choisir une catégorie et/ou cocher « Disponibles seulement » ; les critères se cumulent. « Effacer les filtres » (désactivé tant qu'aucun filtre n'est actif) les remet à zéro.
4. **Trier** : par titre ou par année, croissant ou décroissant.
5. **Ajouter** : remplir le formulaire de la section « Ajouter un livre » ; les erreurs s'affichent sous chaque champ.
6. **Emprunter / Rendre** : bouton sur chaque carte, qui change l'étiquette Disponible / Emprunté.
7. **Supprimer** : bouton sur chaque carte, avec confirmation.
8. **Réinitialiser les données** : remet les 10 livres de départ.

## Structure

```
devoir1/
  index.html
  css/styles.css
  js/data.js      (10 livres de départ)
  js/app.js       (affichage, recherche, ajout, suppression, validation, localStorage)
  captures/       (validation W3C et trois tailles d'écran)
  README.md
```

## Choix de conception

- **HTML sémantique** : `header`, `nav`, `main`, deux `section`, `footer`, un seul `h1`, lien d'évitement au clavier, `<template>` pour les cartes.
- **CSS mobile d'abord** : variables `:root` pour couleurs et espacements ; grille à 1 colonne par défaut, 2 colonnes dès 40 em (tablette), 3 dès 64 em (ordinateur), 4 dès 90 em.
- **Accessibilité** : `label` associé à chaque champ, `:focus-visible` marqué, erreurs reliées aux champs par `aria-describedby` et annoncées par `aria-live`, résultats et statuts annoncés aux lecteurs d'écran, `aria-label` explicites sur les boutons des cartes.
- **JavaScript** : une seule variable d'état pour les livres et un objet `filtres` ; une fonction `afficher()` reconstruit la liste à chaque changement. Les cartes sont créées avec le DOM (`cloneNode` sur un `<template>` + `textContent`, ce qui évite d'injecter du HTML). Un seul écouteur (délégation d'événements) gère les boutons de toutes les cartes.
- **Données** : `LIVRES_INITIAUX` n'est jamais modifié ; l'application travaille sur une copie, ce qui permet la réinitialisation.

## Difficultés rencontrées

*(À compléter avec vos propres mots : ce qui a été difficile pour vous, comment vous l'avez résolu.)*

## Captures d'écran

1. `captures/1-validation-w3c.png` — validateur W3C, aucune erreur
2. `captures/2-ecran-large.png`
3. `captures/3-tablette.png`
4. `captures/4-telephone.png`

## Question 1 — Pourquoi préférer les balises sémantiques à une suite de `div` ?

Les balises comme `header`, `nav`, `main` ou `section` disent ce qu'est chaque bloc, alors qu'un `div` ne dit rien.
**Accessibilité** : les lecteurs d'écran utilisent ces balises pour annoncer les zones et permettre de sauter directement au contenu principal ou à la navigation.
**Référencement** : les moteurs de recherche comprennent mieux la structure et l'importance du contenu.
**Maintenance** : le code se lit plus facilement et on retrouve vite chaque partie de la page.
De plus, le navigateur offre gratuitement certains comportements (clavier, titres hiérarchisés) qu'il faudrait réécrire avec des `div`.

## Question 2 — Différence entre `map`, `filter` et `forEach`

`forEach` parcourt un tableau pour exécuter une action sur chaque élément, mais ne retourne rien.
`map` retourne un nouveau tableau de même taille, où chaque élément est transformé.
`filter` retourne un nouveau tableau qui ne garde que les éléments pour lesquels la fonction renvoie vrai.
Pour la recherche et les filtres, j'utilise **`filter`** (`livres.filter(livreCorrespond)`), puis **`map`** pour transformer chaque livre en carte (`visibles.map(creerCarte)`).
J'utilise aussi `forEach` pour afficher ou effacer les erreurs de chaque champ du formulaire, une simple action sans valeur de retour.

## Sources et outils d'assistance utilisés

- **Assistant IA : Claude (Anthropic)** a été utilisé pour générer une première version du code et du README. J'ai relu, testé et compris le code, et je peux l'expliquer ligne par ligne. *(Ajustez cette phrase selon ce que vous avez réellement fait.)*
- Polices : Lora et Source Sans 3 (Google Fonts, police en ligne autorisée).
- Documentation : MDN Web Docs (`localStorage`, `<template>`, `String.prototype.normalize`, ARIA live regions).
- Aucune image n'est utilisée ; aucune bibliothèque externe.
- Livres d'exemple : titres réels, seulement à titre de données de démonstration.
