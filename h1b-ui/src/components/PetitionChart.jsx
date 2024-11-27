import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const PetitionChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const industryData = d3.rollup(data, v => ({
      continuingApproval: d3.sum(v, d => +d["Continuing Approval"]),
      continuingDenial: d3.sum(v, d => +d["Continuing Denial"]),
      initialApproval: d3.sum(v, d => +d["Initial Approval"]),
      initialDenial: d3.sum(v, d => +d["Initial Denial"]),
    }), d => d["Industry (NAICS) Code"]);

    const processedData = Array.from(industryData, ([industry, values]) => ({
      industry,
      ...values,
    }));

    const margin = { top: 20, right: 30, bottom: 150, left: 60 }; // Adjusted bottom margin
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    svg.selectAll('*').remove(); // Clear previous SVG elements

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(processedData.map(d => d.industry))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.continuingApproval + d.continuingDenial + d.initialApproval + d.initialDenial)])
      .nice()
      .range([height, 0]);

    chart.append('g')
      .call(d3.axisLeft(y));

    chart.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .text(d => (d.length > 20 ? `${d.substring(0, 20)}...` : d)) // Truncate text dynamically
      .append('title')
      .text(d => d);

    const barGroups = chart.selectAll('.bar-group')
      .data(processedData)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${x(d.industry)},0)`);

    barGroups.append('rect')
      .attr('x', 0)
      .attr('y', d => y(d.continuingApproval + d.continuingDenial))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.continuingApproval + d.continuingDenial))
      .attr('fill', '#69b3a2');

    // barGroups.append('rect')
    //   .attr('x', 0)
    //   .attr('y', d => y(d.continuingApproval))
    //   .attr('width', x.bandwidth())
    //   .attr('height', d => height - y(d.initialApproval))
    //   .attr('fill', '#ff9999');

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default PetitionChart;
