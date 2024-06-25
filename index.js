// let express = require("express");
// let app=express();

// app.get('/getHello',(req,res)=>{
//     res.send("hello");
// });

// app.listen(5000,(err)=>{
//     if(!err){
//         console.log("server running on 9005")
//     }
// });
// let express = require("express");
// let app=express();

// app.use(express.json());
// let product =[]

// app.post('/createproduct',(req,res)=>{

//     let obj=req.body;
//     obj.id =product.length+1
//     product.push(obj)
//     console.log(product)

//     res.send({
//         msg:"product added successfully"
//     })
// });
// app.get('/getproduct',(req,res)=>{
//     res.send(product)
// })
// //->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// //query http://localhost:8000/hello?name=het&age=18
// app.get('/hello',(req,res)=>{
//     console.log(req.query)
//     let name=req.query.name
//     res.send("hello"+name)
// })

// // param http://localhost:8000/hello/het
// app.get('/hello/:name',(req,res)=>{
//     console.log(req.params)
//     let name=req.params.name
//     res.send("hello"+name)
// })

// app.listen(8000,(err)=>{
//     console.log("port start on",8000)
// });


const { config } = require("dotenv");
let express = require("express");
let app = express();
require('dotenv').config();

//to convert data in JSON format which is coming from frontend
app.use(express.json());

//create array for store products
let products = [];

app.post('/CreateProduct', (req, res) => {
    //req.body is for 
    let obj = req.body;
    //For unique ID
    obj.id = products.length + 1;
    //set and add flag to soft delete logic. 
    obj.isDeleted = false;
    //To push in array
    products.push(obj);
    //To print all products in array
    console.log(products)
    res.status(201).send({
        msg: "Product added Successfully"
    })

})
//to get the data{
app.get("/getproduct", (req, res) => {
    try {
        //res.send(products);
        let NotDeleted = products.filter((val) => {
            if (val.isDeleted == false) {
                return true
            }
        })
        res.status(200).send(NotDeleted)
    }catch(err){
        res.status(500).send("internal error")
    }

    })

app.put("/updateproduct", (req, res) => {
    try{
    let id = req.query.id; //id aave che
    let obj = req.body; // je update karvanu che a aave che 
    let searchProduct = products.find((val) => {
        if (val.id == id) {
            return true
        }
    });  //je id aae che query ma a sodhi ne aave che

    if (searchProduct.isDeleted == true) {
        res.status(404).send({
            msg: "Product Not Found"
        })
    }
    else {
        searchProduct.ProductName = obj.ProductName ? obj.ProductName : searchProduct.ProductName;
        searchProduct.Cost = obj.Cost ? obj.Cost : searchProduct.Cost;
        searchProduct.ProductDescription = obj.ProductDescription ? obj.ProductDescription : searchProduct.ProductDescription;
        //to respons on postman
        res.status(201).send({
            msg: "Product Updated Successfully"
        })
    }
}catch(err){
    console.log(err)
    res.status(500).send("internal error")
}
})

app.delete("/SoftDeleteProduct", (req, res) => {
    try{
    let id = req.query.id;
    let searchProduct = products.find((val) => (val.id == id));
    searchProduct.isDeleted = true;

    res.status(200).send({
        msg: "Product deleted Successfully"
    })
}catch(err){
    res.status(500).send("internal error")
}
})
app.get("/SortProduct",(req,res)=>{
    let order =req.query.sort
    let sorted; 

    if(order=="asc"){
        sorted =products.sort((a,b)=>{
            return a.Cost-b.Cost
        })
    }else if(order=="dec"){
        sorted = products.sort((a,b)=>{
            return b.Cost-a.Cost
        })
    }else{
        res.status(404).send("order not found")
    }
    console.log(sorted)
    
})

app.listen(process.env.PORT, (err) => {
    if (!err) {
        console.log("server running on port "+ process.env.PORT);
    }
})