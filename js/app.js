/*
 * Catalogue de bibliothèque — logique de l'application.
 * Dépend de LIVRES_INITIAUX (js/data.js).
 */
(function () {
  'use strict';

  const CLE_STOCKAGE = 'isteah-log3550-catalogue';
  const ANNEE_MIN = 1450;
  const ANNEE_COURANTE = new Date().getFullYear();
  const NOMS_CATEGORIES = {
    roman: 'Roman',
    science: 'Science',
    histoire: 'Histoire',
    informatique: 'Informatique',
    autre: 'Autre'
  };

  /* ---------- État ---------- */
  let livres = chargerLivres();
  const filtres = { recherche: '', categorie: 'toutes', disponiblesSeulement: false, tri: 'titre-asc' };

  /* ---------- Références DOM ---------- */
  const el = {
    recherche: document.getElementById('recherche'),
    categorie: document.getElementById('filtre-categorie'),
    tri: document.getElementById('tri'),
    disponibles: document.getElementById('filtre-disponibles'),
    btnEffacer: document.getElementById('btn-effacer-filtres'),
    btnReinit: document.getElementById('btn-reinitialiser'),
    compteur: document.getElementById('compteur'),
    messageVide: document.getElementById('message-vide'),
    liste: document.getElementById('liste-livres'),
    modele: document.getElementById('modele-carte'),
    formulaire: document.getElementById('formulaire-ajout'),
    statut: document.getElementById('statut'),
    champs: {
      titre: document.getElementById('titre'),
      auteur: document.getElementById('auteur'),
      annee: document.getElementById('annee'),
      categorie: document.getElementById('categorie'),
      disponible: document.getElementById('disponible')
    }
  };

  /* ---------- Persistance (localStorage) ---------- */

  /** Copie profonde des données de départ, pour ne jamais modifier l'original. */
  function copierLivresInitiaux() {
    return LIVRES_INITIAUX.map(function (livre) { return Object.assign({}, livre); });
  }

  /** Lit la liste sauvegardée ; retombe sur les données de départ si absente ou invalide. */
  function chargerLivres() {
    try {
      const brut = localStorage.getItem(CLE_STOCKAGE);
      if (brut) {
        const donnees = JSON.parse(brut);
        if (Array.isArray(donnees)) return donnees;
      }
    } catch (erreur) {
      console.warn('Lecture du localStorage impossible :', erreur);
    }
    return copierLivresInitiaux();
  }

  function sauvegarderLivres() {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(livres));
    } catch (erreur) {
      console.warn('Sauvegarde dans le localStorage impossible :', erreur);
    }
  }

  /* ---------- Recherche, filtre, tri ---------- */

  /** Minuscules et sans accents : « Énigme » et « enigme » deviennent identiques. */
  function normaliser(texte) {
    return texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function livreCorrespond(livre) {
    const terme = normaliser(filtres.recherche);
    const correspondRecherche = terme === '' ||
      normaliser(livre.titre).includes(terme) ||
      normaliser(livre.auteur).includes(terme);
    const correspondCategorie = filtres.categorie === 'toutes' || livre.categorie === filtres.categorie;
    const correspondDispo = !filtres.disponiblesSeulement || livre.disponible;
    return correspondRecherche && correspondCategorie && correspondDispo;
  }

  function trierLivres(liste) {
    const [critere, sens] = filtres.tri.split('-');
    const facteur = sens === 'asc' ? 1 : -1;
    return liste.sort(function (a, b) {
      if (critere === 'annee') return (a.annee - b.annee) * facteur;
      return a.titre.localeCompare(b.titre, 'fr', { sensitivity: 'base' }) * facteur;
    });
  }

  /** Livres visibles : filtre (nouveau tableau) puis tri de ce nouveau tableau. */
  function obtenirLivresVisibles() {
    return trierLivres(livres.filter(livreCorrespond));
  }

  function filtresActifs() {
    return filtres.recherche !== '' || filtres.categorie !== 'toutes' || filtres.disponiblesSeulement;
  }

  /* ---------- Affichage ---------- */

  /** Construit une carte à partir du <template> pour un livre donné. */
  function creerCarte(livre) {
    const carte = el.modele.content.firstElementChild.cloneNode(true);
    carte.dataset.id = livre.id;
    carte.querySelector('.carte__categorie').textContent = NOMS_CATEGORIES[livre.categorie] || 'Autre';
    carte.querySelector('.carte__titre').textContent = livre.titre;
    carte.querySelector('.carte__auteur').textContent = livre.auteur;
    carte.querySelector('.carte__annee').textContent = 'Publié en ' + livre.annee;

    const etiquette = carte.querySelector('.etiquette');
    etiquette.textContent = livre.disponible ? 'Disponible' : 'Emprunté';
    etiquette.classList.add(livre.disponible ? 'etiquette--disponible' : 'etiquette--emprunte');

    const btnEmprunt = carte.querySelector('[data-action="emprunter"]');
    btnEmprunt.textContent = livre.disponible ? 'Emprunter' : 'Rendre';
    btnEmprunt.setAttribute('aria-label', btnEmprunt.textContent + ' : ' + livre.titre);
    carte.querySelector('[data-action="supprimer"]')
      .setAttribute('aria-label', 'Supprimer : ' + livre.titre);
    return carte;
  }

  function mettreAJourCompteur(nbVisibles) {
    const accord = nbVisibles > 1 ? 's' : '';
    el.compteur.textContent = nbVisibles + ' livre' + accord + ' affiché' + accord +
      ' sur ' + livres.length;
    el.messageVide.hidden = nbVisibles !== 0;
  }

  function afficher() {
    const visibles = obtenirLivresVisibles();
    el.liste.replaceChildren(...visibles.map(creerCarte));
    mettreAJourCompteur(visibles.length);
    el.btnEffacer.disabled = !filtresActifs();
  }

  function annoncer(message) {
    el.statut.textContent = message;
  }

  /* ---------- Actions sur les livres ---------- */

  function prochainId() {
    return livres.reduce(function (max, livre) { return Math.max(max, livre.id); }, 0) + 1;
  }

  function ajouterLivre(donnees) {
    livres.push(Object.assign({ id: prochainId() }, donnees));
    sauvegarderLivres();
    afficher();
  }

  function supprimerLivre(id) {
    const livre = livres.find(function (l) { return l.id === id; });
    if (!livre) return;
    if (!window.confirm('Supprimer « ' + livre.titre + ' » du catalogue ?')) return;
    livres = livres.filter(function (l) { return l.id !== id; });
    sauvegarderLivres();
    afficher();
    annoncer('« ' + livre.titre + ' » a été supprimé.');
  }

  function basculerEmprunt(id) {
    const livre = livres.find(function (l) { return l.id === id; });
    if (!livre) return;
    livre.disponible = !livre.disponible;
    sauvegarderLivres();
    afficher();
  }

  function reinitialiserDonnees() {
    if (!window.confirm('Remettre les données de départ ? Vos ajouts et suppressions seront perdus.')) return;
    livres = copierLivresInitiaux();
    sauvegarderLivres();
    effacerFiltres();
    annoncer('Les données de départ ont été restaurées.');
  }

  function effacerFiltres() {
    filtres.recherche = '';
    filtres.categorie = 'toutes';
    filtres.disponiblesSeulement = false;
    el.recherche.value = '';
    el.categorie.value = 'toutes';
    el.disponibles.checked = false;
    afficher();
  }

  /* ---------- Validation du formulaire ---------- */

  /** Retourne un objet { champ: message } ; vide si tout est valide. */
  function validerFormulaire() {
    const erreurs = {};
    const titre = el.champs.titre.value.trim();
    const auteur = el.champs.auteur.value.trim();
    const annee = Number(el.champs.annee.value);

    if (titre.length < 2) erreurs.titre = 'Le titre est obligatoire (au moins 2 caractères).';
    if (auteur.length < 2) erreurs.auteur = 'L’auteur est obligatoire (au moins 2 caractères).';

    if (el.champs.annee.value === '' || !Number.isInteger(annee) ||
        annee < ANNEE_MIN || annee > ANNEE_COURANTE) {
      erreurs.annee = 'Saisissez une année entière entre ' + ANNEE_MIN + ' et ' + ANNEE_COURANTE + '.';
    }
    if (!NOMS_CATEGORIES[el.champs.categorie.value]) erreurs.categorie = 'Choisissez une catégorie.';
    return erreurs;
  }

  /** Affiche (ou efface) le message d'erreur sous chaque champ. */
  function afficherErreurs(erreurs) {
    ['titre', 'auteur', 'annee', 'categorie'].forEach(function (nom) {
      const message = erreurs[nom] || '';
      document.getElementById('erreur-' + nom).textContent = message;
      if (message) {
        el.champs[nom].setAttribute('aria-invalid', 'true');
      } else {
        el.champs[nom].removeAttribute('aria-invalid');
      }
    });
  }

  function traiterSoumission(evenement) {
    evenement.preventDefault();
    annoncer('');
    const erreurs = validerFormulaire();
    afficherErreurs(erreurs);

    const premierChampInvalide = Object.keys(erreurs)[0];
    if (premierChampInvalide) {
      el.champs[premierChampInvalide].focus();
      return;
    }

    const livre = {
      titre: el.champs.titre.value.trim(),
      auteur: el.champs.auteur.value.trim(),
      annee: Number(el.champs.annee.value),
      categorie: el.champs.categorie.value,
      disponible: el.champs.disponible.checked
    };
    ajouterLivre(livre);
    el.formulaire.reset();
    annoncer('« ' + livre.titre + ' » a été ajouté au catalogue.');
    el.champs.titre.focus();
  }

  /* ---------- Initialisation ---------- */

  function brancherEvenements() {
    el.recherche.addEventListener('input', function () {
      filtres.recherche = el.recherche.value;
      afficher();
    });
    el.categorie.addEventListener('change', function () {
      filtres.categorie = el.categorie.value;
      afficher();
    });
    el.disponibles.addEventListener('change', function () {
      filtres.disponiblesSeulement = el.disponibles.checked;
      afficher();
    });
    el.tri.addEventListener('change', function () {
      filtres.tri = el.tri.value;
      afficher();
    });
    el.btnEffacer.addEventListener('click', effacerFiltres);
    el.btnReinit.addEventListener('click', reinitialiserDonnees);
    el.formulaire.addEventListener('submit', traiterSoumission);

    // Délégation : un seul écouteur pour tous les boutons des cartes
    el.liste.addEventListener('click', function (evenement) {
      const bouton = evenement.target.closest('button[data-action]');
      if (!bouton) return;
      const id = Number(bouton.closest('.carte').dataset.id);
      if (bouton.dataset.action === 'supprimer') supprimerLivre(id);
      if (bouton.dataset.action === 'emprunter') basculerEmprunt(id);
    });

    // Empêche l'envoi de la zone de recherche avec la touche Entrée
    document.querySelector('.filtres').addEventListener('submit', function (e) { e.preventDefault(); });
  }

  el.champs.annee.max = ANNEE_COURANTE;
  brancherEvenements();
  afficher();
})();
