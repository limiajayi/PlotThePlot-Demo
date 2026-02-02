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
            { x: 0, y: 0, width: innerWidth / 2, height: innerHeight / 2, label: "overhated",  color: "#fec789"},
            { x: innerWidth / 2, y: 0, width: innerWidth / 2, height: innerHeight / 2, label: "over",  color: "#94fd9d"},
            { x: 0, y: innerHeight / 2, width: innerWidth / 2, height: innerHeight / 2, label: "under",  color: "#ffa5a5"},
            { x: innerWidth / 2, y: innerHeight / 2, width: innerWidth / 2, height: innerHeight / 2, label: "overrated",  color:"#94a7f3"},
        ]

        // DRAWING BACKGROUND QUADRANTS
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
        .attr('opacity', 0.8);

        // quadrant labels
        g.selectAll('.quadrant-label')
        .data(quadrants)
        .enter()
        .append('text')
        .attr('class', 'quadrant-label')
        .attr('x', d => d.x + d.width / 2)
        .attr('y', d => d.y + d.height / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .style('fill', '#666')
        .style('font-weight', '500')
        .text(d => d.label);

        // DRAW AXES
        // ticks shows how many dividers there are on the line
        // in this case, 5
        const xAxis = d3.axisBottom(xScale).ticks(5); 
        const yAxis = d3.axisLeft(yScale).ticks(5);

        // X-axis at y=0 (at the center)
        g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${yScale(0)})`)
        .call(xAxis)
        .style('stroke-width', 1);

        // Y-axis at x=0 (at the center)
        g.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${xScale(0)}, 0)`) // switched because positive y goes down but ptp's positive y goes up
        .call(yAxis)
        .style('stroke-width', 1);

        // adding axis labels
        // good
        g.append('text')
        .attr('x', innerWidth - 5)
        .attr('y', yScale(0) - 10) //  positioned at (1, 0.1)
        .attr('text-anchor', 'end')
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .style('fill', '#666')
        .text('good');

        //bad
        g.append('text')
        .attr('x', 5)
        .attr('y', yScale(0) - 10)  //  positioned at (-1, 0.1)
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .style('fill', '#666')
        .text('bad');

        // liked it
        g.append('text')
        .attr('x', xScale(0) + 10)
        .attr('y', 15)
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .style('fill', '#666')
        .text('liked It');

        // disliked it
        g.append('text')
        .attr('x', xScale(0) + 10)
        .attr('y', innerHeight - 5) // so the text does not get cutoff
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .style('fill', '#666')
        .text('disliked It');

        // DRAWING THE RATINGS
        const colorScale = d3.scaleOrdinal<string>()
        .domain(['movie', 'book', 'show'])
        .range(['#2196F3', '#4CAF50', '#FF9800']);

        const circles = g.selectAll<SVGCircleElement, Ratings>('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.x_coordinate))
        .attr('cy', d => yScale(d.y_coordinate))
        .attr('r', 8)
        .attr('fill', d => colorScale(d.media.media_type))
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .style('opacity', 0.8)

        // ADD INTERACTIVITY
        // when you hover over a rating dot
        // the radius increases and it gets darker
        circles.on('mouseenter', function() {
            d3.select(this as SVGCircleElement)
            .transition()
            .duration(200)
            .attr('r', 12)
            .style('opacity', 1);
        }).on('mouseleave', function() {
            // when you leave the rating dot
            // it returns back to normal radius and opacity
            d3.select(this as SVGCircleElement)
            .transition()
            .duration(200)
            .attr('r', 8)
            .style('opacity', 0.8)
        })

        // TOOLTIP : To see movie name and coordinates!
        const tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px 12px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('opacity', 0);

        // Mount the tool tip when the mouse hovers over a rating dot
        circles.on('mousemove', function(event: MouseEvent, d: Ratings) {
            tooltip.style('opacity', 1)
            .html(`<p>${d.media.title}</p><br/>Coordinates: (${d.x_coordinate}, ${d.y_coordinate})`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
        }).on('mouseout', function() {
            tooltip.style('opacity', 0)
        });

        return () => {
            tooltip.remove();
        };


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