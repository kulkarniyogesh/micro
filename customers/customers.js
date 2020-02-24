const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
var ObjectId = require('mongodb').ObjectID;

app.use(bodyParser.json());


require('./Customer');
const Customer = mongoose.model('Customer');

const MongoClient = require('mongodb').MongoClient;
var collection;
const uri = "mongodb+srv://yogesh:hb7oZwYdA6dTqGRW@cluster0-eqpdl.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  collection = client.db("customerservice").collection("Customers"); 
});

app.get('/',(req,res)=>{
    res.send('This is customer service');
});

app.get('/customers', (req, res)=>{

    collection.find().toArray(function(err, data){
        res.send(data);
    });
});

app.post('/customers', (req, res)=>{

    var newCustomer = {
        "name":req.body.name,
        "age":req.body.age,
        "address":req.body.address
    }

    var customer = new Customer(newCustomer);

    collection.insertOne(customer,(err,data)=>{
        if(err){
            res.send('Your request could not be processed'+err);
            return;
        }
        res.send(data); 
    });

});

app.get('/customers/:id', (req, res)=>{

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

app.delete('/customers/:id', (req, res)=>{

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

app.listen(4546, ()=>{
    console.log('customer service running...');
});