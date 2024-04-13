const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();


//****** SEPARAR EM ARQUIVOS PARA SER USADO AQUI, ROUTES, VER NOME E COMO FAZ DEPOIS. */
//SEPERAR
//Coloca cors na api
app.use(cors());

//config bodyoarser
app.use(bodyParser.urlencoded({ extended: false }));
//converte o corpo da req em json
app.use(bodyParser.json());





/* 
if(validator.isEmpty(name)){
    console.log('Está vazia msm',name)
}else{
    console.log('e ai?', name)
}
 */

const JWTScret = `${process.env.JWTSECRET}`

//middleware para proteger rotas conforme a necessidade, só acessa se estiver logado.
function authLogged(req, res, next){
    const authToken = req.headers['authorization']

        if(authToken != undefined){
            //Separa o bearer do token
            const bearer = authToken.split(' ');

            //armazena somente o token
            let token = bearer[1];

            jwt.verify(token, JWTScret, (err, data) =>{
                if(err){
                    res.status(401)
                    res.json({erro: "Token Invalido"})
                }else{
                    
                    //Variaveis de req que podem ser usadas nas rotas que utilizam o auth
                    //Ver exemplo no games lá
                    req.token = token;
                    //São os valores passados no jwt na rota de login, acessamos atraves do data
                    //No qual pode ser usado em todas as rotas também
                    req.loggedUser = {id: data.id, email: data.email}
                    const user = data
                    //conteudo do jwt
                    console.log(data) 
                    next()
                }
            })
        }
}

app.get('/', (req, res) => {
    res.send("OI")
})

//Rota de teste privado
app.get('/private', authLogged, (req,res) =>{
    res.status(200).json({Msg: "Logado e com acesso", user: req.loggedUser})
})

//Register route
app.post("/user", (req, res) => {
    let { name, nickname, email, password, club, age, gender, country, photo } = req.body

    if (name == undefined || name == '') {

    }

    if (nickname == undefined || nickname == '') {

    }

    if (email == undefined || email == '') {

    } else if (!validator.isEmail(email)) {
        //Não email
    }

    if (password == undefined || password == '') {

    }

    if (club == undefined || club == '') {

    }

    if (age == undefined || age == '') {

    }

    if (gender == undefined || gender == '') {

    }

    if (country == undefined || country == '') {

    }

    database.select(['email', 'nickname']).whereRaw(`email = '${email}'  OR nickname = '${nickname}'`).table("users").then(data => {
        console.log(data)
        if (data.length > 0) {
            if (email == data[0].email) {
                res.status(409).json({ error: "Email already in use" });
            } else {
                res.status(409).json({ error: "Nickname already in use" });
            }

        } else {

            const saltRounds = 10;

            bcrypt.hash(password, saltRounds, function (err, hashPass) {
                if (err) {
                    console.error("Erro ao Gerar Hash", err)
                } else {

                    const user = {
                        name: name,
                        nickname: nickname,
                        email: email,
                        password: hashPass,
                        club: club,
                        age: age,
                        gender: gender,
                        country: country,
                        photo: photo,
                    }

                    database.insert(user).into('users').then(data => {
                        console.log(data, 'Data Created');
                        database.select(['id', 'name', 'nickname', 'email', 'club', 'age', 'gender', 'country', 'photo']).where({ email: user.email }).table("users").then(data => {
                            res.status(201).json({ msg: 'User created', data });
                        }).catch(err => {
                            console.log(err);
                        })

                    }).catch(err => {
                        console.log(err);
                    })


                }
            })
        }
    }).catch(err => {
        console.log(err)
    })
})

//LOGIN
app.post("/login", (req, res) => {
    const { email, password } = req.body;


    if (email != undefined) {
        database.select(['id','email', 'password',]).where({ email: email }).table("users").then(data => {
            bcrypt.compare(password, data[0].password, function (err, result) {
                if (err) {
                    res.status(400).json({ error: "Something goings wrong" });
                } else {
                    if (result) {

                        //Geração de token
                        jwt.sign({ id: data[0].id, email: data[0].email }, JWTScret, { expiresIn: '2d' }, (err, token) => {
                            if (err) {
                                res.status(400);
                                res.json({ erro: "Falha Interna" })
                            } else {
                                res.status(200);
                                res.json({ msg: "User logged",token: token })
                            }
                        })
                    } else {
                        res.status(401).json({ error: "Wrong password" });
                    }
                }
            })
        }).catch(error => {
            console.log(error)
            res.status(404).json({ error: "Email not found" });
        })

    } else {
        res.status(400).json({ error: "Email invalid" });
    }
})


app.listen(4000, () => {
    console.log("BACK RODANDO")
})