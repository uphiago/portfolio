export const DEFAULT_YOUTUBE_PLAYLIST_URL = "https://youtube.com/playlist?list=PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV";

export const DEFAULT_MUSIC = {
  playlistId: "PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV",
  videoId: "",
  startSeconds: 0,
  title: "playlist signal",
  channelTitle: "public youtube playlist",
  thumbnailUrl: "",
  embedUrl: buildYoutubeEmbedUrl({
    playlistId: "PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV",
    startSeconds: 0,
  }),
};

export function parsePlaylistId(input = "") {
  if (!input) return "";

  try {
    const url = new URL(input);
    return url.searchParams.get("list") || "";
  } catch {
    const match = String(input).match(/[?&]list=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : input;
  }
}

export function parseStartSeconds(input = "") {
  const value = Number.parseInt(String(input), 10);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function buildYoutubeEmbedUrl({ playlistId, videoId = "", startSeconds = 0, autoplay = false, muted = false }) {
  const path = videoId
    ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`
    : "https://www.youtube.com/embed/videoseries";
  const url = new URL(path);

  if (playlistId) {
    url.searchParams.set("list", playlistId);
  }
  if (startSeconds > 0) {
    url.searchParams.set("start", String(startSeconds));
  }
  if (autoplay) {
    url.searchParams.set("autoplay", "1");
  }
  if (muted) {
    url.searchParams.set("mute", "1");
  }
  url.searchParams.set("enablejsapi", "1");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("controls", "0");
  url.searchParams.set("rel", "0");
  url.searchParams.set("modestbranding", "1");

  return url.toString();
}

export function buildYoutubeThumbnailUrl(videoId = "") {
  return videoId ? `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg` : "";
}

function pickThumbnail(thumbnails = {}) {
  return (
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    ""
  );
}

// Without an API key, read the playlist's current first video straight from
// the public playlist page so the thumbnail and start video follow changes
// made in the playlist.
async function fetchFirstPlaylistVideoId(playlistId) {
  try {
    const response = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`, {
      headers: {
        "accept-language": "en-US,en;q=0.9",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
      next: { revalidate: 300 },
    });
    if (!response.ok) return "";
    const html = await response.text();
    const match =
      html.match(/"playlistVideoRenderer":\{"videoId":"([\w-]{11})"/) ||
      html.match(/"videoId":"([\w-]{11})"/);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}

export async function getYoutubePlaylist() {
  const playlistUrl = process.env.YOUTUBE_PLAYLIST_URL || DEFAULT_YOUTUBE_PLAYLIST_URL;
  const playlistId = parsePlaylistId(playlistUrl);
  const startSeconds = parseStartSeconds(process.env.YOUTUBE_START_SECONDS);

  const buildResult = (videoId) => ({
    playlistId,
    videoId,
    startSeconds,
    title: DEFAULT_MUSIC.title,
    channelTitle: DEFAULT_MUSIC.channelTitle,
    thumbnailUrl: buildYoutubeThumbnailUrl(videoId),
    embedUrl: buildYoutubeEmbedUrl({ playlistId, videoId, startSeconds }),
  });

  if (!playlistId) return DEFAULT_MUSIC;

  if (!process.env.YOUTUBE_API_KEY) {
    const firstVideoId =
      process.env.YOUTUBE_VIDEO_ID || (await fetchFirstPlaylistVideoId(playlistId));
    return buildResult(firstVideoId);
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("maxResults", "1");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("key", process.env.YOUTUBE_API_KEY);

    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return buildResult(await fetchFirstPlaylistVideoId(playlistId));

    const data = await response.json();
    const item = data.items?.[0]?.snippet;
    const videoId = item?.resourceId?.videoId || "";

    if (!item || !videoId) return buildResult(await fetchFirstPlaylistVideoId(playlistId));

    return {
      playlistId,
      videoId,
      startSeconds,
      title: item.title || DEFAULT_MUSIC.title,
      channelTitle: item.videoOwnerChannelTitle || item.channelTitle || DEFAULT_MUSIC.channelTitle,
      thumbnailUrl: pickThumbnail(item.thumbnails),
      embedUrl: buildYoutubeEmbedUrl({ playlistId, videoId, startSeconds }),
    };
  } catch {
    return buildResult(await fetchFirstPlaylistVideoId(playlistId));
  }
}
