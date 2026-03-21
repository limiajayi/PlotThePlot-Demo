export type Media = {
    id: number;
    title: string;
    media_type: "movie" | "show" | "book";
    release_year: number;
    tmdb_id?: number;
    isbn?: string;
    cover_image_url: string;
    creator: string;
}

export type ExternalMediaResult = {
    tmdb_id?: number;
    isbn?: string;
    title: string;
    media_type: "movie" | "show" | "book";
    release_year: number | null;
    cover_image_url: string | null;
    creator: string | null;
}

export type MediaType = 'movie' | 'show' | 'book';