import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function (req:NextApiRequest, res:NextApiResponse) {
    if(req.method === "POST"){
        const {phone, email} = req.body
        if (phone) {
            const user = await prisma.user.findFirst({
                where: { phone },
            })
            if (user === null){
                return res.status(404).json({status: 404, message: "user does not exists"})  
            }
            const payload = {
                username: user.username, 
                phone: user.phone,
                exp: Date.now()/1000 + 24*60*60
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "")
            return res.status(200).json({status: 200, user, token})  
        }
        else if (email) {
            const user = await prisma.user.findFirst({
                where: { email },
            })
            if (user === null){
                return res.status(404).json({status: 404, message: "user does not exists"})  
            }
            const payload = {
                username: user.username, 
                phone: user.email,
                exp: Date.now()/1000 + 24*60*60
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "")
            return res.status(200).json({status: 200, user, token})  
        } else {
            return res.status(422).json({status: 422})  
        }
    } else {
        res.json({statu: 405, message: "method is not allowed"})
    }
} 

