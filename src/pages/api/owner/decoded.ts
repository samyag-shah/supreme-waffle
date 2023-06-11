import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    if (req.method === "POST") {
        try {
            const token = req.headers.authorization?.split(" ")[1] || ""
        //     const { phone } = req.body
        //     const fetchedUser = await prisma.owner.findFirst({
        //         where : {
        //             phone
        //         }
        //     })
        // if(fetchedUser){
        //     const {ownername, email} = fetchedUser
        //     //Jwt.sign(payload, secretOrPrivateKey, [options, callback])
        //     const payload = {
        //         phone, 
        //         ownername, 
        //         email,
        //         exp: 1000*100
        //     } 
            //const token = jwt.sign(payload, 'sss')
            const res1 = jwt.verify(token, 'sss')
            
            //console.log({token})
            res.json({status: 200, res1})
        //}
        
        } catch (err) {
            console.error(err)
            res.json({status: 500, message: "something went wrong", err})
        }
        

    } else {
        res.json({status: 500, message: "Incorrect method"})
    }
}