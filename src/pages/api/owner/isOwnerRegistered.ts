import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method === "POST"){
        try {
          const {phone} = req.body
          //console.log(req.body)
          if(phone) {
            const owner = await prisma.owner.findFirst({
              where: { ownerPhone: phone },
            })
            console.log({owner})
            if (owner !== null){
              return res.status(200).json({status: 200, isRegistered: true})  
            }
            return res.status(200).json({status: 200, isRegistered: false})  
          } else {
            return res.status(200).json({status: 422, message: "Phone number is required"})  
          }            
        } catch(err: unknown){
          console.error({err})
          return res.status(500).json({message : "something went wrong", err})
        } 
      } else {
        return res.status(500).json({message : "Request Method is incorrect"})
      }
}