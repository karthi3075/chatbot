const express=require("express")
const Groq=require("groq-sdk")
const dotenv=require("dotenv")
const cors=require("cors")
const connectDB = require("./db")
const Store = require("./models/store")
dotenv.config()
const app=express() 

connectDB()
app.use(cors({
    origin:"https://chatbot2005.vercel.app"
}))
const groq=new Groq({
    apiKey:process.env.api_key   
})
app.use(express.json())
app.use(express.urlencoded())
app.post("/chat",async (req,res)=>{
    const message=req.body.message
    const response= await groq.chat.completions.create({
        model:"llama-3.3-70b-versatile",
        messages:[{
            role:"user",
            content:message
        }]
    })
    res.json({response:response.choices[0].message.content})
})

app.post("/store",async (req,res)=>{
    try{
        const data=new Store({
            question:req.body.question,
            answer:req.body.answer
        })
        await data.save()
        res.json({msg:"stored",status:true})
    }catch(error){
        res.json({msg:"not stored",status:false,error:error.message})
    }
})

app.listen(3000,()=>{
   console.log("server running") 
})