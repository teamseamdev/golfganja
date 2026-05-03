import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Episodes from "./pages/Episodes";
import Socials from "./pages/Socials";

import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/episodes" element={<Episodes />} />
        <Route path="/socials" element={<Socials />} />
      </Routes>
    </Router>
  );
}

export default App;