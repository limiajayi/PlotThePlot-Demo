export type Media = {
    id: number;
    title: string;
    media_type: "movie" | "show" | "book";
    release_year: number;
    genre: string;
    cover_image_url: string;
}