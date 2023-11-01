const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())  //POST r req.body pawyer jonno aita used


//Mogo start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s8or9pd.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Connect to the "usersDB" database and access its "users" collection
        const usercollection = client.db("tecnology").collection("techProduct");
        const Cartcollection = client.db("tecnology").collection("addCart");


        //(Multiple user read)
        //Transfer data to Browser from MongoDB (path:"/users",)->main.jsx 
        //1. '/users' create route -> amr inccha moto
        //2. const cursor=usercollection.find() -> used collect data from Mongo
        //3. res.send(result);-> used send data to surver(http://localhost:5000/users) ai link a
        //4. Finaly client side using loader:() featch data this server ---> client side:::: loader: ()=> fetch('http://localhost:5000/users')
        app.get('/products', async (req, res) => {  //Amr iccha moto '/users...' banabo
            const cursor = usercollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/addcart', async (req, res) => {  //Amr iccha moto '/users...' banabo
            const cursor = Cartcollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })



        //(Use for Update(Delete) [single user read])//Tranfer client side specifiq user (path:'/update/:id',)->main.jsx
        app.get('/addcart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await Cartcollection.findOne(query)
            //send result to client side()( ai result asbe mongo theke)
            res.send(user);
        })

        //Update user
        // app.put('/students/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const user = req.body;
        //     console.log(id, user)
        //     //update mongo te(databse a set)
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true } //jodi na thake ta hole put korbe
        //     const updateUser = {
        //         $set: {
        //             //stuid: user.stuid,
        //             day: user.day,
        //             paid: user.paid,
        //             due: user.due,
        //             feast:user.feast
        //         }
        //     }
        //     const result = await usercollection.updateOne(filter, updateUser, options);
        //     res.send(result)
        // })


        //get data form client form 
        app.post('/products', async (req, res) => {
            const user = req.body;
            console.log('New Products ', user)
            //database a data transfer
            const result = await usercollection.insertOne(user);
            //send result to client side()( ai result asbe mongo theke)
            res.send(result)   //post r kaj sesh hower por client [.then(data => consol.log(data))]
        });

        //get data form client form 
        app.post('/addcart', async (req, res) => {
            const user = req.body;
            console.log('Add Cart ', user)
            //database a data transfer
            const result = await Cartcollection.insertOne(user);
            //send result to client side()( ai result asbe mongo theke)
            res.send(result)   //post r kaj sesh hower por client [.then(data => consol.log(data))]
        });



        //delete data from database(Mongo)-> id Find from client side
        app.delete('/addcart/:id', async (req, res) => {
            const id = req.params.id;
            console.log('pls delete from database', id)
            //For Mongo Delete
            const query = { _id: new ObjectId(id) }
            const result = await Cartcollection.deleteOne(query)
            //send result to client side()( ai result asbe mongo theke)
            res.send(result)

        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


//Mongo End


app.get('/', (req, res) => {
    res.send('products Running')
})

app.listen(port, () => {
    console.log(`Port is Running dinnig:  ${port}`)
})