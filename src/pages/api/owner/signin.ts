import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { createRouter } from "next-connect";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient()

const router = createRouter<NextApiRequest, NextApiResponse>()

router.use(async (req, res, next) => {
  //console.log({boxCricketId: req.query.boxCricketId})
  const validations = [
      body('phone').trim().notEmpty().withMessage("phone is required")
  ]
  await Promise.all(validations.map(validation => validation.run(req)))
  const errors = validationResult(req)
  const err: any[] = []
  errors.array().map((err1: any) => err.push({field: err1.slot, msg: err1.msg}))

  if (errors.isEmpty()) next()
  else res.status(422).json({status: 422, message: "bad request", err})
})

router.post(async (req, res) => {
    try {
        const { phone } = req.body
        const owner = await prisma.owner.findFirst({
            where : {
                ownerPhone: phone
            }
        })

        if (owner) {
            const {ownerPhone, id} = owner
            const payload = {
                ownerId: id,
                ownerPhone,
                exp: Date.now()/1000 + 1*60*60
            } 
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "")
            res.json({status: 200, token, owner})

        } else {
            res.json({status: 404, message: "owner not found"})
        }
    } catch (err) {
            console.error(err)
            res.json({status: 500, message: "somthing went wrong"})
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
