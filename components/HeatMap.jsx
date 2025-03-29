import { useEffect, useState } from "react";
import * as d3 from "d3";
import Tooltip from "./Tooltip";
import Legend from "./Legend";

const HeatMap = () => {
  // Estado para almacenar datos y la temperatura base
  const [dataset, setDataset] = useState([]);
  const [baseTemperature, setBaseTemperature] = useState(null);

  useEffect(() => {
    const width = 1000;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 100, left: 100 };

    const svg = d3
      .select("#heatmap")
      .attr("width", width)
      .attr("height", height);

    // Fetch data
    d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    ).then((data) => {
      const dataset = data.monthlyVariance;
      const baseTemperature = data.baseTemperature;

      setDataset(dataset);
      setBaseTemperature(baseTemperature);

      // Escalas
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

      // Dibujar las celdas
      svg
        .selectAll(".cell")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", (d) => xScale(d.year))
        .attr("y", (d) =>
          yScale(d3.timeFormat("%b")(new Date(d.year, d.month - 1)))
        )
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => baseTemperature + d.variance)
        .style("fill", (d) => colorScale(baseTemperature + d.variance))
        .style("stroke", "none")
        .style("stroke-width", "2px")
        .on("mouseover", function (event, d) {
          d3.select(this).style("stroke", "black");

          const month = d3.timeFormat("%B")(new Date(d.year, d.month - 1));
          const year = d.year;
          const temp = baseTemperature + d.variance;

          d3.select("#tooltip")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 25}px`)
            .attr("data-year", year)
            .html(`Year: ${year}<br>Month: ${month}<br>Temp: ${temp}°C`)
            .transition()
            .style("opacity", 1);
        })
        .on("mouseout", function () {
          d3.select(this).style("stroke", "none");
          d3.select("#tooltip").transition().style("opacity", 0);
        });

      // Eje X
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
            .tickFormat(d3.format("d"))
        )
        .attr("transform", `translate(0, ${height - margin.bottom})`);

      // Eje Y
      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));
    });
  }, []);

  return (
    <div className="heatmap-container">
      {/* Gráfico y leyenda */}
      <svg id="heatmap"></svg>
      <Tooltip />
      {dataset.length > 0 && baseTemperature !== null && (
        <Legend
          colorScale={d3.scaleSequential(d3.interpolateCool)}
          minTemp={d3.min(dataset, (d) => baseTemperature + d.variance)}
          maxTemp={d3.max(dataset, (d) => baseTemperature + d.variance)}
        />
      )}
    </div>
  );
};

export default HeatMap;
