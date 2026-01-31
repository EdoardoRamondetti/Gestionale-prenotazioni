"use strict"

//A. import delle librerie
import http from "http" //importo l'export default dal modulo http, gli metto come nome http
import fs from "fs" //consente di usare il file system
import express, { NextFunction } from "express"
import dotenv from "dotenv"
import {MongoClient, ObjectId} from "mongodb"
import cors from "cors"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import cookieParser from "cookie-parser"

//grazie a @type di express, visual studio riconosce implicitamente i tipi e li associa
//automaticamente
//è tipizzato implicitamente
//questo da errore:
//let porta = 3000
//porta = "3000"

let privateKey = 'myComplexJwtKey';

//B. configurazioni
const app = express()

//và leggere le configurazioni scritte dentro al file .env
dotenv.config({path:".env"})
const connectionString = process.env.connectionStringLocal
const dbName = process.env.dbName

//C. creazione ed avvio del server http
const server = http.createServer(app)
let paginaErrore:string = ""

//CORS, per permettere richieste da localhost:4200
app.use(cors({
  origin: 'http://localhost:4200', // Angular
  credentials: true,               // obbligatorio per cookie
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

//avviamo il server sulla porta indicata
server.listen(process.env.port,function(){
    console.log("Server in ascolto sulla porta: " + process.env.port)
    fs.readFile("./static/error.html", function(err,content){
        if(err){
            paginaErrore = "<h1>Risorsa non trovata</h1>"
        }
        else{
            //content: sequenza di byte
            paginaErrore = content.toString()
        }
    })
})

//D. middleware
//1. request log
app.use("/",function(req,res,next){
    //req.originalUrl: path completo della richiesta
    console.log(req.method + ": " + req.originalUrl)
    next()
})

//2. gestione risorse statiche
app.use("/",express.static("./static"))

//3. lettura parametri POST
//accetto parametri post con una dimensione massima di 5MB
//restituisce i parametri come json all'interno di req.body
//i parametri GET sono restituiti come json in req.query
//(agganciati automaticamente perchè in coda alla url)
app.use("/",express.json({"limit":"5mb"}))

//4. log dei parametri post
//i parametri get si vedono con il log della richiesta
app.use("/",function(req,res,next){
    //object.keys restituisce un vettore di chiavi del json req.body
    if(req.body && Object.keys(req.body).length > 0){
        console.log("     Parametri body: " + JSON.stringify(req.body))
    }
    next()
})

//E. gestione delle risorse dinamiche
app.post('/api/login', async (req, res,next) => {
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    const email = req.body["email"]
    const password = req.body["password"]

    let collection = client.db(dbName).collection("Utenti")

    const request = collection.findOne({"email":email, "password":password})
    
    request.then(function(data){
        let token = jwt.sign({
        _id: data?._id,
        nome: data?.nome,
        email: data?.email
        }, privateKey);

        res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7*24*60*60*1000, // 7 giorni
        sameSite: 'lax'
        })

        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    })

    /*const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: 'Credenziali errate' });
    }*/
})

app.get("/api/nuoviClientiMensili",async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let collection = client.db(dbName).collection("Prenotazioni")

    const dataOggi = new Date().toISOString().split('T')[0];
    let data = new Date()
    let annoCorrente = data.getFullYear()
    let mesePrecedente = data.getMonth()
    if(mesePrecedente == 0){
        mesePrecedente = 12
        annoCorrente--
    }
    let primoDelMesePrecedente = annoCorrente + "-" + mesePrecedente + "-" + "01"
    const meseSuccessivo = parseInt(dataOggi!.substring(5,7))+1
    const meseDopo = dataOggi!.substring(0,5) + "0"+meseSuccessivo + "-01"

    const request = collection.find({
        "status":"confirmed",
        "date":{
            $gte:primoDelMesePrecedente,
            $lt:meseDopo
        }
        }).toArray()

    request.then(function(data){

        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    })
})

app.get("/api/getPrenotazioniDaConfermare",async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let collection = client.db(dbName).collection("Prenotazioni")

    const request = collection.find({
        "status":"pending"
        }).toArray()

    request.then(function(data){

        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    })
})

app.get("/api/getPrenotazioniMensili",async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let collection = client.db(dbName).collection("Prenotazioni")

    const dataOggi = new Date().toISOString().split('T')[0];
    let data = new Date()
    let annoCorrente = data.getFullYear()
    let mesePrecedente = data.getMonth()
    let primoDelMesePrecedente = annoCorrente + "-" + mesePrecedente + "-" + "01"
    const meseSuccessivo = parseInt(dataOggi!.substring(5,7))+1
    const meseDopo = dataOggi!.substring(0,5) + "0"+meseSuccessivo + "-01"

    const request = collection.find({
        "date":{
            $gte:primoDelMesePrecedente,
            $lt:meseDopo
        }
    }).toArray()

    request.then(function(data){
        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    })
})

app.get("/api/getAllPrenotazioni",async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let collection = client.db(dbName).collection("Prenotazioni")

    const request = collection.find({}).toArray()

    request.then(function(data){
        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    }) 
})

app.get("/api/getSettings",async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let collection = client.db(dbName).collection("Impostazioni")

    const request = collection.findOne({})

    request.then(function(data){

        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    }) 
})

app.patch("/api/modificaPrenotazione",async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let collection = client.db(dbName).collection("Prenotazioni")

    let tipoModifica = req.body["tipoModifica"]
    const _id = new ObjectId(req.body["id"])

    tipoModifica = tipoModifica == "rifiuta" ? "cancelled" : "confirmed"

    const request = collection.updateOne({"_id": _id },{$set: {"status":tipoModifica}})

    request.then(function(data){

        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    }) 
})

app.get("/api/getServiceClientsOperators",async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let User = client.db(dbName).collection("Clienti")
    let Servizi = client.db(dbName).collection("Servizi")
    let Staff = client.db(dbName).collection("Staff")
    let Prenotazioni = client.db(dbName).collection("Prenotazioni")
    
    const [users, servizi, staff, prenotazioni] = await Promise.all([
      User.find().toArray(),
      Servizi.find().toArray(),
      Staff.find().toArray(),
      Prenotazioni.find().sort({_id:"desc"}).limit(1).toArray()
    ]);

    console.log(Prenotazioni)

    res.send({
        users,
        servizi,
        staff,
        prenotazioni
        }
    )
})

app.get("/api/getInfoService", async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let collection = client.db(dbName).collection("Servizi")

    const request = collection.find({
        name:req.query["nameService"]
        }).toArray()

    request.then(function(data){

        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    })
})

app.post("/api/addPrenotazione",async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let collection = client.db(dbName).collection("Prenotazioni")

    const cliente = req.body["cliente"]
    const servizio = req.body["servizio"]
    const data = req.body["data"]
    const ora = req.body["ora"]
    const operatore = req.body["operatore"]
    const price = req.body["price"]
    const duration = req.body["duration"]
    const note = req.body["note"]

    let ore = ora.split(":")[0]
    let minuti = ora.split(":")[1]
    let date = new Date()
    date.setHours(ore, minuti, 0, 0);
    date.setMinutes(date.getMinutes() + parseInt(duration));

    const request = collection.insertOne(
        {
            _id:  new ObjectId(),
            date: data,
            startTime: ora,
            endTime:date.toTimeString().slice(0, 5),
            status:"pending",
            client:{name:cliente},
            staff:{name: operatore},
            service:{name:servizio,price:price, duration:duration},
            notes: note,
            createdAt: new Date().toISOString().split("T")[0]
        }
    )

    request.then(function(data){

        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    }) 
})

app.patch("/api/modificaDatiPrenotazione",async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let collection = client.db(dbName).collection("Prenotazioni")

    const _id = req.body["_id"]
    const cliente = req.body["cliente"]
    const servizio = req.body["servizio"]
    const data = req.body["data"]
    const ora = req.body["ora"]
    const operatore = req.body["operatore"]
    const price = req.body["price"]
    const duration = req.body["duration"]
    const note = req.body["note"]

    let ore = ora.split(":")[0]
    let minuti = ora.split(":")[1]
    let date = new Date()
    date.setHours(ore, minuti, 0, 0);
    date.setMinutes(date.getMinutes() + parseInt(duration));

    const request = collection.updateOne(
        {
            _id: new ObjectId(_id),
        },
        {
        $set: {
            date: data,
            startTime: ora,
            endTime: date.toTimeString().slice(0, 5),
            client: { name: cliente },
            staff: { name: operatore },
            service: { name: servizio, price: price, duration: duration },
            notes: note
            }
        }
    )

    request.then(function(data){

        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    }) 
})

app.delete("/api/elliminaPrenotazione/:id",async function(req,res,next){
    const client = new MongoClient(connectionString!)
    await client.connect().catch(function(err){
        res.status(503).send("Errore di connessione al dbms")
        return
    })

    let collection = client.db(dbName).collection("Prenotazioni")

    const _id = req.params.id

    const request = collection.deleteOne(
        {
            _id: new ObjectId(_id),
        }
    )

    request.then(function(data){

        res.send(data)
    })

    request.catch(function(err){
        res.status(500).send("Errore esecuzione query: " + err)
    })

    request.finally(function(){
        client.close()
    })  
})

//F. default route
//se non trova nessuna route che va a buon finire,
//la defautl route darà errore 404
app.use("/",function(req,res,next){
    //res.status() di default è 200
    res.status(404)
    if(!req.originalUrl.startsWith("/api/")){
        //send serializza in automatico solo se gli passo un json
        res.send(paginaErrore)
    }
    else{
        res.send("Risorsa non trovata")
    }
})

//G. route gestione errori
//se si verifica un errore express salta a questa
//route. la route di errore ha un parametro in più, così
//capisce quale è
app.use("/",function(err:Error,req:express.Request,res:express.Response,next:NextFunction){
    console.log("*****ERRORE*****\n" + err.stack) //err.stack da lo stack completo degli errori
    //se vado in errore il client rimane in attesa
    res.status(500).send(err.message) //err.message messaggio riassuntivo errore
    //se non gestisco gli errori il server fa il log dello stack degli errori
    //e poi si ferma
})
