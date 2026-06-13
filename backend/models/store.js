const mongoose=require("mongoose")
const storeSchema=new mongoose.Schema({
    question:String,
    answer:String
})
const Store=mongoose.model("Store",storeSchema)
module.exports=Store