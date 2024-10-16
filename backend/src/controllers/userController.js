const models = require("../models");
const argon2 = require('argon2');

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
    const user = req.body;
    // user.password = await argon2.hash(user.password);

    const result = await models.user.insert(user);
    res.location(`/user/${result.insertId}`).sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
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

module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
  getUserByEmail,
  findIfUserSubController,
};
