import type { User } from "../../types/user.types"

type RatingsGraphProps = {
    user: User;
}

// where the d3 mess happens
const RatingsGraph = ({ user }: RatingsGraphProps) => {
    return (
        <div>
            Yo I'm the future graph for {user?.username}
        </div>
    )
}

export default RatingsGraph