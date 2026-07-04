import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import clsx from "clsx";
import CoverArt from "../common/CoverArt";
import { formatTime } from "../../utils/formatTime";

export default function SortableQueueRow({ song, index, onRemove, onPlay, compact }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: song.__queueKey,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "group flex items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-surface",
        isDragging && "bg-surface shadow-floating scale-[1.02]"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-text-tertiary opacity-60 hover:text-text-primary active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      <button onClick={onPlay} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
        <CoverArt src={song.coverArt} size={compact ? 34 : 40} rounded="sm" />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-text-primary">{song.title}</p>
          <p className="truncate text-[11.5px] text-text-tertiary">{song.artist}</p>
        </div>
      </button>

      <span className="font-mono text-[11px] text-text-tertiary">{formatTime(song.duration)}</span>

      <button
        onClick={() => onRemove(index)}
        aria-label={`Remove ${song.title} from queue`}
        className="opacity-0 text-text-tertiary transition-opacity hover:text-danger group-hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}
