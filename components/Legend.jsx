// src/components/Legend.jsx
import * as d3 from "d3";
import React, { useEffect } from "react";

const Legend = () => {
  useEffect(() => {
    const width = 200;
    const height = 20;

    const svg = d3
      .select("#legend")
      .attr("width", width)
      .attr("height", height);

    const colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, 1]);

    // Add the legend scale
    svg
      .append("g")
      .selectAll("rect")
      .data(d3.range(0, 1, 0.1))
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * (width / 10))
      .attr("width", width / 10)
      .attr("height", height)
      .style("fill", (d) => colorScale(d));
  }, []);

  return <svg id="legend"></svg>;
};

export default Legend;
