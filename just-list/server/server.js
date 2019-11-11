//importing modules
var express = require ('express');
var bodyparser = require ('body-parser');
var cors = require('cors');
var path = require ('path');

const fs = require('fs');

var app = express();

// const route = require("./routes/routes");

//port no.
const port = 8080;


//adding middleware - cors
app.use(cors());

//body -parser
app.use(bodyparser.json());


//testing Server
app.get("/",(req,res)=>{
    return res.send("Server says hey")
});

app.get("/users",(req,res)=>{
    let users = getUsers();
    return res.send(users)
})

app.post("/users",(req,res)=>{
    console.log("New User :"+ JSON.stringify(req.body.user));
    newUser(req.body.user);
    return res.send("Thanks for letting me know.")
})

app.get("/tasks",(req,res)=>{
    let data = getTasks()
    return res.send(data)
})

app.post("/tasks",(req,res)=>{
    addTasks(req.body.tasks)
    return res.send("Task added.")
})

app.listen(port,()=>{
    console.log("Server started at port :"+port);
});

//Code to be moved in different files later
getUsers = () => {
    let users_raw = fs.readFileSync('users.json');
    let users = JSON.parse(users_raw);
    return users;
}

newUser = (user) => {
    let users_raw = fs.readFileSync('users.json');
    let users = JSON.parse(users_raw);
    let userarray = users.users;
    userarray.push(user);
    users.users =userarray;
    fs.writeFileSync('users.json', JSON.stringify(users));
    return users;
}

getTasks = () => {
    let tasks_raw = fs.readFileSync('data.json');
    let tasks = JSON.parse(tasks_raw);
    return tasks; 
}

addTasks = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data));
    return;
}
