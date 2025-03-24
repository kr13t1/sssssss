import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Setup, Home, Layout, Online, Play, Error, Settings } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="setup" element={<Setup />} />
        <Route path="play" element={<Play />} />
        <Route path="online" element={<Online />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/*" element={<Error />} />
    </Routes>
  );
}

export default App;
