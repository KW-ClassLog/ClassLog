declare module 'mic-recorder-to-mp3' {
    export default class MicRecorder {
      constructor(options?: { bitRate?: number; sampleRate?: number; encoder?: 'lamejs' });
      start(): Promise<void>;
      stop(): { getMp3(): Promise<[ArrayBuffer, Blob]> };
      pause?: () => void;
      resume?: () => void;
    }
  }