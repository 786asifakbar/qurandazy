import Name from '../models/Name.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage }).single('image');

export const createName = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    
    try {
      const newName = new Name({
        name: req.body.name,
        image: req.file.path
      });
      
      await newName.save();
      res.status(201).json(newName);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

export const getNames = async (req, res) => {
  try {
    const names = await Name.find();
    res.json(names);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const drawRandomName = async () => {
  const count = await Name.countDocuments();
  if (count === 0) return null;
  
  const random = Math.floor(Math.random() * count);
  const name = await Name.findOne().skip(random);
  await Name.findByIdAndDelete(name._id);
  return name;
};