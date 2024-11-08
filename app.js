if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride=require('method-override');
const ejsMate = require('ejs-mate');
// const wrapAsync=require("./utils/wrapAsync.js");
// const expresserror=require("./utils/expresserror.js");
// const reviewSchema=require("./schema.js")
// const Review = require('./models/reviews'); 
const list=require("./routes/listings_routes.js");
const review_routes=require("./routes/reviews.js");
const user_route=require("./routes/user.js");
const session = require("express-session"); 
const MongoStore=require("connect-mongo")
const flash=require("express-flash");
const passport=require("passport");
const localstrategy=require("passport-local");
const user= require("./models/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.json());

  // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust", {
           
        // });
        const dbUrl=process.env.AtlasDb_Url;
       
        main()
        .then(()=>{
            console.log("connected to database");
        })
        .catch((err)=>{
            console.log(err);
        });

async function main(){
    await mongoose.connect(dbUrl);
}


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
secret:process.env.SECREAT,
},
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store",err);
});

const sessionoption={
    store,
    secret:process.env.SECREAT,
    resave:false,
    saveUninitialized: true,
    cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
    },
}



app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



      




app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.curruser=req.user;
    next();
})

app.use("/listing",list);
app.use("/listings/:id/reviews",review_routes);
app.use("/",user_route);

// app.all("*",(req,res,next)=>{
// next(new expresserror(404,"page not found.."));
// });

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errmsg = error.details.map((e1) => e1.message).join(",");
//         throw new expresserror(404, errmsg);
//     } else {
//         next();
//     }
// };




app.listen(port, () => {
    console.log(`${port} port is started`);
});

