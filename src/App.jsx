import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
