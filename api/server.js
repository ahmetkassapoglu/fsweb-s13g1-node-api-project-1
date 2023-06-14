// SUNUCUYU BU DOSYAYA KURUN
const { json } = require("express")
const express = require("express")
const server= express()
const userModel=require("./users/model.js")
server.get("/", function(req,res){
    res.send("Hello World")

})
server.post("./api/users",(req,res) =>{
    let {name,bio} =req.body;
    if(!name || !bio){
        res.status(400).json({message: "Lütfen kullanıcı için bir name ve bio sağlayın"})
    }
    else{
        let insertedUser = userModel.insert({name,bio}).then((insertedUser) =>{
            return insertedUser
        }).catch((error)=>{
            res.status(500).json({ message: "Veritabanına kaydedilirken bir hata oluştu" })
        })
        res.status(201).json(insertedUser)
    }

})

server.get("./api/users", async (req,res) =>{
    try {
        let allUsers = await userModel.find()
        res.json(allUsers)
    } catch (error) {
        res.status(500).json({message:"Kullanıcı bilgileri alınamadı"})
    }
})
server.get("./api/users/:id",async (req,res) =>{
    try {
        let showUser= await userModel.findById(req.params.id)
        if(!showUser){
            res.status(404).json( { message: "Belirtilen ID'li kullanıcı bulunamadı"})
        }
        else{
            res.json(showUser())  
        }
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" })
    }
})

server.delete("./api/users/:id", async(req,res) =>{
try {
    let user = await userModel.findById(req.params.id)
    if(!user){
        res.status(404).json({message:"Belirtilen ID li kullanıcı bulunamadı"})
    }
    else{
        await userModel.remove(req.params.id)
        res.json(user)
    }
} catch (error) {
    res.status(500).json({ message: "Kullanıcı silinemedi" })
}
})

server.put("/api/users/:id", async (req,res) => {
    try {
        let user = await userModel.findById(req.params.id)
        if (!user){
            res.status(404).json({ message: "Belirtilen ID'li kullanıcı bulunamadı" })
        }
        else{
            let {name,bio} = req.body
            if (!name || !bio){
                res.status(400).json({ message: "Lütfen kullanıcı için name ve bio sağlayın" })
            }
            else {
                let updated = userModel.update(req.params.id , {name,bio})
                res.json(updated)
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi" })
    }

})
module.exports = server // SERVERINIZI EXPORT EDİN {}
