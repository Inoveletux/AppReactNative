const express = require('express');
const app = express();
const config = require('./app/config');
const databaseInfos = require('./app/databaseInfos');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const db = mongoose.connection;
// const path = require('path');
const ObejctId = mongoose.Types.ObejctId;
const MainProgram = require('./models/MainProgram')
const ProgramInside = require("./models/ProgramInside");
const User = require('./models/User');
const ObjectId = mongoose.Types.ObjectId;
//dependances pour l'auth
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const multer = require("multer");
// const fs = require('fs');
const { default: validator } = require('validator');

const jwtConfig = {
    secret: config.secretKey,
    expiresIn: "2 days", 
};

const storage = multer.diskStorage({ // instance multer diskStorage
    destination: function(req, file, cb){
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

const tokenChecker = require("./services/tokenChecker");
app.use(tokenChecker);

const upload = multer({
        storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50 //50mB max
    }
})

app.use(express.json());
app.use(
    express.urlencoded
    ({ extended: true })
);


mongoose.connect(
    `mongodb+srv://userdb:${databaseInfos.password}@cluster0.g8puv.mongodb.net/AppCoachSportif`, 
    {connectTimeoutMS : 3001, socketTimeoutMS: 20000, useNewUrlParser: true, useUnifiedTopology: true }
);
db.once('open', () => {
    console.log(`connexion OK !`);
});

app.get('/api/programs/list', (req, res)=>{
    MainProgram.find().then((data)=> {
        setTimeout(() => { // Pour voir le chargement sur l'app
            res.json(data);
        }, 2000);
    });
});

app.get("/api/programs-content/list", (req, res) => {
    let { parentId } = req.query;
    ProgramInside
        .find({ program: ObjectId(parentId)})
        .sort({order: 1})
        .then((data) => {
            console.log("data ici", data)
            res.json(data);
        });
});

app.get("/api/user/check", (req, res) => {
    const { data } = req; //data.user
    const { user } = data;
    res.json({
        user: user,
    });
});

app.post("/api/user/login", (req, res) => { 
    console.log(req.body.params)
    const user = req.body.params.user; 
    const { username, password } = user;

    try {
        User.findOne({username : username }).then((user) => {
            let errors = {
                username: user ? null : "Vérifier votre email",
                password: user ? null : "Vérifier votre mot de passe",
            };
            if (user !== null){
                bcrypt.compare(password, user.password).then((isMatch) =>{
                    if (isMatch){
                        errors.password = null;
                        if (!errors.username && !errors.password){
                            delete user["password"];

                            const access_token = jwt.sign(
                                { id: user.uuid },
                                jwtConfig.secret,
                                {
                                    expiresIn: jwtConfig.expiresIn
                                }
                            )
                            const d = {
                                user : user, 
                                access_token: access_token,
                            }
                            res.json({ data: d, errors: errors })
                        }
                    } else{
                        errors = {
                            password: "Vérifiez votre mot de passe"
                        };
                        res.json({errors: errors})
                    }
                });
            } else {
                res.json({ errors: errors });
            }
        });
    }catch(error){
        console.log(error)
    }
})


function S4() {
  return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
}

function generateGUID(){
    return S4() + S4();
}

app.post("/api/user/register", (req, res) => {
    const user = req.body.params.user;

    const { username, password, password_confirmation } = user;
    User.findOne({ username: username }).then((user) => {
    //findOne et find?
    const errors = {
        username: null,
        password: !password ? "Vérifiez votre mot de passe" : null,
        password_confirmation:
            password_confirmation !== password
                ? "Les deux champs ne correspondent pas"
                : null,
    };

    // console.log("username", username, "validator", validator.isEmail(username.trim()))
    if (user) {
        errors.username = "Cet utilisateur existe déjà"
    } else {
        if (validator.isEmpty(username)) {
            errors.username= "Vous devez indiquez un email valide"
        }else if (!validator.isEmail(username.trim())){
            errors.username = "Ceci n'est pas un mail valide";
        }else{
            errors.username = null;
        }
    }
        if (!errors.username && !errors.password && !errors.password_confirmation){
        let newUser = new User({
            uuid: generateGUID(),
            username: username,
            password: password,
            programsList: [],
            avatar: "",
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err){
                    // fs.appendFile('saltdebug.log', JSON.stringify(err));
                    throw err;
                } 

                newUser.password = hash;
                newUser
                    .save()
                    .then((user) => {
                        delete user["password"]

                        const access_token = jwt.sign(
                            {
                                id: user.uuid
                            }, 
                            jwtConfig.secret, 
                            {
                                expiresIn: jwtConfig.expiresIn
                            }
                        );
                        
                        const d = {
                            user:user, //sans le password
                            access_token: access_token
                        };
                        res.json(d)
                    })
            })
        });
    } else{
        res.send({ errors:errors })
    }
    
    })
});

app.post(
    "/api/user/avatar/edit", 
    upload.single("image"), 
    (req, res) => {
     const d = req.data; // req.data.user
    User.findOneAndUpdate()
    // notre image a été téléchargée
    //c'est ici qu'on va mettre à jour notre utilisateur
    //retour : notre nouvel utilisateur qui comprend user.avatar avec le nouveau nom.
});

app.listen(config.port,() => {
    console.log(`Le serveur est démarré : http://localhost:${config.port}`);
    if (process.send) {
        process.send('online');
    }
});
