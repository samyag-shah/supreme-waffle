import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { phone } = req.body
            const owner = await prisma.owner.findFirst({
                where : {
                    ownerPhone: phone
                }
            })

        if (owner) {
            const {ownerPhone, id} = owner
            const payload = {
                ownerId: id,
                ownerPhone,
                exp: Date.now()/1000 + 24*60*60
            } 
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "")
            res.json({status: 200, access_token: token, owner})
        } else {
            res.json({status: 404, message: "not found"})
        }
        } catch (err) {
            console.error(err)
            res.json({status: 500, message: "somthing went wrong"})
        }
    } else {
        res.json({status: 405, message: "Incorrect method"})
    }
}