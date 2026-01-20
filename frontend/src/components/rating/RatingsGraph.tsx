import type { User } from "../../types/user.types";
import { ErrorBoundary } from "react-error-boundary";
// import * as d3 from 'd3';

// type Quadrant = {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//     label: string;
//     color: string;
// }

type RatingsGraphProps = {
    user: User;
}

const ErrorFallback = () => {
    return (
        <div>
            <h3>
                Error detected!
            </h3>
        </div>
    )
}

// where the d3 mess happens
const RatingsGraph = ({ user }: RatingsGraphProps) => {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div>
                Yo I'm the future graph for {user?.username}
            </div>
        </ErrorBoundary>
    )
}

export default RatingsGraph