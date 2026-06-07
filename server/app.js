const express=require('express');
const app=express();
app.get('/',(_,res)=>res.json({status:'ok'}));
app.listen(5000);
