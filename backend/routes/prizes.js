import express from 'express';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// In-memory storage (replace with database in production)
let prizes = [
  {
    id: 1,
    name: 'Sample Prize',
    image: 'uploads/sample-image.jpg',
  },
];

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Get all prizes
router.get('/api/prizes', (req, res) => {
  try {
    res.json(prizes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prizes' });
  }
});

// Get single prize
router.get('/api/prizes/:id', (req, res) => {
  try {
    const prize = prizes.find(p => p.id === parseInt(req.params.id));
    if (!prize) return res.status(404).json({ error: 'Prize not found' });
    res.json(prize);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prize' });
  }
});

// Create new prize
router.post('/api/prizes', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const newPrize = {
      id: Date.now(),
      name: req.body.name,
      image: req.file.path,
    };

    prizes.push(newPrize);
    res.status(201).json(newPrize);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create prize' });
  }
});

// Update prize
router.put('/api/prizes/:id', upload.single('image'), (req, res) => {
  try {
    const prizeIndex = prizes.findIndex(p => p.id === parseInt(req.params.id));
    if (prizeIndex === -1) return res.status(404).json({ error: 'Prize not found' });

    const updatedPrize = {
      ...prizes[prizeIndex],
      name: req.body.name || prizes[prizeIndex].name,
    };

    if (req.file) {
      // Delete old image
      fs.unlinkSync(prizes[prizeIndex].image);
      updatedPrize.image = req.file.path;
    }

    prizes[prizeIndex] = updatedPrize;
    res.json(updatedPrize);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prize' });
  }
});

// Delete prize
router.delete('/api/prizes/:id', (req, res) => {
  try {
    const prizeIndex = prizes.findIndex(p => p.id === parseInt(req.params.id));
    if (prizeIndex === -1) return res.status(404).json({ error: 'Prize not found' });

    // Delete associated image
    fs.unlinkSync(prizes[prizeIndex].image);
    
    prizes = prizes.filter(p => p.id !== parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prize' });
  }
});

export default router;