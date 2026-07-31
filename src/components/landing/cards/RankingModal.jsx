"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { BaseModal } from "../modals/BaseModal";
import { DINO_HACKER_THRESHOLD } from "@/src/lib/dinoRanking";

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

  return (
    <BaseModal onClose={onClose} label="Dino top 10 ranking">
      {/* Prevent space from bubbling to the document (dino game listens there). */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div onKeyDown={(e) => { e.key === " " && e.stopPropagation(); }}>
        <div className="dino-modal-head">
        <span className="dino-modal-title">
          <Trophy size={14} strokeWidth={1.7} />
          dino
        </span>
        <span className="dino-modal-sub mono">latest qualifying runs</span>
      </div>

      <div className="dino-rank-cols mono">
        <span className="rk">#</span>
        <span className="nm">player</span>
        <span className="sc">score</span>
      </div>

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
            const isFlagged =
              entry.flagged === true || entry.score >= DINO_HACKER_THRESHOLD;
            return (
              <li
                key={`${entry.nickname}-${entry.score}-${index}`}
                className={isMe ? "me" : ""}
              >
                <span className={`rk top${rank}`}>{rank}</span>
                <span className="nm">
                  {entry.nickname}
                  {isFlagged && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="flag" src="/incognito.png" alt="hacker" title="hacker" />
                  )}
                </span>
                <span className="sc">{entry.score}</span>
              </li>
            );
          })
        }
      </ol>

      <div className="dino-modal-foot mono">
        newest first
      </div>
      </div>
    </BaseModal>
  );
}
