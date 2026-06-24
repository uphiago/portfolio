import React from "react";
import { Pause, Play } from "lucide-react";
import { DEFAULT_MUSIC } from "../youtube";

export const MUSIC_DEFAULT_VOLUME = 50;
export const MUSIC_FADE_MS = 2000;
export const MUSIC_FADE_STEPS = 100;
export const SUBSCRIBE_COOLDOWN_MS = 3000;

let apiReadyPromise = null;

// Loads the YouTube IFrame Player API once and resolves with window.YT.
function loadYouTubeIframeApi() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiReadyPromise) return apiReadyPromise;

  apiReadyPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === "function") previous();
      resolve(window.YT);
    };
    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
  return apiReadyPromise;
}

export function MusicPlayer({ music = DEFAULT_MUSIC }) {
  const iframeRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const volumeRef = React.useRef(0);
  const fadeRef = React.useRef(null);
  const cooldownRef = React.useRef(null);
  const [volume, setVolumeState] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volumeVisible, setVolumeVisible] = React.useState(false);
  const [subscribeStatus, setSubscribeStatus] = React.useState("idle");
  const [coolingDown, setCoolingDown] = React.useState(false);
  const hasThumbnail = Boolean(music.thumbnailUrl);
  const subscribed = subscribeStatus === "success";
  const subscribing = subscribeStatus === "submitting";
  const submitLocked = subscribing || coolingDown;
  const subscribeLabel = subscribeStatus === "error"
    ? "try again later"
    : subscribed
      ? "thanks - you're on the list"
      : "field_notes.subscribe()";

  const src = `${music.embedUrl}&origin=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "https://hiago.sh")}`;

  const stopFade = () => {
    if (fadeRef.current) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  };

  const setVolumeNow = (value) => {
    const player = playerRef.current;
    volumeRef.current = value;
    setVolumeState(value);
    if (!player || typeof player.setVolume !== "function") return;
    if (value <= 0) {
      player.mute();
    } else {
      player.unMute();
      player.setVolume(value);
      setIsPlaying(true);
    }
    player.playVideo();
  };

  // Eases the volume from 0 up to the target.
  const fadeInTo = (target) => {
    stopFade();
    const player = playerRef.current;
    if (player) {
      player.unMute?.();
      player.setVolume?.(0);
      player.playVideo?.();
      setIsPlaying(true);
    }
    let step = 0;
    fadeRef.current = window.setInterval(() => {
      step += 1;
      const value = (target * step) / MUSIC_FADE_STEPS;
      setVolumeNow(value);
      if (step >= MUSIC_FADE_STEPS) {
        stopFade();
        setVolumeVisible(false);
      }
    }, MUSIC_FADE_MS / MUSIC_FADE_STEPS);
  };

  React.useEffect(() => {
    let cancelled = false;
    loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !YT || !iframeRef.current || playerRef.current) return;
      playerRef.current = new YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
          },
        },
      });
    });
    return () => {
      cancelled = true;
      stopFade();
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* player may not be initialised yet */
      }
      if (cooldownRef.current) {
        window.clearTimeout(cooldownRef.current);
      }
      playerRef.current = null;
    };
  }, []);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (submitLocked) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "");
    const website = String(formData.get("website") || "");

    setSubscribeStatus("submitting");
    setCoolingDown(true);
    cooldownRef.current = window.setTimeout(() => {
      setCoolingDown(false);
      cooldownRef.current = null;
    }, SUBSCRIBE_COOLDOWN_MS);
    try {
      const response = await fetch("/api/field-notes/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });

      if (!response.ok) throw new Error("subscribe failed");
      form.reset();
      setSubscribeStatus("success");
    } catch {
      setSubscribeStatus("error");
    }
  };

  const changeVolume = (event) => {
    const next = Number(event.target.value);
    stopFade();
    setVolumeVisible(true);
    setVolumeNow(next);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopFade();
      playerRef.current?.pauseVideo?.();
      setIsPlaying(false);
      return;
    }
    setVolumeVisible(true);
    fadeInTo(MUSIC_DEFAULT_VOLUME);
  };

  return (
    <div className="music-panel">
      <div className="music-player-stack">
        <div className="music-stage">
          <div className={`music-cover${isPlaying ? " is-playing" : ""}`}>
            {hasThumbnail ? <img src={music.thumbnailUrl} alt="" loading="lazy" draggable={false} /> : <span className="music-fallback">yt</span>}
            <iframe
              ref={iframeRef}
              title="YouTube playlist player"
              src={src}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <button
              type="button"
              className={`music-center-button${isPlaying ? " is-playing" : ""}`}
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
            </button>
            {isPlaying && (
              <div
                className={`music-controls is-playing${volumeVisible ? " show-volume" : ""}`}
                onMouseEnter={() => setVolumeVisible(true)}
                onFocus={() => setVolumeVisible(true)}
              >
                <>
                  <span className="music-eq is-playing" aria-hidden="true">
                    <span /><span /><span /><span />
                  </span>
                  <input
                    type="range"
                    className="music-volume-range"
                    min="0"
                    max="100"
                    step="1"
                    value={volume}
                    onChange={changeVolume}
                    draggable={false}
                    aria-label="Music volume"
                  />
                </>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="music-subscribe">
        <div className="mono">
          {subscribeLabel}
        </div>
        <form className="nlinput" onSubmit={handleSubscribe}>
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input id="nl-email" name="email" type="email" placeholder="your@email.com" required aria-label="Email address" disabled={submitLocked} />
          <label htmlFor="nl-website" className="sr-only">Website</label>
          <input id="nl-website" name="website" type="text" className="nl-hp" tabIndex="-1" autoComplete="off" aria-hidden="true" />
          <button type="submit" className="nl-go" disabled={submitLocked}>{subscribing ? "..." : "go"}</button>
        </form>
      </div>
    </div>
  );
}
