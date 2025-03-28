import { useEffect } from "react";
import * as d3 from "d3";
import Tooltip from "./Tooltip";
import Legend from "./Legend";

const HeatMap = () => {
  useEffect(() => {
    const width = 1000;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 100, left: 100 };

    const svg = d3
      .select("#heatmap")
      .attr("width", width)
      .attr("height", height);

    // Fetch the dataset
    d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    ).then((data) => {
      const dataset = data.monthlyVariance;
      const baseTemperature = data.baseTemperature;

      // Usamos scaleBand para el eje X, ya que tenemos años en un dominio no numérico
      const xScale = d3
        .scaleBand()
        .domain(dataset.map((d) => d.year))
        .range([margin.left, width - margin.right])
        .padding(0.05);

      const yScale = d3
        .scaleBand()
        .domain([
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ])
        .range([margin.top, height - margin.bottom])
        .padding(0.05);

      const colorScale = d3
        .scaleSequential(d3.interpolateCool)
        .domain([
          d3.min(dataset, (d) => baseTemperature + d.variance),
          d3.max(dataset, (d) => baseTemperature + d.variance),
        ]);

      // Dibujar los rectángulos para las celdas (mes/año)
      svg
        .selectAll(".cell")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", (d) => xScale(d.year)) // Escala para el eje X (año)
        .attr(
          "y",
          (d) => yScale(d3.timeFormat("%b")(new Date(d.year, d.month - 1))) // Mes
        )
        .attr("width", xScale.bandwidth()) // Ancho de las celdas con la escala de bandas
        .attr("height", yScale.bandwidth())
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => baseTemperature + d.variance)
        .style("fill", (d) => colorScale(baseTemperature + d.variance))
        .on("mouseover", function (event, d) {
          const month = d3.timeFormat("%B")(new Date(d.year, d.month - 1));
          const year = d.year;
          const temp = baseTemperature + d.variance;
          const tooltip = d3
            .select("#tooltip")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 25}px`)
            .attr("data-year", year)
            .html(`Year: ${year}<br>Month: ${month}<br>Temp: ${temp}°C`);
          tooltip.transition().style("opacity", 1);
        })
        .on("mouseout", function () {
          d3.select("#tooltip").transition().style("opacity", 0);
        });

      // Crear el eje X con ticks cada 10 años y formato adecuado
      svg
        .append("g")
        .attr("id", "x-axis")
        .call(
          d3
            .axisBottom(xScale)
            .tickValues(
              d3.range(
                d3.min(dataset, (d) => d.year),
                d3.max(dataset, (d) => d.year),
                10
              )
            )
            .tickFormat(d3.format("d")) // Muestra los años como números enteros
        )
        .attr("transform", `translate(0, ${height - margin.bottom})`);

      // Dibujar el eje Y
      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

      // Título
      svg
        .append("text")
        .attr("id", "title")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .text("Monthly Global Land-Surface Temperature");

      // Descripción
      svg
        .append("text")
        .attr("id", "description")
        .attr("x", width / 2)
        .attr("y", margin.top + 30)
        .attr("text-anchor", "middle")
        .text(
          "Temperature data from 1753 - 2015, with base temperature of 8.66°C"
        );
    });
  }, []);

  return (
    <div>
      <svg id="heatmap"></svg>
      <Tooltip />
      <Legend />
    </div>
  );
};

export default HeatMap;
