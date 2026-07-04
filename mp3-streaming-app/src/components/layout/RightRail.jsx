import { Clock } from "lucide-react";
import QueuePanel from "../queue/QueuePanel";
import CoverArt from "../common/CoverArt";
import { useHistory } from "../../hooks/useHistory";

function formatRelativeTime(timestamp) {
  if (!timestamp?.toDate) return "";
  const diffMs = Date.now() - timestamp.toDate().getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function RightRail({ className }) {
  const { history } = useHistory();

  return (
    <aside className={className}>
      <div className="flex h-full flex-col gap-8 border-l border-border-subtle bg-bg-elevated p-5">
        <div className="min-h-0 flex-1">
          <QueuePanel compact />
        </div>

        <div>
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
            <Clock size={12} />
            History
          </p>
          <div className="flex flex-col gap-2">
            {history.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center gap-2.5 opacity-80">
                <CoverArt src={entry.coverArt} size={30} rounded="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{entry.title}</p>
                  <p className="truncate text-[11px] text-text-tertiary">{entry.artist}</p>
                </div>
                <span className="flex-shrink-0 font-mono text-[10px] text-text-tertiary">
                  {formatRelativeTime(entry.playedAt)}
                </span>
              </div>
            ))}
            {history.length === 0 && <p className="text-xs text-text-tertiary">Nothing played yet.</p>}
          </div>
        </div>
      </div>
    </aside>
  );
}
