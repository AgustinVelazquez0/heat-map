// src/components/Tooltip.jsx
const Tooltip = () => {
  return (
    <div
      id="tooltip"
      style={{
        position: "absolute",
        opacity: 0,
        pointerEvents: "none",
        backgroundColor: "#fff",
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    ></div>
  );
};

export default Tooltip;
