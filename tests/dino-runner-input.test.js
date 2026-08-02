import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";

const runnerSource = readFileSync("public/dino/runner.js", "utf8");

function createRunner({ top = 100, bottom = 250 } = {}) {
  const outerContainerEl = document.createElement("div");
  outerContainerEl.getBoundingClientRect = () => ({
    top,
    bottom,
    height: bottom - top,
  });

  return {
    outerContainerEl,
    detailsButton: null,
    crashed: false,
    playing: false,
    currentSpeed: 6,
    soundFx: { BUTTON_PRESS: null },
    loadSounds: vi.fn(),
    update: vi.fn(),
    playSound: vi.fn(),
    isRunning: vi.fn(() => true),
    tRex: {
      jumping: false,
      ducking: false,
      startJump: vi.fn(),
      endJump: vi.fn(),
      setSpeedDrop: vi.fn(),
      setDuck: vi.fn(),
    },
  };
}

function dispatchKey(runner, target, keyCode, { prevented = false } = {}) {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(event, "keyCode", { value: keyCode });
  if (prevented) event.preventDefault();

  target.addEventListener(
    "keydown",
    (keyboardEvent) => {
      window.Runner.prototype.onKeyDown.call(runner, keyboardEvent);
    },
    { once: true }
  );
  target.dispatchEvent(event);
  return event;
}

function dispatchKeyUp(runner, target, keyCode) {
  const event = new KeyboardEvent("keyup", {
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(event, "keyCode", { value: keyCode });

  target.addEventListener(
    "keyup",
    (keyboardEvent) => {
      window.Runner.prototype.onKeyUp.call(runner, keyboardEvent);
    },
    { once: true }
  );
  target.dispatchEvent(event);
  return event;
}

describe("Dino Runner keyboard input", () => {
  beforeEach(() => {
    window.eval(runnerSource);
  });

  it.each([
    ["Space", 32],
    ["ArrowUp", 38],
  ])("consumes visible %s input from the first jump", (_name, keyCode) => {
    const runner = createRunner();

    const event = dispatchKey(runner, document.body, keyCode);

    expect(event.defaultPrevented).toBe(true);
    expect(runner.playing).toBe(true);
    expect(runner.tRex.startJump).toHaveBeenCalledWith(6);
  });

  it("leaves Space available for page scrolling while the game is offscreen", () => {
    const runner = createRunner({ top: 900, bottom: 1050 });

    const event = dispatchKey(runner, document.body, 32);

    expect(event.defaultPrevented).toBe(false);
    expect(runner.playing).toBe(false);
    expect(runner.tRex.startJump).not.toHaveBeenCalled();
  });

  it("does not intercept Space from an interactive control", () => {
    const runner = createRunner();
    const button = document.createElement("button");
    document.body.appendChild(button);

    const event = dispatchKey(runner, button, 32);

    expect(event.defaultPrevented).toBe(false);
    expect(runner.playing).toBe(false);
    expect(runner.tRex.startJump).not.toHaveBeenCalled();
    button.remove();
  });

  it("does not handle jump keys from inside an open dialog", () => {
    const runner = createRunner();
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    document.body.appendChild(dialog);

    const event = dispatchKey(runner, dialog, 38);

    expect(event.defaultPrevented).toBe(false);
    expect(runner.playing).toBe(false);
    expect(runner.tRex.startJump).not.toHaveBeenCalled();
    dialog.remove();
  });

  it("does not handle a jump event already consumed by another component", () => {
    const runner = createRunner();

    dispatchKey(runner, document.body, 32, { prevented: true });

    expect(runner.playing).toBe(false);
    expect(runner.tRex.startJump).not.toHaveBeenCalled();
  });

  it.each([
    ["offscreen", () => document.body, { top: 900, bottom: 1050 }],
    ["inside a button", () => document.createElement("button"), {}],
  ])("ignores keyboard release while %s", (_name, createTarget, dimensions) => {
    const runner = createRunner(dimensions);
    const target = createTarget();
    if (target !== document.body) document.body.appendChild(target);

    dispatchKeyUp(runner, target, 32);

    expect(runner.tRex.endJump).not.toHaveBeenCalled();
    if (target !== document.body) target.remove();
  });
});
