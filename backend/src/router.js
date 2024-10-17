const express = require('express');
const router = express.Router();
const { hashPassword, verifyPassword, verifyToken } = require('./auth'); // Import des fonctions d'authentification

const userController = require("./controllers/userController");
const matchResultsController = require('./controllers/matchResultsController');
const tournament_matchController = require("./controllers/tournament_matchController");
const tournamentParticipationController = require("./controllers/tournamentParticipationController");
const tournamentControllers = require("./controllers/tournamentControllers");
const guildController = require("./controllers/guildController");
const commentControllers = require("./controllers/commentControllers");
const { commentValidationRules } = require('./validators/commentValidator');
const { tournamentValidationRules } = require('./validators/tournamentValidator')

// Middleware de gestion des fichiers téléchargés avec multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier de destination pour les fichiers uploadés
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// Middleware pour vérifier le token JWT avant d'accéder à la route contact
router.post("/contact", verifyToken, (req, res) => {
  console.log("Accessing protected route: /contact");
  res.send("Route contact accessible uniquement avec un token valide.");
});

// Route pour l'inscription des utilisateurs
router.post('/user/register', userController.add);

// Route pour la connexion des utilisateurs
router.post('/user/login', userController.getUserByEmail, verifyPassword, userController.login);

// Routes pour les tournois
router.get("/tournament", tournamentControllers.browse);
router.get("/tournament/:id", tournamentControllers.read);
router.put("/tournament/:id", tournamentControllers.edit);
router.post('/tournament', upload.single('timage'), tournamentControllers.add);
router.delete("/tournament/:id", tournamentControllers.destroy);

// Routes pour les résultats de match
router.get("/matchResults", matchResultsController.browse);
router.get("/matchResults/:id", matchResultsController.read);
router.put("/matchResults/:id", matchResultsController.edit);
router.post("/matchResults", matchResultsController.add);
router.delete("/matchResults/:id", matchResultsController.destroy);

// Route pour la déconnexion des utilisateurs
router.delete('/user/logout', userController.destroy);

// Routes pour la gestion des utilisateurs
router.get("/user", userController.browse);
router.get("/user/:id", userController.read);
router.post("/user/:id", userController.add);
router.put("/user/:id", userController.edit);
router.delete("/user/:id", userController.destroy);

// Routes pour les matchs de tournois
router.get("/tournament_matches", tournament_matchController.browse);
router.get("/tournament_matches/:id", tournament_matchController.read);
router.post("/tournament_matches", tournament_matchController.add);
router.put("/tournament_matches/:id", tournament_matchController.edit);
router.delete("/tournament_matches/:id", tournament_matchController.destroy);

// Routes pour la participation aux tournois
router.get("/tournament-participation", tournamentParticipationController.browse);
router.get("/tournament-participation/:id", tournamentParticipationController.read);
router.put("/tournament-participation/:id", tournamentParticipationController.edit);
router.post("/tournament-participation", tournamentParticipationController.add);
router.delete("/tournament-participation/:id", tournamentParticipationController.destroy);

// Routes pour les tournois - Non protégée
// router.get("/tournament", verifyToken, tournamentControllers.browse);
router.get("/tournament", tournamentControllers.browse); 
router.get("/tournament/:id", tournamentControllers.read);
router.put("/tournament/:id", tournamentControllers.edit);
router.post('/tournament', upload.single('timage'), tournamentValidationRules(), tournamentControllers.add);
router.delete("/tournament/:id", tournamentControllers.destroy);

// Routes pour les commentaires
router.get("/comments", commentControllers.browse);
router.get("/comments/:id", commentControllers.read);
router.get("/comments/by-tournament/:id", commentControllers.findByTournament);
router.post("/comments",commentValidationRules(),commentControllers.add);
router.put("/comments/:id",commentValidationRules(),commentControllers.edit);
router.delete("/comments/:id", commentControllers.destroy);

// Routes pour obtenir les tournois dans lesquels s'est inscrit un user par son id
router.get("/user/registered-tournaments/:id", tournamentControllers.findTbyUid);

// Routes pour obtenir les tournois créé par un user par son id
router.get("/user/created-tournaments/:id", verifyToken, tournamentControllers.findTbyOid);

// Route pour obtenir la participation par ID de tournoi
router.get("/participation/tournament/:id", tournamentControllers.getPbyTid);

// Routes pour les guildes
router.get("/guild", guildController.browse);
router.get("/guild/:id", guildController.read);
router.post("/guild", upload.single('image'), guildController.add); // Route pour ajouter une guilde avec image
router.put("/guild/:id", upload.single('image'), guildController.edit); // Route pour modifier une guilde avec image
router.delete("/guild/:id", guildController.destroy); // Route pour supprimer une guilde
router.post("/guild/:id/join", guildController.join); // Route pour rejoindre une guilde
router.post("/guild/:id/leave", guildController.leave); // Route pour quitter une guilde

// Route pour vérifier si un utilisateur est inscrit à un tournoi
router.get("/tournament/:tournament_id/user/:user_id", userController.findIfUserSubController);

module.exports = router;
