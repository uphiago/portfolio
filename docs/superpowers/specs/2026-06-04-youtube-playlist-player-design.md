# YouTube playlist player

## Goal

Add a compact "listening" player above the Field Notes subscribe form, synced from a public YouTube playlist.

## Behavior

- Read the playlist URL from `YOUTUBE_PLAYLIST_URL`.
- Read the start offset from `YOUTUBE_START_SECONDS`.
- Use `YOUTUBE_API_KEY` when present to fetch the first public playlist item, including title, channel, video id, and YouTube thumbnail.
- Fall back to the configured playlist embed when the API key is absent or the fetch fails.
- Render a compact player with thumbnail artwork, a central play/pause control, and a short volume control while playing.
- Do not autoplay. The YouTube iframe loads with the page, but playback starts only after the user clicks play.

## Components

- `youtube.js`: parses env/config, fetches playlist metadata, and builds embed URLs.
- `MusicPlayer`: client component for the compact visual player and iframe controls.
- `WriteupsCard`: keeps write-ups as the primary content and renders the music player plus subscribe form in the side panel.

## Testing

- Unit coverage for playlist URL parsing and embed URL generation.
- Render coverage for the compact player, subscribe form, and playlist/embed URL generation.
