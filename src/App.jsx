import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import RegistrarObra from "./pages/RegistrarObra";
import Galeria from "./pages/Galeria";
import RutaProtegida from "./components/RutaProtegida";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Registro />} />
          <Route
            path="/dashboard"
            element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            }
          />
          <Route
            path="/registrar-obra"
            element={
              <RutaProtegida>
                <RegistrarObra />
              </RutaProtegida>
            }
          />
          <Route path="/galeria" element={<Galeria />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
