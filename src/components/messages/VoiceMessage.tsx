import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ModerationResult } from "@/lib/moderation/types";
import { ModerationAlert } from "@/components/chat/ModerationAlert";

interface VoiceMessageProps {
  attachmentId: string;
  moderationResult?: ModerationResult | null;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VoiceMessage({
  attachmentId,
  moderationResult,
}: VoiceMessageProps) {
  const { token } = useAuth();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let revoked = false;
    let url: string | null = null;

    (async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chats/attachments/${attachmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      const blob = await res.blob();
      if (revoked) return;

      url = URL.createObjectURL(blob);
      setAudioUrl(url);
    })();

    return () => {
      revoked = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [attachmentId, token]);

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  if (!audioUrl) {
    return <div className="text-xs opacity-50">Loading voice…</div>;
  }

  const progress =
    duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  return (
    <div className="space-y-2">
      {/* Voice player */}
      <div className="flex items-center gap-3">
        <button
          className="h-8 w-8 rounded-full bg-primary text-primary-foreground"
          onClick={() => {
            const audio = audioRef.current;
            if (!audio) return;

            if (playing) {
              audio.pause();
              setPlaying(false);
            } else {
              audio.play();
              setPlaying(true);
            }
          }}
        >
          {playing ? "■" : "▶"}
        </button>

        <div className="flex flex-col gap-1 flex-1">
          <div className="h-2 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="text-xs text-muted-foreground text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      {/* Moderation feedback */}
      {moderationResult && (
        <ModerationAlert
          result={moderationResult}
          showDetails={true}
        />
      )}
    </div>
  );
}
