import express from 'express';
import db from '../db/init.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all customers
router.get('/', (req, res) => {
  const customers = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
  res.json(customers);
});

// Get customer by ID
router.get('/:id', (req, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
});

// Create customer
router.post('/', (req, res) => {
  const { name, email, phone } = req.body;
  const id = uuidv4();
  
  try {
    const info = db.prepare(
      'INSERT INTO customers (id, name, email, phone) VALUES (?, ?, ?, ?)'
    ).run(id, name, email, phone);
    
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update customer
router.put('/:id', (req, res) => {
  const { name, email, phone } = req.body;
  
  try {
    const info = db.prepare(
      'UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?'
    ).run(name, email, phone, req.params.id);
    
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete customer
router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  res.status(204).send();
});

export default router;