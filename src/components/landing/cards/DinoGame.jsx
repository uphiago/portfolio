"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";
import { validateNickname } from "@/src/lib/dinoRanking";
import { RankingModal } from "./RankingModal";

const NICKNAME_KEY = "dino-nickname";
const RUNNER_SRC = "/dino/runner.js";

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
  const [nickname, setNickname] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [nameError, setNameError] = useState("");
  const [askName, setAskName] = useState(false);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rankOpen, setRankOpen] = useState(false);
  const rankingRef = useRef("loading");

  const tryRefreshTop = useCallback(async () => {
    try {
      const res = await fetch("/api/dino/scores", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok && !data.disabled) {
        rankingRef.current = "ok";
      } else {
        rankingRef.current = "disabled";
      }
    } catch {
      rankingRef.current = "disabled";
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
      const validatedName = validateNickname(name);
      if (!validatedName.error) {
        submitScore(validatedName.value, score);
      } else {
        pendingScoreRef.current = score;
        setNameDraft("");
        setNameError("");
        setAskName(true);
      }
    },
    [submitScore]
  );

  const handleNicknameSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const validatedName = validateNickname(nameDraft);
      if (validatedName.error) {
        setNameError(
          validatedName.error === "nickname_too_long"
            ? "24 characters max"
            : "enter a nickname"
        );
        return;
      }
      const name = validatedName.value;
      writeNickname(name);
      setNickname(name);
      setNameError("");
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

    const savedNickname = validateNickname(readNickname());
    if (!savedNickname.error) setNickname(savedNickname.value);
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
        {askName && (
          <form className="dino-name" onSubmit={handleNicknameSubmit}>
            <input
              value={nameDraft}
              onChange={(event) => {
                setNameDraft(event.target.value);
                setNameError("");
              }}
              placeholder="nickname"
              aria-label="Nickname for the ranking"
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "dino-name-error" : undefined}
            />
            <button type="submit" disabled={submitting}>
              save
            </button>
            {nameError && (
              <span id="dino-name-error" className="dino-name-error" role="alert">
                {nameError}
              </span>
            )}
          </form>
        )}
        <button type="button" className="dino-trophy" onClick={() => setRankOpen(true)} onKeyDown={(e) => { e.key === " " && e.preventDefault(); }}>
          <Trophy size={13} strokeWidth={1.7} />
          scores
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
