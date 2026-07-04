/**
 * Reads the duration (in whole seconds) of an audio File in the browser,
 * without uploading it first — used to populate `duration` on the song
 * document at upload time.
 */
export function getAudioDuration(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Math.round(audio.duration) || 0);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read audio metadata — is this a valid audio file?"));
    };
    audio.src = url;
  });
}
