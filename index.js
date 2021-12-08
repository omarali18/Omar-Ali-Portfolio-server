const express = require('express')
const cors = require("cors")
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.av6mz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

const run = async () => {
    try {
        await client.connect();
        console.log("Database connected");

        const database = client.db("Portfolio");
        const projectCollection = database.collection("Project");

        app.get("/project", async (req, res) => {
            const cursor = projectCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        });
        app.get("/aProject", async (req, res) => {
            const id = req.query.id
            const query = { _id: ObjectId({ id }) }
            const result = await projectCollection.findOne(query)
            console.log("id", result);
            res.send(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(` listening to ${port}`)
})