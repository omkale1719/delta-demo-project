const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("get route for posts");
});
router.get("/:id",(req,res)=>{
    res.send("get route for show");
});
router.post("/",(req,res)=>{
    res.send("post route for posts");
});
router.delete("/:id",(req,res)=>{
    res.send("delete route");
});

module.exports=router;