import { useState } from "react";
import { useSearchParams } from "react-router-dom";

type SearchFilters = {
    title: string;
    media_type: string;
    quadrant: string;
}

const RatingSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams(); // for what's in the search bar eg '/user/1/profile?title=gladiator&media_type=movie'

    // gets current filters from url
    const [filters, setFilters] = useState<SearchFilters>({
        title: searchParams.get('title') || '',
        media_type: searchParams.get('media_type') || '',
        quadrant: searchParams.get('quadrant') || ''
    });

    // handles when a change is made in the form to either the title, media type or quadrant fields
    const handleFilterChange = (field: keyof SearchFilters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    //handles when the url of the user changes
    const handleSearch = () => {
        //build the query string from filters
        const params = new URLSearchParams();

        if (filters.title) params.append('title', filters.title);
        if (filters.media_type) params.append('media_type', filters.media_type);
        if (filters.quadrant) params.append('quadrant', filters.quadrant);

        //updates the URL with the new query parameters
        setSearchParams(params)
    };

    //Clears URL parameters
    const handleClear = () => {
        setFilters({ title: '', media_type: '', quadrant: '' });
        setSearchParams({})
    }

    return (
        <div style={{ padding: '2px', background: 'f5f5f5', borderRadius: '8px' }} >
            <h3>Filter Ratings</h3>

            {/* Search by title */}
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="">Search by title:</label>
                <input 
                    type="text" 
                    value={filters.title}
                    onChange={({ target }) => handleFilterChange('title', target.value)}
                    placeholder="Enter movie/book/show name..."
                    style={{ width: '95%', padding: '8px' }}
                />
            </div>

            {/* Search by media type */}
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="">Media Type:</label>
                <select
                    style={{ width: '95%', padding: '8px' }}
                    value={filters.media_type}
                    onChange={({ target }) => handleFilterChange('media_type', target.value)}    
                >
                        <option value="">All types</option>
                        <option value="movie">Movie</option>
                        <option value="book">Book</option>
                        <option value="show">Show</option>
                </select>
            </div>

            {/* Search by quadrant */}
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="">Quadrant:</label>
                <select
                    style={{ width: '95%', padding: '8px' }}
                    value={filters.quadrant}
                    onChange={({ target }) => handleFilterChange('quadrant', target.value)}    
                >
                        <option value="">All quadrants</option>
                        <option value="amazing">Amazing</option>
                        <option value="guilty-pleasure">Guilty Pleasure</option>
                        <option value="great-not-for-me">Great, But Not For Me</option>
                        <option value="dont-touch">Don't Touch</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }} >
                <button onClick={handleSearch} style={{ padding: '8px 16px' }}>
                    Apply Filters
                </button>
                <button onClick={handleClear} style={{ padding: '8px 16px' }}>
                    Clear Filters
                </button>
            </div>
        </div>
    )


    return (
        <div>
            
        </div>
    )

}

export default RatingSearch;