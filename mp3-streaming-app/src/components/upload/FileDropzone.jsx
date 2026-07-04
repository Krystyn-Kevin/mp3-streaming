import { useRef, useState } from "react";
import { UploadCloud, FileAudio, Image as ImageIcon, X } from "lucide-react";
import clsx from "clsx";

export default function FileDropzone({ accept, file, onChange, label, hint, icon = "audio" }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const Icon = icon === "audio" ? FileAudio : ImageIcon;

  function handleFiles(fileList) {
    const picked = fileList?.[0];
    if (picked) onChange(picked);
  }

  return (
    <div>
      <p className="mb-1.5 block text-xs font-medium text-text-secondary">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        className={clsx(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-6 text-center transition-colors",
          dragOver ? "border-accent bg-accent/5" : "border-border-subtle hover:bg-surface-hover"
        )}
      >
        {file ? (
          <div className="flex w-full items-center gap-3 text-left">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
              <p className="text-xs text-text-tertiary">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              aria-label="Remove file"
              className="icon-btn flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud size={20} className="text-text-tertiary" />
            <p className="text-xs text-text-secondary">
              <span className="font-medium text-accent">Click to choose</span> or drag a file here
            </p>
            {hint && <p className="text-[11px] text-text-tertiary">{hint}</p>}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
