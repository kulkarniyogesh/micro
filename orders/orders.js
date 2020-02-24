const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
const axios = require('axios');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://yogesh:hb7oZwYdA6dTqGRW@cluster0-eqpdl.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

require('./Order');
const Order = mongoose.model('Order');
var db;

client.connect(err => {
  db = client.db("orderservice").collection("orders"); 
});

app.get('/orders',(req,res)=>{
    db.find().toArray(function(err, data){
        if(data){
            res.send(data);
        }
        else{
            res.send('Some thing went wrong'+err);
        }
    })
});

app.get('/orders/:id',(req,res)=>{
 
    db.findOne({"_id":ObjectId(req.params.id)}).then((result) => { 
                if(result){
                     axios.get('http://localhost:4546/customers/'+result.CustomerId).then((customer)=>{

                        const orderObject = {customerName:customer.data.name, bookTitle:''}
                         
                        axios.get('http://localhost:4545/books/'+result.BookId).then((book)=>{
                            
                            if(book){
                                orderObject.bookTitle = book.data.title;
                                res.send(orderObject);
                            }
                        }).catch((err) => console.error(`Failed to find document book: ${err}`)); 
                    }).catch((err) => console.error(`Failed to find document customer: ${err}`));;
                }else {
                    console.log('No document matches the provided query.');
                  }
        }).catch((err) => console.error(`Failed to find document: ${err}`));
});

app.post('/orders',(req,res)=>{
    console.log(req.body.CustomerID);
    var newOrder = {
        CustomerId: req.body.CustomerId,
        BookId: req.body.BookId,
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    var order = new Order(newOrder);

    db.insertOne(order,(err, data)=>{
        if(err){
            res.send('Some thing went wrong'+err);
        }
        res.send(data);
    });
});

app.listen(4548, ()=>{
    console.log('Order service running...');
});