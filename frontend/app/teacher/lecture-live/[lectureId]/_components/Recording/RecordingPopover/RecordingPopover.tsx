"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./RecordingPopover.module.scss";
import IconButton from "@/components/Button/IconButton/IconButton";
import { Mic, Square } from "lucide-react";
import { getRecordingEngine, type RecState } from "../recordingEngine";

export default function RecordingPopover({
  defaultState = "idle",
  onStart,
  onStop,
  onRequestConfirmStop,
}: {
  defaultState?: RecState;
  onStart?: () => void;
  onStop?: () => void;
  onRequestConfirmStop?: () => void;
}) {
  const engine = useMemo(() => getRecordingEngine(), []);

  const snap = engine.getSnapshot();
  const [state, setState] = useState<RecState>(snap.state ?? defaultState);
  const [elapsedMs, setElapsedMs] = useState<number>(snap.elapsedMs ?? 0);
  const [audioUrl, setAudioUrl] = useState<string | null>(snap.url ?? null);

  useEffect(() => {
    const off1 = engine.subscribe("state", (s) => setState(s));
    const off2 = engine.subscribe("elapsed", (ms) => setElapsedMs(ms));
    const off3 = engine.subscribe("done", (_blob, url) => {
      setAudioUrl(url);
      onStop?.();
    });
    return () => {
      off1(); off2(); off3();
    };
  }, [engine, onStop]);

  const fmt = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const start = async () => {
    if (state !== "idle") return;
    try {
      await engine.start();
      onStart?.();
    } catch (e) {
      console.error(e);
    }
  };

  const canStart = state === "idle";
  const canStop  = state === "recording";

  return (
    <div className={styles.wrap}>
      <div className={styles.timer} aria-live="polite">{fmt(elapsedMs)}</div>

      <div className={styles.controls}>
        <IconButton
          ariaLabel="녹음 시작"
          onClick={start}
          disabled={!canStart}
          icon={<Mic color={canStart ? "#0EA5E9" : "#9AA4B2"} />}
        />
        <IconButton
          ariaLabel="종료"
          onClick={() => onRequestConfirmStop?.()}
          disabled={!canStop}
          icon={<Square color={canStop ? "#EF4444" : "#9AA4B2"} />}
        />
      </div>

      <div className={styles.stateText}>
        {state === "idle" && "대기 중"}
        {state === "recording" && "녹음 중"}
        {state === "stopped" && "종료됨"}
      </div>

      {audioUrl && state === "stopped" && (
        <div style={{ display: "grid", gap: 8 }}>
          <audio src={audioUrl} controls />
        </div>
      )}
    </div>
  );
}