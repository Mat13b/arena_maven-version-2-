const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require("../models");

const browse = (req, res) => {
  models.user
    .findAll()
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = (req, res) => {
  models.user
    .find(req.params.id)
    .then((rows) => {
      if (rows.length === 0) {
        res.sendStatus(404);
      } else {
        res.send(rows[0]);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const edit = (req, res) => {
  const user = req.body;
  user.id = parseInt(req.params.id, 10);

  models.user
    .update(user)
    .then((result) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const add = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      username,
      email,
      password: hashedPassword,
      profil_picture: req.body.profil_picture || null,
      role: req.body.role || 'user'
    };

    const result = await models.user.insert(user);
    res.status(201).json({ id: result.insertId, message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
  }
};

const findIfUserSubController= (req, res) => {
  const { tournament_id, user_id } = req.params;
  models.user
    .findIfUserSub(tournament_id, user_id)
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const getUserByEmail = (req, res, next) => {
  const { email } = req.body;
  models.user.findUserByEmail(email)
    .then((rows) => {
      if (rows.length > 0) {
        req.user = rows[0];
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const destroy = (req, res) => {
  models.user
    .delete(req.params.id)
    .then((result) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const login = async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user; // L'utilisateur a déjà été trouvé par getUserByEmail

    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

module.exports = {
  browse,
  read,
  edit,
  add,
  findIfUserSubController,
  getUserByEmail,
  destroy,
  login
};
