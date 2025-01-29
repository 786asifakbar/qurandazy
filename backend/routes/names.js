import express from 'express';
import { createName, getNames } from '../controllers/nameController.js';

const router = express.Router();

router.post('/', createName);
router.get('/', getNames);

export default router;