import type { Ratings } from "../../types/ratings.types";

type ScatterPlotProps = {
    data: Ratings[]
};

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

    return (
        <div>
            The graph!!!
        </div>
    );
};

export default ScatterPlot;