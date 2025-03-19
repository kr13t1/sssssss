import { Route, Routes } from 'react-router-dom';

import './App.css';

import Layout from './pages/Layout';
import Home from './pages/home/Home';
import Bots from './pages/bots/Bots';
import Play from './pages/play/Play';
import BotField from './pages/play/Play';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="bots" element={<Bots />} />
        <Route path="play" element={<BotField />} />
      </Route>
    </Routes>
  );
}

export default App;
