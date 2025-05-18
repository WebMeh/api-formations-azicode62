const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const app = express();
const port = 9000;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))

// Chargement des formations depuis un fichier local (simulation de base de données)
let { formations } = require('./data/formations');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public' ,'formations.html'))
})

/**
 * Ajouter une nouvelle formation
 * Méthode : POST
 * URL : /formations
 */
app.post('/formations', (req, res) => {
  const { titre, description, image, duree } = req.body;

  // Vérification que tous les champs sont présents
  if (!titre || !description || !image || !duree ) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  // Création de la formation
  const formation = {
    id: formations.length+1   ,
    titre,
    description,
    image,
    duree
  };

  // Ajout dans le tableau
  formations.push(formation);

  // Réponse avec la formation créée
  res.status(201).json(formation);
});

/**
 * Obtenir toutes les formations
 * Méthode : GET
 * URL : /formations
 */
app.get('/formations', (req, res) => {
  res.json(formations);
});

/**
 * Obtenir une seule formation par son ID
 * Méthode : GET
 * URL : /formations/:id
 */
app.get('/formations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const formation = formations.find(f => f.id === id);

  // Si la formation n'existe pas
  if (!formation) {
    return res.status(404).json({ error: 'Formation non trouvée.' });
  }

  res.json(formation);
});

/**
 * Modifier une formation existante
 * Méthode : PUT
 * URL : /formations/:id
 */
app.put('/formations/:id', (req, res) => {
  // Prendre body
  const id = req.params.id
  const { titre, description, image, duree } = req.body;



  // chercher la formation
  const formation = formations.find(f => f.id == id)

  if (!formation){
    return res.status(404).json({message: 'Formation non trouvéée'})
  }

  // Mise à jour des champs si fournis
 
  if (titre) formation.titre = titre;
  if (description) formation.description = description;
  if (image) formation.image = image;
  if (duree) formation.duree = duree;


  res.json(formations)
})

/**
 * Supprimer une formation par ID
 * Méthode : DELETE
 * URL : /formations/:id
 */
app.delete('/formations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = formations.findIndex(f => f.id === id);

  // Vérification de l'existence
  if (index === -1) {
    return res.status(404).json({ error: 'Formation non trouvée.' });
  }

  // Suppression avec splice
  formations.splice(index, 1);
  res.json({ message: 'Formation supprimée.'});
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
