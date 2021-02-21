const express = require("express")
const mongoose = require("mongoose")
const url = "mongodb://localhost/DB"
const Element = require("./models/element")
const bodyParser = require("body-parser")
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//MIDLEWARE
/*app.use('/', ()=>
    console.log("Hello World!")
);
*/


//ROUTES
/*app.get('/', (req, res) => {
    res.send("Home");
});
*/

//GET ALL ELEMENTS
app.get('/element', async (req, res)=> {
    try {
        const elements = await Element.find()
        res.json(elements)

    }catch(err){
        res.send("Error" + err)
    }
});

//GET ROOT
app.get('/root', async (req, res)=> {
    try {
        const root = await Element.find(({ root: true }))
        res.json(root)
    } catch (err){
        res.send("Error"+err)
    }
})
app.post('/element', async (req, res)=> {
    const element = new Element({
        type: req.body.type,
        suboptions: req.body.suboptions,
        root: req.body.root,
        name: req.body.name,
        text: req.body.text
    })
    try {
        const _element = await element.save()
        res.json(_element)
    }catch(err){
        res.send("Error"+err)
    }
})
//UPDATE ELEMENT
app.patch('/element/:id', async (req, res)=> {
    try {
        const element = await Element.findById(req.params.id)
        element.name = req.body.name;
        element.text = req.body.text;
        element.save();
        res.json(element)
    }catch (err){
        res.send("Error"+err)
    }
})

//ADD SUBOPTION
app.post('/suboption', async(req, res)=> {
    const suboption = new Element({
        type: req.body.type,
        suboptions: req.body.suboptions,
        root: req.body.root,
        name: req.body.name,
        text: req.body.text
    })
    try {
        await suboption.save()
        const updatedEl = await Element.findByIdAndUpdate(
                { _id: req.body.parent },
                { $addToSet: { suboptions: req.body.son } }
            )
        res.json(updatedEl)
    }catch(err){
        res.send("Error"+err)
    }
})

//CONNECT DATABASE
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
const con = mongoose.connection

con.on('open', () => {
    console.log("Database connected...")
})

//SERVER LISTEN 
app.listen(`${process.env.port}`, ()=> {
    console.log("Server Running...")
})