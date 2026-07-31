"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { BaseModal } from "../modals/BaseModal";
import { DINO_HACKER_THRESHOLD } from "@/src/lib/dinoRanking";

export function RankingModal({ open, onClose, ranking, scores, nickname }) {
  if (!open) {
    return null;
  }

  const rows = Array.from({ length: 10 }, (_, index) => scores[index] || null);

  return (
    <BaseModal onClose={onClose} label="Dino top 10 ranking">
      <div className="dino-modal-head">
        <span className="dino-modal-title">
          <Trophy size={14} strokeWidth={1.7} />
          dino · last 10
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
              <span className="nm">{entry.nickname}</span>
              <span className="sc">
                {entry.score}
                {isFlagged && entry.note && (
                  <span
                    className="flag-tip"
                    aria-label={entry.note}
                    title={entry.note}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="flag"
                      src="/incognito.png"
                      alt="flagged"
                    />
                    <span className="flag-note mono">{entry.note}</span>
                  </span>
                )}
                {isFlagged && !entry.note && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="flag"
                    src="/incognito.png"
                    alt="flagged"
                    title="flagged — likely tampered"
                  />
                )}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="dino-modal-foot mono">
        newest first · only runs that crack the top 10 get saved
      </div>
    </BaseModal>
  );
}
