// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { createRouter } from 'next-connect'
import { body, validationResult } from 'express-validator'

// type Data = {
//   name: string
// }

const prisma = new PrismaClient()

const router = createRouter<NextApiRequest, NextApiResponse>()

router.use(async (req, res, next) => {
  //console.log({boxCricketId: req.query.boxCricketId})
  let validations 
  if (req.body.phone || req.body.phone === "") {
    validations = [
      body('username').trim().notEmpty().withMessage("username is required"),
      body('phone').trim().notEmpty().withMessage("phone is required"),
    ]
  } else if (req.body.email || req.body.email === "") {
    validations = [
      body('username').trim().notEmpty().withMessage("username is required"),
      body('email').trim().notEmpty().withMessage("email is required").isEmail().withMessage("Valid Email required"),
    ]
  } else {
    res.status(422).json({status: 422, message: "username and either phone or email required"})
  }
  
  if (validations) {
    await Promise.all(validations.map(validation => validation.run(req)))
    const errors = validationResult(req)
    const err: any[] = []
    errors.array().map((err1: any) => err.push({field: err1.slot, msg: err1.msg}))

    if (errors.isEmpty()) next()
    else res.status(422).json({status: 422, message: "bad request", err})
  }
  
})

router.post(async (req, res) => {
    const {username, email, phone} = req.body
    try {
      if (email) {
        const user = await prisma.user.findFirst({
          where: { email },
        })

        //user already exists
        if (user !== null){
          return res.status(409).json({status: 409, message: "user already exists"})  
        }

        //user does not already exists
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

      } else if (phone) {
        const user = await prisma.user.findFirst({
          where: { phone },
        })

        //user already exists
        if (user !== null){
          return res.status(409).json({status: 409, message: "user already exists"})  
        } 

        //user does not already exists
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
      } else {
        return res.status(422).json({status: 422, message: "bad request"})  
      }
    } catch(err: unknown){
      console.error({err})
      return res.status(500).json({status: 500, message : "something went wrong", err})
    } 
})

export default router.handler({
  onError: (err:unknown, req, res) => {
    //console.error(err.stack);
    //res.status(err.statusCode || 500).end(err.message);
    res.status(500).json({status: 500, message: "somwthing went wrong"});
  },
  onNoMatch: (req, res) => {
      res.status(405).json({status: 405, message: "no method found"});
  }
});
