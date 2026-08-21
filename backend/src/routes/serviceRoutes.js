import express from 'express';
import { ServiceRequest } from '../models/ServiceRequest.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const services = await ServiceRequest.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newService = new ServiceRequest(req.body);
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
