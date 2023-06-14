import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    if (req.method === "GET") {
        const boxCricketId = req.query.boxCricketId
        console.log({boxCricketId})
        try {
            const boxCricket = await prisma.boxcricket.findFirst({
                where: {id: boxCricketId as string}
            })
            res.json({status: 200, boxCricket})
        } catch (err) {
            console.error(err)
            res.json({status: 500, message: "something went wrong", err})
        }
    } else {
        res.json({status: 500, message: "Incorrect method"})
    }
}