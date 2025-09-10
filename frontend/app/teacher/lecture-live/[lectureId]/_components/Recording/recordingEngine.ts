"use client";
import MicRecorder from "mic-recorder-to-mp3";

export type RecState = "idle" | "recording" | "stopped";
type Unsub = () => void;
type Listeners = {
  state:   ((s: RecState) => void)[];
  level:   ((v: number) => void)[];
  elapsed: ((ms: number) => void)[];
  done:    ((blob: Blob, url: string) => void)[];
};

class RecordingEngine {
  private state: RecState = "idle";
  private recorder: any = null;
  private stream: MediaStream | null = null;

  private timerId: number | null = null;
  private startedAt = 0;
  private elapsedMs = 0;

  private url: string | null = null;

  private listeners: Listeners = { state: [], level: [], elapsed: [], done: [] };

  subscribe<K extends keyof Listeners>(kind: K, fn: Listeners[K][number]): Unsub {
    this.listeners[kind].push(fn as any);
    return () => {
      this.listeners[kind] = this.listeners[kind].filter((f) => f !== fn) as any;
    };
  }
  private emit<K extends keyof Listeners>(kind: K, ...args: Parameters<Listeners[K][number]>) {
    for (const fn of this.listeners[kind]) (fn as any)(...args);
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
    this.recorder = new MicRecorder({ bitRate: 128 });
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
    if (this.state !== "recording") return;

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