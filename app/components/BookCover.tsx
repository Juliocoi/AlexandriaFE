import { useState } from "react";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  coverUrl?: string | null;
  title: string;
  author?: string;
  className?: string;
}

export function BookCover({
  coverUrl,
  title,
  author,
  className = "h-28 w-20",
}: BookCoverProps) {
  const [failed, setFailed] = useState(false);

  if (coverUrl && !failed) {
    return (
      <img
        src={coverUrl}
        alt={title}
        onError={() => setFailed(true)}
        className={`${className} shrink-0 rounded-md border border-[#1A2B45] bg-[#0B1729] object-cover shadow-md`}
      />
    );
  }

  return (
    <div
      className={`${className} flex shrink-0 flex-col items-center justify-between rounded-md border border-[#1F3352] bg-gradient-to-br from-[#13294B] to-[#0B1729] p-2 text-center text-white shadow-md`}
    >
      <span className="line-clamp-1 text-[8px] font-medium text-[#8A9AB1]">
        {author ?? "Biblioteca Virtual"}
      </span>
      <BookOpen className="h-5 w-5 text-[#1D7BF5]" />
      <span className="line-clamp-2 text-[9px] font-semibold leading-tight">
        {title}
      </span>
    </div>
  );
}
