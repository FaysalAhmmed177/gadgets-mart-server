const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 4200


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7p4ls.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection eror', err);
    const gadgetsCollection = client.db("gadgetsMart").collection("gadgets");
    const ordersCollection = client.db("gadgetsMart").collection("orders");

    app.get('/products', (req, res) => {
        gadgetsCollection.find()
            .toArray((err, items) => {
                console.log(items);
                res.send(items)
            })
    })

    app.get('/product/:id', (req, res) => {
        console.log(req.params.id);
        gadgetsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

   app.get('/orderedProduct', (req, res) =>{
       ordersCollection.find({})
       .toArray((err, documents) => {
           console.log(documents);
           res.send(documents);
       })
   })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('Adding new event', newProduct);
        gadgetsCollection.insertOne(newProduct)
            .then(result => {
                console.log('Inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })


    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        console.log('Adding new event', newOrder);
        ordersCollection.insertOne(newOrder)
            .then(result => {
                console.log('Inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.delete('/delete/:id', (req, res) => {
       const id = ObjectId(req.params.id);
       gadgetsCollection
       .findOneAndDelete({_id:id})
       .then((documents)=> res.send(documents.value))

        // gadgetsCollection.deleteOne({ _id: ObjectId(req.params.id)})
        //     .then(result => {
        //         console.log(result.insertedCount);
        //         res.send(result.deletedCount > 0);
        //     })
    })

});


app.listen(process.env.PORT || port)