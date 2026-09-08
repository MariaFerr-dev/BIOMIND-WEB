type LocalWhisperCallbacks = {
  initialPrompt?: string;
  onEnd?: () => void;
  onError?: (message: string) => void;
  onResult: (transcript: string, isFinal: boolean) => void;
  onStart?: () => void;
};

export function isLocalWhisperSupported() {
  return false;
}

export function createLocalWhisperSession({ onEnd, onError }: LocalWhisperCallbacks) {
  return {
    start: async () => {
      onError?.('Whisper local solo está disponible en la app móvil.');
    },
    stop: async () => {
      onEnd?.();
    },
  };
}
