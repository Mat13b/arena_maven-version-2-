const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fonction de hachage de mot de passe
const hashPassword = async (req, res, next) => {
  try {
    if (!req.body.password) {
      throw new Error('Password is required');
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Fonction de vérification de mot de passe
const verifyPassword = async (req, res, next) => {
  try {
    console.log('Tentative de connexion pour:', req.body.email);
    console.log('Mot de passe fourni:', req.body.password);
    console.log('Utilisateur trouvé:', req.user);

    if (!req.user || !Array.isArray(req.user) || req.user.length === 0 || !req.user[0].password) {
      console.error('Utilisateur ou mot de passe manquant');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = req.user[0]; // Prendre le premier (et seul) utilisateur du tableau
    const isValid = await bcrypt.compare(req.body.password, user.password);
    console.log('Résultat de la comparaison:', isValid);

    if (!isValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    req.user = user; // Mettre à jour req.user avec l'objet utilisateur
    next();
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};

// Middleware de vérification de token
const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header is missing or invalid');
    }

    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.sub; // Ajoute les données du token à l'objet req pour une utilisation ultérieure
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(401).send('Unauthorized');
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken
};
