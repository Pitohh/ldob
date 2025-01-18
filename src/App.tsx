import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Appointments } from './pages/Appointments';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Services } from './pages/Services';
import { Sales } from './pages/Sales';
import { POS } from './pages/POS';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/pos" element={<POS />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;