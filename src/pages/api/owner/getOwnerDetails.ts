import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";
import type { JwtPayload } from "jsonwebtoken"

const prisma = new PrismaClient()

export default async function (req:NextApiRequest, res:NextApiResponse) {
    if(req.method === "POST") {
        const token = req.headers.authorization?.split(" ")[1] || ""
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as JwtPayload
        
        let id = decodeToken.ownerId
        
        const fetchOwner = await prisma.owner.findFirst({
            where: { id },
            include: {
                Boxcrickets: true
            }
          })
        res.json({status: 200, owner: fetchOwner})
    } else {
        res.json({status: 400, "message": "request method is incorrect"})
    }
}

