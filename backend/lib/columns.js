const USER_PUBLIC_COLUMNS = "id, username, profile_picture, bio, created_at";

const MEDIA_COLUMNS =
    "id, title, media_type, release_year, tmdb_id, isbn, cover_image_url, creator";

const RATING_COLUMNS =
    "id, user_id, media_id, x_coordinate, y_coordinate, good_reason, like_reason, context, watch_number, created_at";

module.exports = { USER_PUBLIC_COLUMNS, MEDIA_COLUMNS, RATING_COLUMNS };
