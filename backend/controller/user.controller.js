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
                token,
            }
        })
    } catch(error){
        console.error(error)
        res.status(500).json({error: "Erreur serveur"})
    }
}
