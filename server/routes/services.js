import express from 'express';
import db from '../db/init.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  const services = db.prepare('SELECT * FROM services ORDER BY name').all();
  res.json(services);
});

router.get('/:id', (req, res) => {
  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

router.post('/', (req, res) => {
  const { name, description, price, duration } = req.body;
  const id = uuidv4();
  
  try {
    db.prepare(
      'INSERT INTO services (id, name, description, price, duration) VALUES (?, ?, ?, ?, ?)'
    ).run(id, name, description, price, duration);
    
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  const { name, description, price, duration } = req.body;
  
  try {
    const info = db.prepare(
      'UPDATE services SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?'
    ).run(name, description, price, duration, req.params.id);
    
    if (info.changes === 0) return res.status(404).json({ error: 'Service not found' });
    
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Service not found' });
  res.status(204).send();
});

export default router;