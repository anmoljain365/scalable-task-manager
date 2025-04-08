import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes later */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;