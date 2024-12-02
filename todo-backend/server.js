const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const app = express();

app.use(express.json());
app.use(cors())

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mern-app')
.then(() => {
    console.log("DB connected");
})
.catch((err) => {
    console.log(err);
});

// Create schema 
const todoSchema = new mongoose.Schema({
    title: String,
    description: String
});

const todoModel = mongoose.model("Todo", todoSchema);

// Create a new todo item
app.post("/todos", async (req, res) => {
    try {
        const { title, description } = req.body; // Extract title and description from the request body
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Get all todos
app.get("/todos", async (req, res) => {
    try {
        const todos = await todoModel.find(); // Fetch all todos from the database
        res.json(todos);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});
app.put("/todos/:id",async(req,res)=>{
    try{
    const{title,description}=req.body;
    const id= req.params.id;
   const updatedtodo= await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
   )
   if(!updatedtodo){
     return res.status(404).json({message:"todo not found"})
   }
   res.json(updatedtodo)
}
catch(err){
    console.log(err);
    res.status(500).json({message:err.message})
}
})
//delete item
app.delete("/todos/:id", async(req,res)=>{
    try{
    const id=req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err.message})
    }
})

const port = 8000;
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});
