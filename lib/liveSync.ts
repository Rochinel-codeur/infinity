type SyncPayload = {
  topic: string;
  ts: number;
};

const LIVE_SYNC_CHANNEL = "prince-final-live-sync";
const LIVE_SYNC_STORAGE_KEY = "__prince_final_live_sync__";

function parsePayload(raw: string | null): SyncPayload | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as SyncPayload;
    if (!data?.topic || typeof data.topic !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

export function emitLiveSync(topic: string) {
  if (typeof window === "undefined") return;

  const payload: SyncPayload = { topic, ts: Date.now() };
  const serialized = JSON.stringify(payload);

  try {
    const channel = new BroadcastChannel(LIVE_SYNC_CHANNEL);
    channel.postMessage(payload);
    channel.close();
  } catch {
    // Ignore channel errors and keep localStorage fallback.
  }

  try {
    localStorage.setItem(LIVE_SYNC_STORAGE_KEY, serialized);
    localStorage.removeItem(LIVE_SYNC_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function subscribeLiveSync(onSync: (topic: string) => void) {
  if (typeof window === "undefined") return () => undefined;

  let channel: BroadcastChannel | null = null;

  try {
    channel = new BroadcastChannel(LIVE_SYNC_CHANNEL);
    channel.onmessage = (event: MessageEvent<SyncPayload>) => {
      const topic = event.data?.topic;
      if (topic) onSync(topic);
    };
  } catch {
    channel = null;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key !== LIVE_SYNC_STORAGE_KEY) return;
    const payload = parsePayload(event.newValue);
    if (payload?.topic) onSync(payload.topic);
  };

  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("storage", onStorage);
    if (channel) {
      channel.close();
    }
  };
}
