import express from 'express';
import db from '../db/init.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY name').all();
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/', (req, res) => {
  const { name, description, price, stock } = req.body;
  const id = uuidv4();
  
  try {
    db.prepare(
      'INSERT INTO products (id, name, description, price, stock) VALUES (?, ?, ?, ?, ?)'
    ).run(id, name, description, price, stock);
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  const { name, description, price, stock } = req.body;
  
  try {
    const info = db.prepare(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?'
    ).run(name, description, price, stock, req.params.id);
    
    if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.status(204).send();
});

export default router;