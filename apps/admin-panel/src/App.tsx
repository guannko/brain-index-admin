import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* TODO: Add more routes */}
          {/* <Route path="bots" element={<Bots />} /> */}
          {/* <Route path="clients" element={<Clients />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
