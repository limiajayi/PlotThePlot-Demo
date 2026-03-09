import { useSearchParams } from "react-router-dom";
import styles from "../../styles/RatingsSearch.module.css";

// Media type option: 'all' clears the filter
const MEDIA_TYPES = [
    { label: 'All',    value: '' },
    { label: '🎬 Movie', value: 'movie' },
    { label: '📺 Show',  value: 'show' },
    { label: '📖 Book',  value: 'book' },
];

// Quadrant options: each gets its own colour when active
const QUADRANTS = [
    { label: 'All',       value: '',          activeClass: styles.chipActive  },
    { label: 'over',      value: 'over',      activeClass: styles.chipGreen   },
    { label: 'overhated', value: 'overhated', activeClass: styles.chipOrange  },
    { label: 'overrated', value: 'overrated', activeClass: styles.chipBlue    },
    { label: 'under',     value: 'under',     activeClass: styles.chipRed     },
];


const RatingSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams(); 

    const currentType = searchParams.get('media_type') ?? '';
    const currentQuadrant = searchParams.get('quadrant') ?? '';
    const currentTitle = searchParams.get('title') ?? '';

   // Updates a single param in the URL without touching the others
    const setParam = (key: string, value: string) => {
        const next = new URLSearchParams(searchParams);
        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }
        setSearchParams(next);
    };

    return (
        
        <div className={styles.filterSection}>

                {/* media chips */}
                <div>
                    <p className={styles.sectionTitle}>
                        Media Type
                    </p>
                    <div className={styles.chipRow}>
                        {/* destructuring label and value */}
                        {MEDIA_TYPES.map(({ label, value }) => (
                            <button
                                key={value}
                                className={`${styles.chip} ${currentType === value ? styles.chipActive : ''}`}
                                onClick={() => setParam('media_type', value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* quadrant chips */}
                <div>
                    <p className={styles.sectionTitle}>
                        Quadrants
                    </p>
                    <div className={styles.chipRow}>
                        {/* destructuring label, value and activeClass */}
                        {QUADRANTS.map(({ label, value, activeClass }) => (
                            <button
                                key={value}
                                className={`${styles.chip} ${currentQuadrant === value ? activeClass : ''}`}
                                onClick={() => setParam('quadrant', value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* title box */}
                <div>
                    <p className={styles.sectionTitle}>
                        Search title
                    </p>
                    <div className={styles.inputGroup}>
                        <input 
                            className={styles.input}
                            type="text" 
                            placeholder="e.g. Gladiator"
                            value={currentTitle}
                            onChange={({ target }) => setParam('title', target.value)}
                        />
                    </div>
                </div>

                {/* media type legend - for the graph view */}
                <div className={styles.legend}>
                    <div className={styles.legendItem}>
                        <span className={styles.legendDot} style={{ background: '#2196F3' }} />
                        Movie
                    </div>

                    <div className={styles.legendItem}>
                        <span className={styles.legendDot} style={{ background: '#4CAF50' }} />
                        Book
                    </div>

                    <div className={styles.legendItem}>
                        <span className={styles.legendDot} style={{ background: '#FF9800' }} />
                        Show
                    </div>
                </div>

        </div>
    )


}

export default RatingSearch;