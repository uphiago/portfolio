"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BaseModal } from "../modals/BaseModal";

const EMPTY_SCOREBOARD = {
  recent: [],
  topWithPirates: [],
  topLegitimate: [],
};

function normalizeScoreboard(value) {
  return {
    recent: Array.isArray(value?.recent) ? value.recent : [],
    topWithPirates: Array.isArray(value?.topWithPirates)
      ? value.topWithPirates
      : [],
    topLegitimate: Array.isArray(value?.topLegitimate)
      ? value.topLegitimate
      : [],
  };
}

function hasScoreboardRows(scoreboard) {
  return Object.values(scoreboard).some((rows) => rows.length > 0);
}

export function RankingModal({ open, onClose, nickname, scoreboard: initialScoreboard }) {
  const initialValue = normalizeScoreboard(initialScoreboard);
  const [scoreboard, setScoreboard] = useState(initialValue);
  const scoreboardRef = useRef(initialValue);
  const [view, setView] = useState("recent");
  const [showPirates, setShowPirates] = useState(true);
  const [status, setStatus] = useState(initialScoreboard ? "ready" : "loading");

  const fetchScores = useCallback(async (signal) => {
    const hasCachedScores = hasScoreboardRows(scoreboardRef.current);
    setStatus(hasCachedScores ? "refreshing" : "loading");
    try {
      const res = await fetch("/api/dino/scores", {
        cache: "no-store",
        signal,
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error("scoreboard request failed");
      }
      const nextScoreboard = normalizeScoreboard(data);
      scoreboardRef.current = nextScoreboard;
      setScoreboard(nextScoreboard);
      setStatus(data.disabled ? "disabled" : "ready");
    } catch (error) {
      if (error?.name !== "AbortError") {
        if (hasCachedScores) {
          setStatus("stale");
        } else {
          scoreboardRef.current = EMPTY_SCOREBOARD;
          setScoreboard(EMPTY_SCOREBOARD);
          setStatus("error");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    setView("recent");
    setShowPirates(true);
    if (initialScoreboard) {
      const nextScoreboard = normalizeScoreboard(initialScoreboard);
      scoreboardRef.current = nextScoreboard;
      setScoreboard(nextScoreboard);
      setStatus("ready");
      return undefined;
    }

    const controller = new AbortController();
    fetchScores(controller.signal);
    return () => controller.abort();
  }, [open, initialScoreboard, fetchScores]);

  const scores = useMemo(() => {
    if (view === "recent") return scoreboard.recent;
    return showPirates
      ? scoreboard.topWithPirates
      : scoreboard.topLegitimate;
  }, [scoreboard, showPirates, view]);

  if (!open) return null;

  const rows = Array.from({ length: 10 }, (_, index) => scores[index] || null);
  const flaggedCount = scores.filter((entry) => entry.flagged === true).length;
  const isLoading = status === "loading";
  const isBusy = isLoading || status === "refreshing";

  return (
    <BaseModal
      onClose={onClose}
      label="Dino scores"
      modalClass="mfi-modal dino-ranking-modal"
    >
      {/* Prevent game controls from receiving keys used inside the dialog. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="dino-ranking-content"
        onKeyDown={(event) => event.stopPropagation()}
      >
        <div className="dino-modal-head">
          <span className="dino-modal-title mono">scores</span>
          {view === "top" && (
            <button
              type="button"
              className={`dino-pirate-toggle${showPirates ? " active" : ""}`}
              aria-label={showPirates ? "Hide pirate scores" : "Show pirate scores"}
              aria-pressed={showPirates}
              title={showPirates ? "Hide pirate scores" : "Show pirate scores"}
              onClick={() => setShowPirates((visible) => !visible)}
            >
              🏴‍☠️
            </button>
          )}
        </div>

        <div className="dino-rank-tabs mono" role="tablist" aria-label="Score views">
          <button
            type="button"
            role="tab"
            data-view="recent"
            aria-selected={view === "recent"}
            aria-controls="dino-score-list"
            onClick={() => setView("recent")}
          >
            recent
          </button>
          <button
            type="button"
            role="tab"
            data-view="top"
            aria-selected={view === "top"}
            aria-controls="dino-score-list"
            onClick={() => setView("top")}
          >
            top 10
          </button>
        </div>

        <div className="dino-rank-cols mono" aria-hidden="true">
          <span className="rk">#</span>
          <span className="nm">player</span>
          <span className="sc">score</span>
        </div>

        <div
          id="dino-score-list"
          className="dino-rank-scroll"
          role="tabpanel"
          aria-busy={isBusy}
        >
          <ol className="dino-rank-list">
            {rows.map((entry, index) => {
              const rank = index + 1;
              const visibleEntry = isLoading ? null : entry;
              const isMe = Boolean(
                nickname && visibleEntry?.nickname === nickname
              );
              return (
                <li
                  key={`rank-${index}`}
                  className={visibleEntry ? (isMe ? "me" : "") : "empty"}
                >
                  <span className={`rk${visibleEntry ? ` top${rank}` : ""}`}>
                    {rank}
                  </span>
                  <span className="nm" title={visibleEntry?.nickname}>
                    {visibleEntry?.nickname || "—"}
                    <span
                      className="flag"
                      title={visibleEntry?.flagged === true ? "pirate score" : undefined}
                      aria-label={visibleEntry?.flagged === true ? "pirate score" : undefined}
                    >
                      {visibleEntry?.flagged === true ? "🏴‍☠️" : ""}
                    </span>
                  </span>
                  <span className="sc">{visibleEntry?.score ?? "—"}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="dino-modal-foot mono" aria-live="polite">
          {status === "error" || status === "stale" ? (
            <>
              {status === "stale" ? "showing cached scores" : "scores unavailable"} ·{" "}
              <button type="button" onClick={() => fetchScores()}>
                retry
              </button>
            </>
          ) : status === "disabled" ? (
            "scores offline"
          ) : view === "recent" ? (
            `latest runs · 🏴‍☠️ ${flaggedCount} pirate${flaggedCount === 1 ? "" : "s"}`
          ) : showPirates ? (
            `top scores · 🏴‍☠️ ${flaggedCount} pirate${flaggedCount === 1 ? "" : "s"}`
          ) : (
            "top scores · pirates hidden"
          )}
        </div>
      </div>
    </BaseModal>
  );
}
