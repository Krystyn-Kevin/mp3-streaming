import { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { useSongUpload } from "../../hooks/useSongUpload";
import FileDropzone from "./FileDropzone";

const STAGE_LABEL = {
  reading: "Reading track info…",
  audio: "Uploading audio…",
  cover: "Uploading cover art…",
  saving: "Saving to your library…",
  done: "Added to the library!",
};

export default function UploadForm({ onUploaded }) {
  const { uploadSong, progress, stage, error, reset, isUploading } = useSongUpload();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [composer, setComposer] = useState("");
  const [album, setAlbum] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [formError, setFormError] = useState("");

  function resetForm() {
    setTitle("");
    setArtist("");
    setComposer("");
    setAlbum("");
    setAudioFile(null);
    setCoverFile(null);
    setFormError("");
    reset();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    try {
      await uploadSong({ title, artist, composer, album, audioFile, coverFile });
      onUploaded?.();
      setTimeout(resetForm, 1200);
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <p className="text-sm text-text-secondary">
        Songs you add here are visible to <span className="text-text-primary">everyone</span> — this is a shared
        library, not a private one.
      </p>

      <FileDropzone
        label="Audio file"
        hint="MP3, WAV, or M4A"
        accept="audio/*"
        icon="audio"
        file={audioFile}
        onChange={setAudioFile}
      />

      <FileDropzone
        label="Cover art (optional)"
        hint="JPG or PNG, square works best"
        accept="image/*"
        icon="image"
        file={coverFile}
        onChange={setCoverFile}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Title *
          </label>
          <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Song title" />
        </div>
        <div>
          <label htmlFor="artist" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Artist *
          </label>
          <input id="artist" required value={artist} onChange={(e) => setArtist(e.target.value)} className="input-field" placeholder="Artist name" />
        </div>
        <div>
          <label htmlFor="composer" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Composer
          </label>
          <input id="composer" value={composer} onChange={(e) => setComposer(e.target.value)} className="input-field" placeholder="Optional" />
        </div>
        <div>
          <label htmlFor="album" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Album
          </label>
          <input id="album" value={album} onChange={(e) => setAlbum(e.target.value)} className="input-field" placeholder="Defaults to “Singles”" />
        </div>
      </div>

      {(formError || error) && (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger" role="alert">
          {formError || error}
        </p>
      )}

      {isUploading && (
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <Loader2 size={12} className="animate-spin" />
              {STAGE_LABEL[stage] || "Uploading…"}
            </span>
            <span className="font-mono text-text-tertiary">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-subtle">
            <div className="h-full rounded-full bg-accent transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {stage === "done" && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <CheckCircle2 size={14} />
          Added — it's live in the library now.
        </p>
      )}

      <button type="submit" disabled={isUploading} className="btn-primary w-full justify-center">
        {isUploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
        {isUploading ? "Uploading…" : "Add to library"}
      </button>
    </form>
  );
}
