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

//GET A SPECIFIC ELEMENT
app.get('/element/:id', async (req, res)=> {
    try {
        const element = await Element.findOne({_id: req.params.id})
        res.json(element)
    }catch(err){
        res.send("Error "+ err)
    }
})


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
        const elements = await Element.find();
        console.log("Testing")
        
        const RetreiveElement = (id) => {
            let element = [];
            elements.forEach((el) => {
              if (String(el._id) === id) {
                console.log("checkpoint")
                console.log(el)
          
                element = el;
              }
            });
            return element;
          };

        const TreeRecursive = (data) => {
            data.forEach((element) => {
              const mappedChildren = [];
              if (element.suboptions !== undefined) {
                element.suboptions.forEach((id) => { 
                  console.log(id)  
                  const el = RetreiveElement(String(id));
                  id = el;
                  mappedChildren.push(el);
                });
                element.suboptions = mappedChildren;
                TreeRecursive(element.suboptions);
              }
            });
          };
          
          TreeRecursive(root);
          //const test = []
          console.log(root);
  
        res.send(root)
        
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

//DELETE ELEMENT 
app.delete('/element/:id', async(req, res) => {
    try {
        await Element.findOneAndDelete({_id: req.params.id})
                .then(res.status(200).json({ message: "Successful" }))
    } catch (err) {
        res.send("Error"+err)
    }
})

//ADD SUBOPTION
app.delete('/element', async(req, res)=> {
    try{
        const elements = Element.find();
        elements.deleteMany().then(function(){ 
            res.send("Data deleted") // Success 
        })
    }catch(err){
        res.send("Error"+err)
    }
})
app.post('/suboption', async(req, res)=> {
    const suboption = new Element({
        type: req.body.type,
        suboptions: req.body.suboptions,
        root: req.body.root,
        name: req.body.name,
        text: req.body.text
    })
    try {
        const sub = await suboption.save()
        console.log("Parent is")
        console.log(req.body.parent)
        //find if parent exists then track it down the root element 
        
        const updatedEl = await Element.findByIdAndUpdate(
                { _id: req.body.parent },
                { $addToSet: { suboptions: sub._id } }
            )
        res.json(updatedEl)
    }catch(err){
        res.send("Error"+err)
    }
})

//CONNECT DATABASE
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const con = mongoose.connection

con.on('open', () => {
    console.log("Database connected...")
})

//SERVER LISTEN 
app.listen(`${process.env.port}`, ()=> {
    console.log("Server Running...")
})