import { Router } from 'express';
import netflixRoutes from './netflix.routes.js';

const indexRoutes = Router();

indexRoutes.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Netflix Backend funcionando correctamente',
    endpoints: {
      netflix: '/api/netflix'
    }
  });
});

indexRoutes.use('/netflix', netflixRoutes);

export default indexRoutes;
