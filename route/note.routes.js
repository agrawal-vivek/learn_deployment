const express=require("express")
const noteRouter=express.Router()
const{NoteModel}=require("../model/note.model")
const jwt=require("jsonwebtoken")

noteRouter.get("/",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"masai")
    try {
        if(decoded){
            const notes =await NoteModel.find({"userID":decoded.userID})
        res.status(200).send(notes)
        }else{
            res.status(400).send({"msg":"No note has been created by the user"})
        }
        
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }

})

noteRouter.post("/add",async(req,res)=>{
    try {
        const note=new NoteModel(req.body)
        await note.save()
        res.status(200).send({"msg":"A new Note has been added"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }


})

noteRouter.patch("/update/:noteID",async(req,res)=>{
    const payload=req.body
    const noteID=req.params.noteID
    try {
        await NoteModel.findByIdAndUpdate({_id:noteID},payload)
        res.status(200).send({"msg":"Note has been updated"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }

})

noteRouter.delete("/delete/:noteID",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"masai")
    const req_id=decoded.userID//The person who is making the delete request
    const note=NoteModel.findOne({_id:noteID})
    const user_ID_in_note=note.userID
    
    const noteID=req.params.noteID
    try {
        if(req_id==user_ID_in_note){
            await NoteModel.findByIdAndDelete({_id:noteID})
            res.status(200).send({"msg":"Note has been deleted"})
        }else{
            res.status(400).send({"msg":"Not Authorized"})
        }
        
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})



module.exports={
    noteRouter
}