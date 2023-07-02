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
      const newMvp = await prisma.mvp.create({ data: req.body });

      res.status(201).json(newMvp);
    } catch (error) {
      console.log(error)
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
          isAlive: req.body.isAlive,
          respawnTime: req.body.respawnTime
        }
      })
      res.status(201).json(updateMvp);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update MVP' });
      console.log(error)
    }

  } else if (req.method === 'DELETE') {

    try {
      
      const deleteMvp = await prisma.mvp.delete({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json(deleteMvp);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to delete MVP' });
    }

    
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}     