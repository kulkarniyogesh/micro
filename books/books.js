const express= require('express');
const app = express();

const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

app.use(bodyParser.json());

require('./Book');
const Book = mongoose.model("Book"); 

const MongoClient = require('mongodb').MongoClient;
var collection;
const uri = "mongodb+srv://yogesh:hb7oZwYdA6dTqGRW@cluster0-eqpdl.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  collection = client.db("bookservice").collection("Books"); 
});

  
app.get('/',(req,res)=>{
    res.send('This is book service2');
});

app.get('/books',(req,res)=>{
    collection.find().toArray(function(err, data) {
        res.send(data);
    });
 });

app.get('/books/:id',(req,res)=>{
    console.log(req.params.id);
   
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

app.delete('/books/:id',(req,res)=>{
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

app.post('/books',(req,res)=>{

    var newBook = {
        "title":req.body.title,
        "author":req.body.author,
        "numberPages": req.body.numberPages,
        "publisher": req.body.publisher
    }

     var book = new Book(newBook);

     collection.insertOne(book, (err,data)=>{
         if(err){
             res.send('Your request could not be processed'+err);
             return;
         }
         res.send(data); 
     });
 }); 


app.listen(4545, ()=>{
    console.log('server running....');
});