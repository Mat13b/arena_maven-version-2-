const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour gérer les CORS
const cors = require("cors");
app.use(cors({
  origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
  optionsSuccessStatus: 200,
}));

// Importez et utilisez le routeur principal
const router = require("./router");
app.use('/api', router);

// Middleware pour servir les fichiers statiques dans `backend/public` et `backend/uploads`
app.use(express.static(path.join(__dirname, "../public")));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware pour servir l'application React (s'il existe)
const reactIndexPath = path.join(__dirname, "../../frontend/dist/index.html");
if (fs.existsSync(reactIndexPath)) {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(reactIndexPath); 
  });
}

// Exportez l'application express
module.exports = app;
