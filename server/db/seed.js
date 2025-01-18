import db from './init.js';
import { v4 as uuidv4 } from 'uuid';

// Clear existing data
db.exec(`
  DELETE FROM sale_items;
  DELETE FROM sales;
  DELETE FROM appointments;
  DELETE FROM products;
  DELETE FROM services;
  DELETE FROM customers;
`);

// Add test customers
const customers = [
  { id: uuidv4(), name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { id: uuidv4(), name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' },
];

customers.forEach(customer => {
  db.prepare(`
    INSERT INTO customers (id, name, email, phone)
    VALUES (?, ?, ?, ?)
  `).run(customer.id, customer.name, customer.email, customer.phone);
});

// Add test services
const services = [
  { id: uuidv4(), name: 'Haircut', description: 'Basic haircut service', price: 30.00, duration: 30 },
  { id: uuidv4(), name: 'Manicure', description: 'Basic manicure service', price: 25.00, duration: 45 },
];

services.forEach(service => {
  db.prepare(`
    INSERT INTO services (id, name, description, price, duration)
    VALUES (?, ?, ?, ?, ?)
  `).run(service.id, service.name, service.description, service.price, service.duration);
});

// Add test products
const products = [
  { id: uuidv4(), name: 'Shampoo', description: 'Professional hair shampoo', price: 15.99, stock: 50 },
  { id: uuidv4(), name: 'Conditioner', description: 'Professional hair conditioner', price: 17.99, stock: 45 },
];

products.forEach(product => {
  db.prepare(`
    INSERT INTO products (id, name, description, price, stock)
    VALUES (?, ?, ?, ?, ?)
  `).run(product.id, product.name, product.description, product.price, product.stock);
});

console.log('Test data has been seeded successfully!');