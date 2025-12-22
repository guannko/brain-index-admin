import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Overview from './pages/Overview';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          {/* TODO: Add client routes */}
          {/* <Route path="bots" element={<MyBots />} /> */}
          {/* <Route path="analytics" element={<Analytics />} /> */}
          {/* <Route path="support" element={<Support />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
