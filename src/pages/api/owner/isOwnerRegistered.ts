import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method === "POST"){
        try {
            console.log({body : req.body, headers : req.headers})
          const {phone} : 
          {phone: string} = req.body
          
            const owner = await prisma.owner.findFirst({
              where: { ownerPhone: phone },
            })
            console.log({owner})
            if (owner !== null){
              return res.status(200).json({isRegistered: true})  
            }
            return res.status(200).json({isRegistered: false})  
        } catch(err: unknown){
          console.error({err})
          return res.status(500).json({message : "something went wrong", err})
        } 
      } else {
        return res.status(500).json({message : "Request Method is incorrect"})
      }
}