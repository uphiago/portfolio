"use client";

import React, { useCallback, useEffect, useState } from "react";
import { BaseModal } from "../modals/BaseModal";

export function RankingModal({ open, onClose, nickname, scores: initialScores }) {
  const [scores, setScores] = useState(initialScores || []);
  const [loading, setLoading] = useState(!initialScores);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dino/scores", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok && !data.disabled) {
        setScores(data.scores || []);
      } else {
        setScores([]);
      }
    } catch {
      setScores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && !initialScores) {
      fetchScores();
    }
  }, [open, initialScores, fetchScores]);

  if (!open) {
    return null;
  }

  const rows = Array.from({ length: 10 }, (_, index) => scores[index] || null);
  const flaggedCount = scores.filter((s) => s.flagged === true).length;

  return (
    <BaseModal onClose={onClose} label="Dino latest runs">
      {/* Prevent space from bubbling to the document (dino game listens there). */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div onKeyDown={(e) => { e.key === " " && e.stopPropagation(); }}>
        <div className="dino-modal-head">
          <span className="dino-modal-title mono">latest runs · try harder, get flagged</span>
        </div>

        <div className="dino-rank-cols mono">
        <span className="rk">#</span>
        <span className="nm">player</span>
        <span className="sc">score</span>
      </div>

      <div className="dino-rank-scroll">
        <ol className="dino-rank-list">
          {rows.map((entry, index) => {
            const rank = index + 1;
            if (loading) {
              return (
                <li key={`empty-${index}`} className="empty">
                  <span className="rk">{rank}</span>
                  <span className="nm">—</span>
                  <span className="sc">—</span>
                </li>
              );
            }
            if (!entry) {
              return (
                <li key={`empty-${index}`} className="empty">
                  <span className="rk">{rank}</span>
                  <span className="nm">—</span>
                  <span className="sc">—</span>
                </li>
              );
            }
              const isMe =
                nickname &&
                entry.nickname?.toLowerCase() === nickname.toLowerCase();
              const isFlagged = entry.flagged === true;
              return (
                <li
                  key={`${entry.nickname}-${entry.score}-${index}`}
                  className={isMe ? "me" : ""}
                >
                  <span className={`rk top${rank}`}>{rank}</span>
                  <span className="nm">
                    {entry.nickname}
                    {isFlagged && <span className="flag" title="flagged">🏴‍☠️</span>}
                  </span>
                  <span className="sc">{entry.score}</span>
                </li>
              );
            })
          }
        </ol>
        </div>

      <div className="dino-modal-foot mono">
        🏴‍☠️ {flaggedCount} flagged · 50k+
      </div>
      </div>
    </BaseModal>
  );
}
