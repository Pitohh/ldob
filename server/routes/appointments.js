import express from 'express';
import db from '../db/init.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  const appointments = db.prepare(`
    SELECT 
      a.*,
      c.name as customer_name,
      s.name as service_name
    FROM appointments a
    LEFT JOIN customers c ON a.customer_id = c.id
    LEFT JOIN services s ON a.service_id = s.id
    ORDER BY date DESC
  `).all();
  res.json(appointments);
});

router.get('/:id', (req, res) => {
  const appointment = db.prepare(`
    SELECT 
      a.*,
      c.name as customer_name,
      s.name as service_name
    FROM appointments a
    LEFT JOIN customers c ON a.customer_id = c.id
    LEFT JOIN services s ON a.service_id = s.id
    WHERE a.id = ?
  `).get(req.params.id);
  
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
  res.json(appointment);
});

router.post('/', (req, res) => {
  const { customer_id, service_id, staff_id, date, status } = req.body;
  const id = uuidv4();
  
  try {
    db.prepare(
      'INSERT INTO appointments (id, customer_id, service_id, staff_id, date, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, customer_id, service_id, staff_id, date, status);
    
    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  const { customer_id, service_id, staff_id, date, status } = req.body;
  
  try {
    const info = db.prepare(
      'UPDATE appointments SET customer_id = ?, service_id = ?, staff_id = ?, date = ?, status = ? WHERE id = ?'
    ).run(customer_id, service_id, staff_id, date, status, req.params.id);
    
    if (info.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
    
    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM appointments WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
  res.status(204).send();
});

export default router;