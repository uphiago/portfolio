"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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

export function RankingModal({ open, onClose, nickname, scoreboard: initialScoreboard }) {
  const [scoreboard, setScoreboard] = useState(() =>
    normalizeScoreboard(initialScoreboard)
  );
  const [view, setView] = useState("recent");
  const [showPirates, setShowPirates] = useState(true);
  const [status, setStatus] = useState(initialScoreboard ? "ready" : "loading");

  const fetchScores = useCallback(async (signal) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/dino/scores", {
        cache: "no-store",
        signal,
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error("scoreboard request failed");
      }
      setScoreboard(normalizeScoreboard(data));
      setStatus(data.disabled ? "disabled" : "ready");
    } catch (error) {
      if (error?.name !== "AbortError") {
        setScoreboard(EMPTY_SCOREBOARD);
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    setView("recent");
    setShowPirates(true);
    if (initialScoreboard) {
      setScoreboard(normalizeScoreboard(initialScoreboard));
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
          aria-busy={isLoading}
        >
          <ol className="dino-rank-list" key={`${view}-${showPirates}`}>
            {rows.map((entry, index) => {
              const rank = index + 1;
              if (isLoading || !entry) {
                return (
                  <li key={`empty-${index}`} className="empty">
                    <span className="rk">{rank}</span>
                    <span className="nm">—</span>
                    <span className="sc">—</span>
                  </li>
                );
              }

              const isMe = Boolean(nickname && entry.nickname === nickname);
              return (
                <li
                  key={`${entry.nickname}-${entry.score}-${index}`}
                  className={isMe ? "me" : ""}
                >
                  <span className={`rk top${rank}`}>{rank}</span>
                  <span className="nm" title={entry.nickname}>
                    {entry.nickname}
                    {entry.flagged === true && (
                      <span className="flag" title="pirate score" aria-label="pirate score">
                        🏴‍☠️
                      </span>
                    )}
                  </span>
                  <span className="sc">{entry.score}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="dino-modal-foot mono" aria-live="polite">
          {status === "error" ? (
            <>
              scores unavailable ·{" "}
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
