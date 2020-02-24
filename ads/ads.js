const express= require('express');
const app = express();

const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
var cors = require('cors');
app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));
require('./Ad');
const Ad = mongoose.model("Ad"); 

const MongoClient = require('mongodb').MongoClient;
var collection;
const uri = "mongodb+srv://yogesh:hb7oZwYdA6dTqGRW@cluster0-eqpdl.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  collection = client.db("olxservice").collection("ads"); 
});

  
app.get('/',(req,res)=>{
    res.send('This is ad service2');
});

app.get('/ads',(req,res)=>{
    collection.find().toArray(function(err, data) {
        res.send(data);
    });
 });

app.get('/ads/:id',(req,res)=>{
     
    collection.findOne({"_id":ObjectId(req.params.id)}).then((result) => { 
        if (result) {
          console.log(`Successfully found document: ${result}.`);
          res.send(result);
        } else {
          console.log('No document matches the provided query.');
        }
      })
      .catch((err) => console.error(`Failed to find document: ${err}`));
});

app.delete('/ads/:id',(req,res)=>{
    collection.findOneAndDelete({"_id":ObjectId(req.params.id)}).then((result) => {
         
        if (result) {
          console.log(`Successfully deleted document: ${result}.`);
          res.send(result);
        } else {
          console.log('No document matches the provided query.');
          res.send("No document found");
        }
      })
      .catch((err) => console.error(`Failed to find document: ${err}`));
});

app.post('/ads',(req,res)=>{

    var newAd = {
        "title":req.body.title,
        "description":req.body.description
    }

     var ad = new Ad(newAd);
     collection.insertOne(newAd, (err,data)=>{
         if(err){
             res.send('Your request could not be processed'+err);
             return;
         }
         res.send(data); 
     });
 }); 


app.listen(4547, ()=>{
    console.log('server running....');
});