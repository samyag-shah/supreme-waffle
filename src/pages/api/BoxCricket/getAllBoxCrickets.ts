import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    if (req.method === "GET") {
        try {
            const boxCrickets = await prisma.boxcricket.findMany()
            res.json({status: 200, boxCrickets})
        } catch (err) {
            console.error(err)
            res.json({status: 500, message: "something went wrong", err})
        }
    } else {
        res.json({status: 500, message: "Incorrect method"})
    }
}