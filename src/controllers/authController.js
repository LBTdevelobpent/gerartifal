const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authMiddleware = require("../middlewares/auth.js");
const authConfig = require('../config/auth.json');
const User = require('../models/user.js'); //Call do model mongo, por ele que se faz as buscas no mongo



//-----------------Gera Um token de Autenticação----------------//
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret,{ //KELLYMEUAMOR
        expiresIn: 86400,
    });
}
//------------------------------------------------------------//

const router = express.Router(); //Chamada de uma rota

//-------------------------Registro no DB--------------------//
router.post('/register', async(req, res) => {

    const { email, name } = req.body;

    try{
        //Check para ver se já tem usuario cadastrado
        if(await User.findOne({ email })){
            return res.status(400).send({ error: "Email já existe"});         

        }
        
        if(await User.findOne({ name })){
            return res.status(400).send({ error: "Nome de Usario já existe"});
        }

        const user = await User.create(req.body); //Criar O Doc no MongoDB

        user.password = undefined; //Não retornar a senha para o usuario
        
        
        return res.send({ 
            user,
            token: generateToken({ id: user.id }),
         }); //Caso não tenha erro, vai retornar o usuario
         

    }catch (err){
        return res.status(400).send({ error: "Não foi possivel cadastrar"});
    }
});
//----------------------------------------------------------//


//-------------------------------Login--------------------------------------//
router.post('/authenticate', async(req, res) => {
    const { name , password } = req.body;

    const user = await User.findOne({ name }).select('+password'); 
    
    if(!user){ //Check se usuario existe
        return res.status(400).send({ error: "Usuario inexistente"});
    }

    if(!await bcrypt.compare(password, user.password)){ //Está comparando as senhas, a que o usuario fez login e a do BD
        return res.status(400).send({ error: "Senhas não batem"});
    }

    user.password = undefined;

    res.send({ user, 
        token: generateToken({id: user.id}),
    });

});
//-------------------------------------------------------------------------//

router.use(authMiddleware);

router.put('/modify', async(req,res) => {

    const userM = req.body;
    const userId = req.userId;
    const user = await User.findOne({_id: userId}).select('+password');
    
    if(!user){
        return res.status(400).send({ error: "Usuario inexistente" });
    }

    if(!await bcrypt.compare(userM.password, user.password)){
        return res.status(400).send({ error: "Senhas não batem"});
    }
    
    const hash = await bcrypt.hash(userM.Npassword, 10);
  

    User.findOneAndUpdate({ _id: userId }, {$set: { name: userM.name, password: hash }}, {upsert: true}, (err, user) =>{
        if(err){
            return res.status(400).send({ error: "Não foi possivel atualizar" });
        }
        return res.send({ user , 
            ok: true, 
            token: generateToken({id: user.id}), 
        });
    });
    
});



router.get('/getAll', async(req,res)=> {

    var user = await User.find();
    if(!user){
        return res.status(400).send({ error: "Não existe nenhum usuario" });
    }
    return res.send({ user });
    

});


module.exports = app => app.use('/auth', router);