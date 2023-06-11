import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { phone } = req.body
            const fetchedUser = await prisma.owner.findFirst({
                where : {
                    ownerPhone: phone
                }
            })
        if(fetchedUser){
            const {ownerName, ownerEmail, ownerPhone} = fetchedUser
            const payload = {
                ownerName, ownerEmail, ownerPhone,
                exp: Date.now()/1000 + 1*60
            } 
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "")
            res.json({status: 200, access_token: token, user: {ownerName, ownerEmail, ownerPhone}})
        } else {
            res.json({status: 500, message: "no user found"})
        }
        } catch (err) {
            console.error(err)
            res.json({status: 500, message: "somthing wnetn wrong"})
        }
        

    } else {
        res.json({status: 500, message: "Incorrect method"})
    }
}