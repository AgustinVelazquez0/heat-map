// src/App.jsx
import HeatMap from "../components/HeatMap";
import "./App.css"; // Importa el archivo CSS para estilos

function App() {
  return (
    <div>
      <h1 id="title">Global Temperature Heat Map</h1>
      <p id="description">Monthly Global Temperature Variations (1754-2015)</p>
      <HeatMap />
    </div>
  );
}

export default App;
