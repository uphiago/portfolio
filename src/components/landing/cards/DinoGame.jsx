"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";
import { RankingModal } from "./RankingModal";

const NICKNAME_KEY = "dino-nickname";
const RUNNER_SRC = "/dino/runner.js";
const NICKNAME_MAX = 24;

function readNickname() {
  try {
    return window.localStorage.getItem(NICKNAME_KEY) || "";
  } catch {
    return "";
  }
}

function writeNickname(name) {
  try {
    window.localStorage.setItem(NICKNAME_KEY, name);
  } catch {
    // private mode / storage disabled — game still works
  }
}

function sanitizeNickname(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, NICKNAME_MAX);
}

function loadRunnerScript() {
  return new Promise((resolve, reject) => {
    if (window.Runner) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = RUNNER_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("failed to load dino runner"));
    document.head.appendChild(script);
  });
}

export function DinoGame() {
  const stageRef = useRef(null);
  const pendingScoreRef = useRef(null);
  const topRef = useRef([]);
  const [nickname, setNickname] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [askName, setAskName] = useState(false);
  const [started, setStarted] = useState(false);
  const [ranking, setRanking] = useState("loading"); // loading | ok | disabled
  const [submitting, setSubmitting] = useState(false);
    const [rankOpen, setRankOpen] = useState(false);
  const rankingRef = useRef(ranking);

  const tryRefreshTop = useCallback(async () => {
    try {
      const res = await fetch("/api/dino/scores", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok && !data.disabled) {
        topRef.current = data.top || [];
        rankingRef.current = "ok";
        setRanking("ok");
      } else {
        topRef.current = [];
        rankingRef.current = "disabled";
        setRanking("disabled");
      }
    } catch {
      topRef.current = [];
      rankingRef.current = "disabled";
      setRanking("disabled");
    }
  }, []);

  const submitScore = useCallback(
    async (name, score) => {
      setSubmitting(true);
      try {
        const res = await fetch("/api/dino/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nickname: name, score }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok) {
          await tryRefreshTop();
        } else {
          console.warn("dino score rejected", { status: res.status, error: data?.error });
        }
      } catch {
        // ranking stays stale until next game over
      } finally {
        setSubmitting(false);
      }
    },
    [tryRefreshTop]
  );

  const handleGameOver = useCallback(
    (score) => {
      if (rankingRef.current !== "ok") {
        return;
      }
      const name = readNickname();
      if (name) {
        submitScore(name, score);
      } else {
        pendingScoreRef.current = score;
        setNameDraft("");
        setAskName(true);
      }
    },
    [submitScore]
  );

  const handleNicknameSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const name = sanitizeNickname(nameDraft);
      if (!name) {
        return;
      }
      writeNickname(name);
      setNickname(name);
      setAskName(false);
      const score = pendingScoreRef.current;
      if (score) {
        submitScore(name, score);
      }
    },
    [nameDraft, submitScore]
  );

  useEffect(() => {
    let disposed = false;
    let runner = null;

    tryRefreshTop();

    loadRunnerScript()
      .then(() => {
        if (disposed || !stageRef.current) {
          return;
        }
        runner = new window.Runner(".dino-game", {
          onGameStart: () => setStarted(true),
          onGameOver: handleGameOver,
        });
      })
      .catch(() => {
        // game script failed to load — keep the static stage, no crash
      });

    return () => {
      disposed = true;
      if (runner) {
        try {
          runner.destroy();
        } catch {
          // ignore teardown errors
        }
      }
    };
  }, [tryRefreshTop, handleGameOver]);

  return (
    <div className="dino-game-stage">
      <div className="dino-bar">
        <button type="button" className="dino-trophy" onClick={() => setRankOpen(true)} onKeyDown={(e) => { e.key === " " && e.preventDefault(); }}>
          <Trophy size={13} strokeWidth={1.7} />
          top 10
        </button>
      </div>

      <div className="dino-game-holder">
        <div className="dino-game-wrap">
          <div className="interstitial-wrapper dino-game" ref={stageRef} />
          <div className="icon-offline" aria-hidden="true" />
          {/* The game reads these exact <img> ids from the DOM (hidden). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="offline-resources-1x" src="/dino/100-offline-sprite.png" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="offline-resources-2x" src="/dino/200-offline-sprite.png" alt="" />

          {!started && (
            <div className="dino-hint" aria-hidden="true">
              press space · tap to start
            </div>
          )}

          {askName && (
            <form className="dino-name" onSubmit={handleNicknameSubmit}>
              <input
                autoFocus
                maxLength={NICKNAME_MAX}
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                placeholder="nickname"
                aria-label="Nickname for the ranking"
              />
              <button type="submit" disabled={submitting}>
                save score
              </button>
            </form>
          )}

          )}
        </div>
      </div>

      <RankingModal
        open={rankOpen}
        onClose={() => setRankOpen(false)}
        nickname={nickname}
      />
    </div>
  );
}
