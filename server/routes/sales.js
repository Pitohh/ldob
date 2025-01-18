import express from 'express';
import db from '../db/init.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  const sales = db.prepare(`
    SELECT 
      s.*,
      c.name as customer_name
    FROM sales s
    LEFT JOIN customers c ON s.customer_id = c.id
    ORDER BY created_at DESC
  `).all();
  
  const salesWithItems = sales.map(sale => {
    const items = db.prepare(`
      SELECT 
        si.*,
        p.name as product_name
      FROM sale_items si
      LEFT JOIN products p ON si.product_id = p.id
      WHERE si.sale_id = ?
    `).all(sale.id);
    
    return { ...sale, items };
  });
  
  res.json(salesWithItems);
});

router.get('/:id', (req, res) => {
  const sale = db.prepare(`
    SELECT 
      s.*,
      c.name as customer_name
    FROM sales s
    LEFT JOIN customers c ON s.customer_id = c.id
    WHERE s.id = ?
  `).get(req.params.id);
  
  if (!sale) return res.status(404).json({ error: 'Sale not found' });
  
  const items = db.prepare(`
    SELECT 
      si.*,
      p.name as product_name
    FROM sale_items si
    LEFT JOIN products p ON si.product_id = p.id
    WHERE si.sale_id = ?
  `).all(sale.id);
  
  res.json({ ...sale, items });
});

router.post('/', (req, res) => {
  const { customer_id, total, payment_method, items } = req.body;
  const id = uuidv4();
  
  try {
    db.prepare(
      'INSERT INTO sales (id, customer_id, total, payment_method) VALUES (?, ?, ?, ?)'
    ).run(id, customer_id, total, payment_method);
    
    items.forEach(item => {
      db.prepare(
        'INSERT INTO sale_items (id, sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)'
      ).run(uuidv4(), id, item.product_id, item.quantity, item.price);
      
      // Update product stock
      db.prepare(
        'UPDATE products SET stock = stock - ? WHERE id = ?'
      ).run(item.quantity, item.product_id);
    });
    
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  
  try {
    const info = db.prepare(
      'UPDATE sales SET status = ? WHERE id = ?'
    ).run(status, req.params.id);
    
    if (info.changes === 0) return res.status(404).json({ error: 'Sale not found' });
    
    if (status === 'refunded') {
      // Return items to stock
      const items = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(req.params.id);
      items.forEach(item => {
        db.prepare(
          'UPDATE products SET stock = stock + ? WHERE id = ?'
        ).run(item.quantity, item.product_id);
      });
    }
    
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(req.params.id);
    res.json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;