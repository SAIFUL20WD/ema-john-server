const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnwxy.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post('/addProduct', (req, res) => {
    const product = req.body
    productsCollection.insertOne(product)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray( (err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body
    productsCollection.find({key: { $in: productKeys}})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res) => {
    const orderInfo = req.body
    ordersCollection.insertOne(orderInfo)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)