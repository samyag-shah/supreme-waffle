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
      const {phone} = req.body
      
        const user = await prisma.user.findFirst({
          where: { phone },
        })
        
        if (user !== null){
          return res.status(200).json({status: 200, isRegistered: true})  
        } 
        return res.status(200).json({status: 200, isRegistered: false})  
      
    } catch(err: unknown){
      console.error({err})
      return res.status(500).json({message : "something went wrong", err})
    } 
  } else {
    return res.status(500).json({message : "Request Method is incorrect"})
  }
}
