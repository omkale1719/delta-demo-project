const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/posts.js");
const cookieParser = require("cookie-parser");

// Use cookie-parser middleware
app.use(cookieParser("seacreatcode"));

// Set cookies
app.get("/getcookies", (req, res) => {
    res.cookie("great", "Good morning",{signed:true});
    res.cookie("student", "teacher");
    res.send("hi i am chiti");
});

app.get("/varify",(req,res)=>{
    console.log(req.cookies);
    console.log(req.signedCookies);//he showing signed cookies
    res.send("verifield");
})

// Root route to display cookies
app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("hey i am root");
});

// get value in cookies
app.get("/getvalue",(req,res)=>{
    let {name="jony"}=req.cookies;
    res.send(`Hello,${name}`)
})

// User and post routes
app.use("/users", users);
app.use("/posts", posts);

app.listen(3000, () => {
    console.log("server is listening");
});
