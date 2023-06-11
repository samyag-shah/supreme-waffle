// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Method } from '@prisma/client'

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
      const {username, email, phone, loginMethod} : 
      {username: string, email: string, phone: string, loginMethod: Method}= req.body

      if(loginMethod === "Email"){
        const user = await prisma.user.findFirst({
          where: { email },
        })
        if(user !== null){
          return res.status(200).json({message: "user already exists"})  
        }
        const newUser = await prisma.user.create({
          data: {
            username,
            email,
            phone: "",
            //loginMethod: Method[loginMethod as keyof typeof Method],
            loginMethod
          } 
        })
        return res.status(201).json({method : req.method, body: newUser})
      } else if(loginMethod === "Phone") {
        // const user = await prisma.user.findFirst({
        //   where: { phone },
        // })
        // if (user !== null){
        //   return res.status(200).json({isRegistered: "User is already registered"})  
        // }
        const newUser = await prisma.user.create({
          data: {
            username,
            phone,
            email: "",
            //loginMethod: Method[loginMethod as keyof typeof Method],
            loginMethod
          },
        })
        return res.status(201).json({method : req.method, body: newUser})
      } else {
        return res.status(500).json({message : "Login Method is incorrect"})
      }
    } catch(err: unknown){
      console.error({err})
      return res.status(500).json({message : "something went wrong", err})
    } 
  } else {
    return res.status(500).json({message : "Request Method is incorrect"})
  }
}
