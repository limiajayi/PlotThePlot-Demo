import { useEffect, useRef, useState } from "react";
import type { Ratings } from "../../types/ratings.types";
import * as d3 from 'd3';
import styles from '../../styles/ScatterPlot.module.css';

type ScatterPlotProps = {
    data: Ratings[];
    onCoordinateClick?: (x: number, y:number) => void;
    onDotHover: (ratings: Ratings | null) => void;
};

// the type of single quadrants: over, overhated, overrated, under
type Quadrant = {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    color: string;
};

// Tooltip state — null means hidden
type TooltipState = {
    x: number;
    y: number;
    rating: Ratings;
} | null;

const getCssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// Dot style per media type: colour + distinct stroke treatment
const DOT_STYLES: Record<string, { fill: string; stroke: string; strokeWidth: number; strokeDasharray: string }> = {
    movie: { fill: '#2196F3', stroke: '#ffffff', strokeWidth: 2, strokeDasharray: 'none' },  // solid border
    book:  { fill: '#4CAF50', stroke: '#ffffff', strokeWidth: 3, strokeDasharray: 'none'  },  // dashed border
    show:  { fill: '#FF9800', stroke: '#ffffff', strokeWidth: 4, strokeDasharray: 'none' },  // thick solid ring
};

// TODO: What happens when a user has no ratings... empty svg 

const ScatterPlot = ({ data, onCoordinateClick, onDotHover }: ScatterPlotProps) => {

    const svgRef = useRef<SVGSVGElement>(null); // useRef to control the svg DOM element
    const [tooltip, setTooltip] = useState<TooltipState>(null);

    useEffect(() => {

        //if (!data || data.length === 0) return;

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
                    .attr('transform', `translate(${margin.left}, ${margin.top})`)
                    .style('cursor', 'crosshair');

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
            { x: 0, y: 0, width: innerWidth / 2, height: innerHeight / 2, label: "overhated",  color: getCssVar('--orange')},
            { x: innerWidth / 2, y: 0, width: innerWidth / 2, height: innerHeight / 2, label: "over",  color: getCssVar('--green')},
            { x: 0, y: innerHeight / 2, width: innerWidth / 2, height: innerHeight / 2, label: "under",  color: getCssVar('--red')},
            { x: innerWidth / 2, y: innerHeight / 2, width: innerWidth / 2, height: innerHeight / 2, label: "overrated",  color: getCssVar('--blue')},
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
        g.selectAll(`quadrant-label ${styles.quadrantLabel}`)
        .data(quadrants)
        .enter()
        .append('text')
        .attr('class', `quadrant-label ${styles.quadrantLabel}`)
        .attr('x', d => d.x + d.width / 2)
        .attr('y', d => d.y + d.height / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '18px')
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
        .style('stroke-width', 1)
        .style('opacity', 0.85);

        // Y-axis at x=0 (at the center)
        g.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${xScale(0)}, 0)`) // switched because positive y goes down but ptp's positive y goes up
        .call(yAxis)
        .style('stroke-width', 1)
        .style('opacity', 0.85);

        // adding axis labels
        // good
        g.append('text')
        .attr('x', innerWidth - 5)
        .attr('y', yScale(0) - 10) //  positioned at (1, 0.1)
        .attr('text-anchor', 'end')
        .attr('class', `${styles.axisLabel}`)
        .text('good');

        //bad
        g.append('text')
        .attr('x', 5)
        .attr('y', yScale(0) - 10)  //  positioned at (-1, 0.1)
        .attr('text-anchor', 'start')
        .attr('class', `${styles.axisLabel}`)
        .text('bad');

        // liked it
        g.append('text')
        .attr('x', xScale(0) + 10)
        .attr('y', 15)
        .attr('text-anchor', 'start')
        .attr('class', `${styles.axisLabel}`)
        .text('liked It');

        // disliked it
        g.append('text')
        .attr('x', xScale(0) + 10)
        .attr('y', innerHeight - 5) // so the text does not get cutoff
        .attr('text-anchor', 'start')
        .attr('class', `${styles.axisLabel}`)
        .text('disliked It');

        // // DRAWING THE RATINGS
        // const colorScale = d3.scaleOrdinal<string>()
        // .domain(['movie', 'book', 'show'])
        // .range(['#2196F3', '#4CAF50', '#FF9800']);

        const circles = g.selectAll<SVGCircleElement, Ratings>(`.dot ${styles.dot}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.x_coordinate))
        .attr('cy', d => yScale(d.y_coordinate))
        .attr('r', 8)
        .attr('fill',             d => DOT_STYLES[d.media.media_type]?.fill         ?? '#888')
        .attr('stroke',           d => DOT_STYLES[d.media.media_type]?.stroke       ?? '#fff')
        .attr('stroke-width',     d => DOT_STYLES[d.media.media_type]?.strokeWidth  ?? 2)
        .attr('stroke-dasharray', d => DOT_STYLES[d.media.media_type]?.strokeDasharray ?? 'none')
        .style('cursor', 'pointer')
        .style('opacity', 0.85);

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
            .style('opacity', 0.85);
            setTooltip(null);
        });

        // Mount the tool tip when the mouse hovers over a rating dot
        circles
        .on('mousemove', function(event: MouseEvent, d: Ratings) {
            setTooltip({ x: event.clientX + 14, y: event.clientY - 14, rating: d });
        })
        .on('mouseout', function() {
            setTooltip(null);
        })
        .on('click', function(event, d: Ratings) {
            event.stopPropagation();
            
            if (onDotHover && onCoordinateClick) {
                onCoordinateClick(d.x_coordinate, d.y_coordinate);
                onDotHover(d);
                setTooltip(null);
            };
        });

        // to add a new rating
        svg.on('click', function(event) {
                // get mouse position relative to SVG
                const [mouseX, mouseY] = d3.pointer(event, this);

                // convert pixel coordinates to rating coordinates
                const ratingX = xScale.invert(mouseX - margin.left);
                const ratingY = yScale.invert(mouseY - margin.top);

                // clamp range from -1 to 1
                const clampedX = Math.max(-1, Math.min(1, ratingX));
                const clampedY = Math.max(-1, Math.min(1, ratingY));

                // round to 2 decimal places
                const x = Math.round(clampedX * 100) / 100;
                const y = Math.round(clampedY * 100) / 100;

                // tell the parent component about the click
                if (onCoordinateClick) {
                    onCoordinateClick(x, y);
                }
            }
        )


    }, [data, onCoordinateClick, onDotHover])

    return (
        <div>
            
            <svg 
                className={styles.wrapper}
                ref={svgRef}
                width={600}
                height={600}
            />

            {tooltip && (
                <div 
                    className={`${styles.tooltip} ${styles.visible}`}
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    <span className={styles.tooltipTitle}>
                        {tooltip.rating.media.title}
                    </span>
                    <span className={styles.tooltipCoords}>
                        ({tooltip.rating.x_coordinate}, {tooltip.rating.y_coordinate})
                    </span>
                    <span className={`${styles.tooltipType} ${styles[tooltip.rating.media.media_type]}`}>
                        {tooltip.rating.media.media_type}
                    </span>

                </div>
            )}
        </div>
    );
};

export default ScatterPlot;