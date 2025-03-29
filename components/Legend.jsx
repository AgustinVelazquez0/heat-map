import * as d3 from "d3";
import React, { useEffect } from "react";

const Legend = ({ colorScale, minTemp, maxTemp }) => {
  useEffect(() => {
    const width = 600;
    const height = 60;

    const svg = d3
      .select("#legend")
      .attr("width", width)
      .attr("height", height);

    // Crear una escala de colores para la leyenda
    const colorScaleRange = d3
      .scaleSequential(d3.interpolateCool)
      .domain([minTemp, maxTemp]);

    // Agregar los rectángulos de color para la leyenda
    svg
      .append("g")
      .selectAll("rect")
      .data(d3.range(minTemp, maxTemp, (maxTemp - minTemp) / 15)) // Aumentamos la cantidad de divisiones
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * (width / 15)) // Aumentamos el número de divisiones
      .attr("width", width / 15) // Ancho de cada rectángulo
      .attr("height", 20)
      .style("fill", (d) => colorScaleRange(d));

    // Agregar los números debajo de los rectángulos de color
    svg
      .append("g")
      .selectAll("text")
      .data(d3.range(minTemp, maxTemp, (maxTemp - minTemp) / 15)) // Mantener el rango aumentado
      .enter()
      .append("text")
      .attr("x", (d, i) => i * (width / 15) + width / 30)
      .attr("y", height - 5) // Colocar los números debajo de la leyenda
      .attr("text-anchor", "middle")
      .text((d) => d.toFixed(1)); // Mostrar las temperaturas con un decimal
  }, [colorScale, minTemp, maxTemp]);

  return <svg id="legend"></svg>;
};

export default Legend;
