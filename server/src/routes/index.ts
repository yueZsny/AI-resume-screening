import { Router } from 'express';


const router = Router();


router.get('/api', (_req, res) => {
  res.status(200).json({
    code: 200,  
    data: {
      message: 'Welcome to AI Resume Screening API',
      version: '1.0.0',
    },
   
  });
});
export default router;
