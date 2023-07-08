import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';




export default async function mvpHandler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  if (req.method === 'GET') {
    try {
      const mvps = await prisma.mvp.findMany();

      res.status(200).json(mvps);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to fetch MVPs' });
    }


  } else if (req.method === 'POST') {
    try {
      const existingMvp = await prisma.mvp.findUnique({ where: { name: req.body.name } });
      if (existingMvp) {
        res.status(400).json({ error: 'MVP with the same name already exists' });
      } else {
        const newMvp = await prisma.mvp.create({ data: req.body });
        res.status(201).json(newMvp);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create MVP' });
    }


  } else if (req.method === 'PUT') {
    try {
      const updateMvp = await prisma.mvp.update({
        where: {
          id: req.body.id
        },
        data: {
          lastKillTime: req.body.lastKillTime,
          respawnTime: req.body.respawnTime,
          isAlive: req.body.isAlive,
          killerName: req.body.killerName
        }
      })
      res.status(201).json(updateMvp);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update MVP' });
      console.log(error)
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}     