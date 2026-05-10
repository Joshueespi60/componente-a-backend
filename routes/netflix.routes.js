import { Router } from 'express';
import {
  getAllNetflixCompanies,
  getNetflixCompanyById,
  postNetflixCompany,
  putNetflixCompany,
  deleteNetflixCompany,
  getNetflixCompaniesByCountry
} from '../controllers/netflix.controllers.js';

const router = Router();

router.get('/', getAllNetflixCompanies);
router.post('/', postNetflixCompany);
router.get('/pais/:pais', getNetflixCompaniesByCountry);
router.get('/:id', getNetflixCompanyById);
router.put('/:id', putNetflixCompany);
router.delete('/:id', deleteNetflixCompany);

export default router;
