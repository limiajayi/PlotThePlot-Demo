import { useEffect, useState} from 'react';
// import * as d3 from 'd3';

type Ratings = {
  id: number;
  user_id: number;
  media_id: number;
  x_coordinate: number;
  y_coordinate: number;
  good_reason: string;
  like_reason: string;
  context?: string;
  watch_number?: number;
  created_at: string;
}

const url = 'http://localhost:3001/api/users/1/ratings' // for now

const App = () => {

  const [ratings, setRatings] = useState<Ratings[]>([]) 

  useEffect(() => {
    const fetchRatings = async () => {
      const response = await fetch(url)
      const data = await response.json()
      setRatings(data)
    }

    fetchRatings()
  }, [])
  
  return (
      <div>
        <h1>PlotThePlot Ratings!!!!</h1>
        <p>Found {ratings.length} ratings</p>
        <pre>{JSON.stringify(ratings, null, 2)}</pre>
      </div>
  )
}

export default App
