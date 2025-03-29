// src/App.jsx
import HeatMap from "../components/HeatMap";
import "./App.css";

function App() {
  return (
    <div className="header-container">
      <h1 className="title">Global Temperature Heat Map</h1>
      <p className="description">
        Monthly Global Temperature Variations (1754-2015)
      </p>
      <HeatMap />
    </div>
  );
}

export default App;
