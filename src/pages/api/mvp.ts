import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


//all mvps
export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        const allMvps = await prisma.mvp.findMany();
  
        res.status(200).json(allMvps);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch MVPs' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }