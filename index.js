const express = require ('express');
const database = require('./database');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('validator');
const app = express();

//Coloca cors na api
app.use(cors());

//config bodyoarser
app.use(bodyParser.urlencoded({extended: false}));
//converte o corpo da req em json
app.use(bodyParser.json());




/* const user = [
    {
        name: "Cristopher Schuffner",
        nickname : 'Crisz20',
        email: "cris2000@hotmail.com",
        password: "123",
        club: "Frankfurt",
        age: '37',
        gender: 'Male',
        country: "German",
        photo: ''

    }
]


database.insert(user).into('users').then(data =>{
    console.log(data)
}).catch(err =>{
    console.log(err);
})
 */


   

    
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
        res.send({erro: 'Usuário já cadastrado'})
    }else{
        res.send({erro: "Usuário Livre"})
        //FAzer hash da senha aqui dps com bcrypt
    }
  }).catch(err =>{
    console.log(err)
  })




})

app.listen(3000, () =>{
    console.log("BACK RODANDO")
})