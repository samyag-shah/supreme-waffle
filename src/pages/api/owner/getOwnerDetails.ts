import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";
import type { JwtPayload } from "jsonwebtoken"

const prisma = new PrismaClient()

export default async function (req:NextApiRequest, res:NextApiResponse) {
    if (req.method === "POST") {
        
        const token = req.cookies.token
        //const token = req.headers.authorization?.split(" ")[1] || ""

        try {
            const decodeToken = jwt.verify(token || "", process.env.JWT_SECRET_KEY || "") as JwtPayload
            const id = decodeToken.ownerId
            const fetchOwner = await prisma.owner.findFirst({
                where: { id },
                include: {
                    Boxcrickets: true
                }
            })

            if (fetchOwner) {
                return res.status(200).json({status: 200, owner: fetchOwner})
            } else {
                res.status(404).json({status: 404, message: "not found"})
            }
            
        } catch (err: any) {
            console.error({err})
            if (err.name === "TokenExpiredError") {
                res.status(401).json({ status: 401, message: err.message})
            } else if (err.name === "JsonWebTokenError") {
                res.status(401).json({ status: 401, err})
            } else {
                res.status(500).json({ status: 500, err})
            }
        }
    } else {
        res.status(405).json({status: 405, message: "request method is incorrect"})
    }
}

