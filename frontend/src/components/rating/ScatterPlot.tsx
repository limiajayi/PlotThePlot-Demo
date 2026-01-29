import { useEffect, useRef } from "react";
import type { Ratings } from "../../types/ratings.types";
import * as d3 from 'd3';

type ScatterPlotProps = {
    data: Ratings[]
};

// the type of single quadrants: over, overhated, overrated
type Quadrant = {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    color: string;
};

const ScatterPlot = ({ data }: ScatterPlotProps) => {
    if (!data) <div>Placeholder graph!!!!</div>;


    const svgRef = useRef<SVGSVGElement>(null); // useRef to control the svg DOM element

    useEffect(() => {

        if (!data || data.length === 0) return;

        // the actual graph is a smaller box within the svg element 
        // svg is 600 by 600
        // actual graph is 500 by 500
        const width: number = 600;
        const height: number = 600;
        const margin = { top: 40, right: 40, bottom: 60, left: 60 };
        const innerWidth: number = width - margin.left - margin.right;
        const innerHeight: number = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);

        // whatever was there before, throw it out
        svg.selectAll('*').remove();

        const g = svg.append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // since the x px is actually from 0 to 500 in the svg
        // we need a way to transform the x axis from [-1, 1] to [0, 500]
        // which is what scaleLinear + defining domain and range does
        const xScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([0, innerWidth]);

        // the reason why y's range is in reverse: 
        // positive y goes down in an svg element
        // but ptp positive y goes up
        const yScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([innerHeight, 0])

        const quadrants: Quadrant[] = [
            { x: 0, y: 0, width: innerWidth / 2, height: innerHeight / 2, label: "Overhated",  color: "#fec789"},
            { x: innerWidth / 2, y: 0, width: innerWidth / 2, height: innerHeight / 2, label: "Over",  color: "#94fd9d"},
            { x: 0, y: innerHeight / 2, width: innerWidth / 2, height: innerHeight / 2, label: "Under",  color: "#ffa5a5"},
            { x: innerWidth / 2, y: innerHeight / 2, width: innerWidth / 2, height: innerHeight / 2, label: "Overrated",  color:"#94a7f3"},
        ]

        // drawing quadrants
        g.selectAll('.quadrant')
        .data(quadrants)
        .enter()
        .append('rect')
        .attr('class', 'quadrant')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .attr('fill', d => d.color)
        .attr('opacity', 0.4)

        // quadrant labels
        g.selectAll('.quadrant-label')
        .data(quadrants)
        .enter()
        .append('text')
        .attr('class', 'quadrant-label')
        .attr('x', d => d.x + d.width / 3)
        .attr('y', d => d.y + d.height / 2)
        .attr('opacity', 0.5)
        .text(d => d.label)



    }, [data])

    return (
        <div>
            The graph!!!
            <svg 
                ref={svgRef}
                width={600}
                height={600}
                style={{ borderRadius: '8px' }}
            />
        </div>
    );
};

export default ScatterPlot;