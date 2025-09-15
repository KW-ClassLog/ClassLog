"use client";
import MicRecorder from "mic-recorder-to-mp3";

export type RecState = "idle" | "recording" | "stopped";
type Unsub = () => void;

type ListenerMap = {
  state:   (s: RecState) => void;
  level:   (v: number) => void;
  elapsed: (ms: number) => void;
  done:    (blob: Blob, url: string) => void;
};

type Mp3Result = { getMp3: () => Promise<[ArrayBuffer, Blob]> };
type RecorderLike = {
  start: () => Promise<void> | void;
  stop: () => Mp3Result;
};

class RecordingEngine {
  private state: RecState = "idle";
  private recorder: RecorderLike | null = null;
  private stream: MediaStream | null = null;

  private timerId: number | null = null;
  private startedAt = 0;
  private elapsedMs = 0;

  private url: string | null = null;

  private listeners: { [K in keyof ListenerMap]: Array<ListenerMap[K]> } = {
    state: [],
    level: [],
    elapsed: [],
    done: [],
  };

  subscribe<K extends keyof ListenerMap>(kind: K, fn: ListenerMap[K]): Unsub {
    this.listeners[kind].push(fn);
    return () => {
      const arr = this.listeners[kind];
      const idx = arr.indexOf(fn);
      if (idx >= 0) arr.splice(idx, 1);
    };
  }

  private emit<K extends keyof ListenerMap>(kind: K, ...args: Parameters<ListenerMap[K]>) {
    const cbs = this.listeners[kind] as Array<(...a: Parameters<ListenerMap[K]>) => void>;
    for (const cb of cbs) cb(...args);
  }

  private setState(s: RecState) {
    this.state = s;
    this.emit("state", s);
  }

  getSnapshot() {
    return { state: this.state, elapsedMs: this.elapsedMs, url: this.url };
  }

  private async ensureMic() {
    if (!this.stream) {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
  }

  async start() {
    if (this.state === "recording") return;
    await this.ensureMic();

    this.recorder = new MicRecorder({ bitRate: 128 }) as unknown as RecorderLike;
    await this.recorder.start();

    this.startedAt = Date.now();
    this.elapsedMs = 0;
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = window.setInterval(() => {
      this.elapsedMs = Date.now() - this.startedAt;
      this.emit("elapsed", this.elapsedMs);
    }, 250);

    this.setState("recording");
    window.dispatchEvent(new CustomEvent("live:recording:start"));
  }

  async stop() {
    if (this.state !== "recording" || !this.recorder) return;

    const result = await this.recorder.stop();
    const [, blob] = await result.getMp3();

    if (this.timerId) { clearInterval(this.timerId); this.timerId = null; }
    this.elapsedMs = Date.now() - this.startedAt;
    this.emit("elapsed", this.elapsedMs);

    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;

    if (this.url) URL.revokeObjectURL(this.url);
    this.url = URL.createObjectURL(blob);
    this.emit("done", blob, this.url);

    this.setState("stopped");
    window.dispatchEvent(new CustomEvent("live:recording:stop"));
  }
}

let _engine: RecordingEngine | null = null;
export function getRecordingEngine() {
  if (!_engine) _engine = new RecordingEngine();
  return _engine;
}