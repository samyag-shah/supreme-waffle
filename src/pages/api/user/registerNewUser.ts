// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

// type Data = {
//   name: string
// }

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  //res: NextApiResponse<Data>
  res: NextApiResponse
) {
  if(req.method === "POST"){
    try {
      const {username, email, phone} = req.body

      if (email) {
        const user = await prisma.user.findFirst({
          where: { email },
        })
        if (user !== null){
          return res.status(200).json({message: "user already exists"})  
        }
        const newUser = await prisma.user.create({
          data: {
            username,
            email,
            phone: "",
          } 
        })
        const payload = {
            username: newUser.username, 
            email: newUser.email,
            exp: Date.now()/1000 + 24*60*60
          }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "")
        return res.status(201).json({status : 201, newUser, token})
      } else {
        const newUser = await prisma.user.create({
          data: {
            username,
            phone,
            email: "",
          },
        })
        const payload = {
          username: newUser.username, 
          phone: newUser.phone,
          exp: Date.now()/1000 + 24*60*60
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "")
        return res.status(201).json({status : 201, newUser, token})
      } 
    } catch(err: unknown){
      console.error({err})
      return res.status(500).json({message : "something went wrong", err})
    } 
  } else {
    return res.status(500).json({message : "Request Method is incorrect"})
  }
}
