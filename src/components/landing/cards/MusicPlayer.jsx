import React from "react";
import { DEFAULT_MUSIC } from "../youtube";

const DEFAULT_VOLUME = 40;
const FADE_MS = 2200;
const FADE_STEPS = 30;

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
  const [volume, setVolumeState] = React.useState(0);
  const [subscribed, setSubscribed] = React.useState(false);
  const hasThumbnail = Boolean(music.thumbnailUrl);

  // Starts muted (browsers block sound-on-load); audio is enabled on the first
  // user gesture and eased in so it never blasts in at full level.
  const sep = music.embedUrl.includes("?") ? "&" : "?";
  const src = `${music.embedUrl}${sep}autoplay=1&mute=1`;

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
    }
    let step = 0;
    fadeRef.current = window.setInterval(() => {
      step += 1;
      const value = Math.round((target * step) / FADE_STEPS);
      setVolumeNow(value);
      if (step >= FADE_STEPS) stopFade();
    }, FADE_MS / FADE_STEPS);
  };

  React.useEffect(() => {
    let cancelled = false;
    loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !YT || !iframeRef.current || playerRef.current) return;
      playerRef.current = new YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            // Try to start with sound right away (works for recurring visitors
            // the browser trusts); blocked sessions fall back to first gesture.
            fadeInTo(DEFAULT_VOLUME);
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
      playerRef.current = null;
    };
  }, []);

  // First interaction anywhere unlocks audio and eases it in to the default.
  React.useEffect(() => {
    const events = ["pointerdown", "keydown", "touchstart", "wheel"];
    const onFirstGesture = () => {
      events.forEach((name) => window.removeEventListener(name, onFirstGesture));
      // Safety net: if the browser blocked sound-on-load, enable it now.
      if (volumeRef.current <= 0) fadeInTo(DEFAULT_VOLUME);
    };
    events.forEach((name) => window.addEventListener(name, onFirstGesture, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, onFirstGesture));
  }, []);

  const handleSubscribe = (event) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="music-panel">
      <div className="music-player-stack">
        <div className="music-stage">
          <div className="music-cover">
            {hasThumbnail ? <img src={music.thumbnailUrl} alt="" loading="lazy" /> : <span className="music-fallback">yt</span>}
            <iframe
              ref={iframeRef}
              title="YouTube playlist player"
              src={src}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <div className="music-controls">
              <span className={`music-eq${volume > 0 ? " is-playing" : ""}`} aria-hidden="true">
                <span /><span /><span /><span />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="music-subscribe">
        <div className="mono">{subscribed ? "thanks - you're on the list" : "field_notes.subscribe()"}</div>
        <form className="nlinput" onSubmit={handleSubscribe}>
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input id="nl-email" type="email" placeholder="your@email.com" required aria-label="Email address" />
          <button type="submit" className="nl-go">go</button>
        </form>
      </div>
    </div>
  );
}
