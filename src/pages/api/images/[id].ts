import { NextApiRequest, NextApiResponse } from "next"
import * as fs from 'node:fs/promises';
import path from "node:path";

export default async function (req:NextApiRequest, res:NextApiResponse) {
    //const id = req.query.id
    const fileName = req.query.id
    //if(fileName) {
        const file = await fs.readFile(path.join("src", "pages", "api", "uploads", "/", fileName as string))
    //}
    

    res.setHeader('Content-Type', 'image/png')
    res.send(file)
}