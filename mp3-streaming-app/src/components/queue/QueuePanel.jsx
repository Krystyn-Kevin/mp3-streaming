import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ListMusic, Trash2 } from "lucide-react";
import { usePlayerStore } from "../../store/usePlayerStore";
import SortableQueueRow from "./SortableQueueRow";
import CoverArt from "../common/CoverArt";
import { formatTime } from "../../utils/formatTime";

export default function QueuePanel({ compact = false }) {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);
  const reorderQueue = usePlayerStore((s) => s.reorderQueue);
  const jumpToQueueIndex = usePlayerStore((s) => s.jumpToQueueIndex);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;
  const upcoming = queue.slice(currentIndex + 1);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = queue.findIndex((s) => s.__queueKey === active.id);
    const toIndex = queue.findIndex((s) => s.__queueKey === over.id);
    if (fromIndex === -1 || toIndex === -1) return;
    reorderQueue(fromIndex, toIndex);
  }

  if (!queue.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 py-12 text-center">
        <ListMusic className="text-text-tertiary" size={28} />
        <p className="text-sm font-medium text-text-secondary">Your queue is empty</p>
        <p className="text-xs text-text-tertiary">Play a song to start building your queue.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6">
      {currentSong && (
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">Now Playing</p>
          <div className="flex items-center gap-3 rounded-md border border-border-subtle bg-surface/60 p-2.5">
            <CoverArt src={currentSong.coverArt} size={compact ? 40 : 48} spinning />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-accent">{currentSong.title}</p>
              <p className="truncate text-xs text-text-tertiary">{currentSong.artist}</p>
            </div>
            <span className="ml-auto font-mono text-[11px] text-text-tertiary">
              {formatTime(currentSong.duration)}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
            Up Next · {upcoming.length}
          </p>
          <button
            onClick={clearQueue}
            className="flex items-center gap-1 text-[11px] font-medium text-text-tertiary hover:text-danger"
          >
            <Trash2 size={12} />
            Clear queue
          </button>
        </div>

        {upcoming.length === 0 ? (
          <p className="text-xs text-text-tertiary">Nothing queued up next.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={upcoming.map((s) => s.__queueKey)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-0.5">
                {upcoming.map((song, i) => {
                  const realIndex = currentIndex + 1 + i;
                  return (
                    <SortableQueueRow
                      key={song.__queueKey}
                      song={song}
                      index={realIndex}
                      compact={compact}
                      onRemove={removeFromQueue}
                      onPlay={() => jumpToQueueIndex(realIndex)}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
