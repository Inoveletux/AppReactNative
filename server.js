const express = require('express');
const app = express();
const config = require('./app/config');
const databaseInfos = require('./app/databaseInfos');
// const path = require('path');
const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.connect(
    `mongodb+srv://userdb:${databaseInfos.password}@cluster0.g8puv.mongodb.net/AppCoachSportif`, 
    {connectTimeoutMS : 3001, socketTimeoutMS: 20000, useNewUrlParser: true, useUnifiedTopology: true }
);
db.once('open', () => {
    console.log(`connexion OK !`);
});

app.get('/', (req, res)=>{
    
})

app.listen(config.port,() => {
    console.log(`Le serveur est démarré : http://localhost:${config.port}`);
    if (process.send) {
        process.send('online');
    }
});

