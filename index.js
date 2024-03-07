const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const env = require('dotenv').config();
const sequelize = require('sequelize');
const db = require('./models');
const { Message, User, Map } = require('./models');
const passport = require('passport');
const auth = require('./auth/routes');
const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}));

app.use(session({
    name: 'session',
    secret: 'passwd',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, maxAge: 24 * 60 * 60 * 100
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', auth);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {

    res.send({
        message: 'Bienvenue sur mon API REST NodeJS'
    });

});

app.get('/user', (req, res) => {

    const user = req.session.user;

    if(user){
        res.send({
            user: user
        });
    }
    else{
        res.send({
            user: null
        });
    }


});

app.get('/getMessage', async (req, res) => {

    const data = [];

    const lastData = await Message.findAll({
        order: [["id", "DESC"]],
        limit: 5
    });
    
    const reversedData = lastData.reverse();
    const messages = reversedData;
    
    await Promise.all(messages.map(async (message) => {
        try {
            const usery = await User.findOne({where: {name: message.pseudo}})
            console.log(message.pseudo)
            console.log(message.message)
            console.log(usery.dataValues.photo)
            
            data.push({
                id: message.id,
                pseudo: message.pseudo,
                message: message.message,
                photo: usery.dataValues.photo
            });
        } catch(error) {
            console.log(error);
            res.send({error: error});
        }
    }));
    
    res.send({
        message: data
    });

})


app.post("/getMap", async (req, res) => {
    
    const catergorie = req.body.categ;

    try {

      const map = await Map.findAll({where : {categorie: catergorie}});
      res.send({ map: map })

    } catch (error) {

      console.log(error);
      res.send({error: error})
    
    }

});


// SOCKET IO
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true,
        methods: 'GET, POST, PUT, DELETE',
    }
});

io.on('connection', (socket) => {

    console.log(`User connected: ${socket.id}`);

    socket.on('send', async (data) => {

        const nom = await data.name;
        const message = await data.message;
        
        await Message.create({message: message, pseudo: nom})
        .catch((error) => {
            console.log(error);
        })    

        socket.broadcast.emit('new_message', true);

    });


});

const start = async () => {

    await db.sequelize.sync();
    server.listen(process.env.PORT, () => {

        console.log(`Serveur démarré sur le port ${process.env.PORT}`)
    
    }); 

}

start();
