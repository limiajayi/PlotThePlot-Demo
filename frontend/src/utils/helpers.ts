import { type MediaType } from "../types/media.types";

export const MEDIA_EMOJI: Record<string, string> = {
    movie: '🎬',
    book:  '📖',
    show:  '📺',
};

export const getQuadrant = (x: number, y: number) => {
    if (x >= 0 && y >= 0) return 'over';
    if (x < 0  && y >= 0) return 'overhated';
    if (x >= 0 && y < 0)  return 'overrated';
    return 'under';
};

export const QUADRANT_COLOR: Record<string, string> = {
    over:      'var(--green)',
    overhated: 'var(--orange)',
    overrated: 'var(--blue)',
    under:     'var(--red)',
};

// Dot style per media type: colour + distinct stroke treatment
export const DOT_STYLES: Record<string, { fill: string; stroke: string; strokeWidth: number; strokeDasharray: string }> = {
    movie: { fill: '#2196F3', stroke: '#ffffff', strokeWidth: 2, strokeDasharray: 'none' },  // solid border
    book:  { fill: '#4CAF50', stroke: '#ffffff', strokeWidth: 2, strokeDasharray: 'none'  },  // dashed border
    show:  { fill: '#FF9800', stroke: '#ffffff', strokeWidth: 2, strokeDasharray: 'none' },  // thick solid ring
};

export const MEDIA_DOT_COLOR: Record<string, string> = {
    movie: '#2196F3',
    book:  '#4CAF50',
    show:  '#FF9800',
};

// Media type option: 'all' clears the filter
export const MEDIA_TYPES = [
    { label: 'All',    value: '' },
    { label: '🎬 Movie', value: 'movie' },
    { label: '📺 Show',  value: 'show' },
    { label: '📖 Book',  value: 'book' },
];

export const MEDIA_TYPE_OPTIONS: MediaType[] = ['movie', 'show', 'book'];