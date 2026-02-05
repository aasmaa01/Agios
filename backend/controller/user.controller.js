import express from 'express'
import bcrypt from "bcrypt"
import {generateToken} from '../utils/generateToken.js'
import { prisma } from '../routes/config.js'


//signup user

export async function userSignup(req, res) {
    try{
        
        const {name, email, password} = req.body

        if(!name|| !email || !password){
            return res.status(400).json({error:"Tous les champs sont requis!"})
        }

        //check if user exist?
        const userExist= await prisma.user.findUnique({where:{email: email}})

        if( userExist){
            return res.status(400).json({error:"Cette email est déjà utilisée."})
        }

        const salt= await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password, salt);

        //create user
        const user= await prisma.user.create({
            data:{
                name, 
                email,
                password_hash: hashedPassword,
            },
        })

        //jwt token
        const token= generateToken(user.id, res)

        res.status(201).json({
            status: "success",
            data:{
                user:{
                    id: user.id,
                    name: user.name,
                    email:user.email,
                },
            }
        })
    } catch(error){
        console.error(error)
        return res.status(500).json({error: "Erreur serveur"})
    }
}


//login user 
export async function userLogin(req, res) {
    try {
        const {email, password}= req.body
        //check if email exist
        const user = await prisma.user.findUnique({where: {email: email}})

        if(!user){
            return res.status(401).json({error: "cet email n'existe pas!"})
        }

        //verify password
        const isPassValid= await bcrypt.compare(password, user.password_hash)

        if(!isPassValid){
            return res.status(401).json({error:"mot de passe invalide!"})
        }

        //generate jwt
        const token= generateToken(user.id, res)

        res.status(200).json({
            status:"success",
            data:{
                id:user.id,
                email:user.email,
            }
        })
        

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Erreur serveur!"})
    }

}


export async function userLogout(req, res) {
    res.cookie("jwt", "",{
        httpOnly: true,
        expires:new Date(0),
    })
    res.status(200).json({
        status:"success",
        message: "Logged Out Successfully"

    })
    
}