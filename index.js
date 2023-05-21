const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('kids car server is running')
})

const uri = `mongodb+srv://carToys:XNlx1hIG0d4lEDmf@cluster0.bylwpc6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // client.connect()

    const carCollection = client.db('carszoneDB').collection('carzone');
    const otherCollection = client.db('carszoneDB').collection('others');

    app.post('/allcars', async(req, res) => {
      const newCar = req.body;
      console.log(newCar);
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    })

    app.get('/allcars', async(req, res) =>{
      const query = {};
      const result = await carCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/onlycars', async(req, res) =>{
      let query = {};
      if(req.query?.email){
        query = {email : req.query.email}
      }
      const result = await carCollection.find(query).limit(20).toArray();
      res.send(result);
    })

    app.get('/mycars/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const carrResult = await carCollection.findOne(query);
      res.send(carrResult)
    })

    app.delete('/allcars/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await carCollection.deleteOne(query);
      res.send(result)
    })

    app.put('/allcars/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const optiion = {upsert: true}
      const updatetingCar = req.body;
      const updatedCar = {
        $set: {
          price: updatetingCar.price,
          quantity: updatetingCar.quantity,
          details: updatetingCar.details,
        }
      }
      const result = await carCollection.updateOne(filter, updatedCar, optiion);
      res.send(result);
    })

    app.get('/others', async(req, res) =>{
      const result = await otherCollection.find().toArray();
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`car server is running on PORT: ${port}`);
})