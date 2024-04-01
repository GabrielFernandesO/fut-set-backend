const express = require ('express');
const database = require('./database');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('validator');
const bcrypt = require('bcrypt');
const app = express();

//Coloca cors na api
app.use(cors());

//config bodyoarser
app.use(bodyParser.urlencoded({extended: false}));
//converte o corpo da req em json
app.use(bodyParser.json());


//CRIAR ESQUECI O NOME, O ROUTES PARA SEPARAR ROTAS E N FICAR UMA BAGUNÇA NO INDEX.JS

    
/* 
if(validator.isEmpty(name)){
    console.log('Está vazia msm',name)
}else{
    console.log('e ai?', name)
}
 */



app.get('/', (req, res) =>{
    res.send('oi zet')
})

//Register route
app.post("/user", (req, res) =>{
    let {name, nickname, email, password, club, age, gender, country, photo} = req.body

  if(name == undefined || name == ''){

  }

  if(nickname == undefined || nickname == ''){

  }

  if(email == undefined || email == ''){

  }else if(!validator.isEmail(email)){
    //Não email
  }

  if(password == undefined || password == ''){

  }

  if(club == undefined || club == ''){

  }

  if(age == undefined || age == ''){

  }

  if(gender == undefined || gender == ''){

  }

  if(country == undefined || country == ''){

  }

  database.select(['email', 'nickname']).whereRaw(`email = '${email}'  OR nickname = '${nickname}'`).table("users").then(data =>{
    console.log(data)
    if(data.length > 0){
        if(email == data[0].email){
            res.status(409).json({error: "Email already in use"});
        }else{
            res.status(409).json({error: "Nickname already in use"});
        }
        
    }else{
        
        const saltRounds = 10;

        bcrypt.hash(password, saltRounds, function(err, hashPass) {
            if(err){
                console.error("Erro ao Gerar Hash", err)
            }else{

                const user = {
                    name: name,
                    nickname: nickname,
                    email: email,
                    password: hashPass,
                    club: club,
                    age: age,
                    gender : gender,
                    country : country,
                    photo: photo,
                }

                database.insert(user).into('users').then(data =>{
                    console.log(data, 'Data Created');
                    database.select(['id','name', 'nickname', 'email', 'club', 'age', 'gender', 'country', 'photo']).where({email: user.email}).table("users").then(data =>{
                        res.status(201).json({msg: 'User created', data});
                    }).catch(err =>{
                        console.log(err);
                    })
                    
                }).catch(err =>{
                    console.log(err);
                })
                

            }
        })
    }
  }).catch(err =>{
    console.log(err)
  })
})

//LOGIN
app.post("/login", (req, res)=>{
    const {email, password} = req.body;

    
    if (email != undefined){
        database.select(['email', 'password']).where({email: email}).table("users").then(data =>{
            bcrypt.compare(password, data[0].password, function(err, result) {
                if(err){
                    res.status(400).json({error: "Something goings wrong"});
                } else{
                    if(result){
                        //Fazer JWT
                        res.status(200).json({msg: "User logged!", token: "token ou cookie"});
                    }else{
                        res.status(401).json({error: "Wrong password"});
                    }
                }
            })
        }).catch(error =>{
            console.log(error)
            res.status(404).json({error: "Email not found"});
        })
       
    }else{
        res.status(400).json({error: "Email invalid"});
    }
})


app.listen(3000, () =>{
    console.log("BACK RODANDO")
})