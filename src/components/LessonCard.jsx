import { useState } from 'react';
import { Heart, Play, FolderPlus, Check, BookOpen, Clock, Trash2 } from 'lucide-react';
import Badge from './ui/Badge';
import Card from './ui/Card';

const DOMAIN_STYLES = {
  Language: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', dot: 'bg-blue-600' },
  Articulation: { bg: 'bg-orange-50', text: 'text-orange-900', border: 'border-orange-200', dot: 'bg-primary' },
  Pragmatics: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-600' },
  Fluency: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  Phonology: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-600' },
};

export default function LessonCard({
  lesson,
  onOpen,
  onFavorite,
  isFavorited = false,
  onAddToFolder,
  userPlaylists = [],
  onDelete,
  canDelete = false,
}) {
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [addedNotice, setAddedNotice] = useState(null);

  if (!lesson) return null;

  const domainStyle = DOMAIN_STYLES[lesson.domain] || DOMAIN_STYLES.Language;

  const handleFolderClick = (e, playlist) => {
    e.stopPropagation();
    setAddedNotice(playlist.name);
    if (onAddToFolder) {
      onAddToFolder(playlist.id, lesson.id);
    }
    setTimeout(() => {
      setAddedNotice(null);
      setShowFolderDropdown(false);
    }, 900);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden group border border-border hover:border-primary/40 transition-all bg-surface">
      {/* Visual Header / Thumbnail Area */}
      <div className={`relative h-36 ${domainStyle.bg} border-b border-border p-4 flex flex-col justify-between overflow-hidden select-none`}>
        {/* Subtle Domain pattern indicator */}
        <div className="flex items-center justify-between z-10">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold ${domainStyle.bg} ${domainStyle.text} border ${domainStyle.border}`}>
            <span className={`w-2 h-2 rounded-full ${domainStyle.dot}`} />
            {lesson.domain}
          </span>

          <div className="flex items-center gap-1.5">
            {lesson.is_new && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white rounded">
                New
              </span>
            )}
            {canDelete && onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(lesson.id);
                }}
                title="Delete lesson"
                aria-label="Delete lesson"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 border border-border flex items-center justify-center text-stone-400 hover:text-error transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onFavorite) onFavorite(lesson.id);
              }}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-border flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorited ? 'fill-primary text-primary' : 'text-stone-400 hover:text-primary'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Thumbnail Center Graphic / Target info */}
        <div className="z-10 my-auto">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">{lesson.target}</p>
          <div className="flex items-center gap-2 text-stone-600 text-xs mt-1">
            <span className="font-medium bg-white/70 px-2 py-0.5 rounded border border-stone-200">
              {lesson.level}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-stone-500">
              <Clock className="w-3 h-3" />
              {lesson.duration_minutes || 15} min
            </span>
          </div>
        </div>

        {/* Format watermark */}
        <div className="text-[11px] text-stone-500 truncate z-10 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lesson.activity_format}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Lesson Title */}
          <h3
            onClick={() => onOpen && onOpen(lesson)}
            className="font-heading text-[16px] font-semibold text-text leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer"
            title={lesson.title}
          >
            {lesson.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
            {lesson.description}
          </p>

          {/* Skill Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {lesson.primary_skill && (
              <Badge variant="primary-skill" className="text-[11px]">
                {lesson.primary_skill}
              </Badge>
            )}
            {lesson.secondary_skill && (
              <Badge variant="secondary-skill" className="text-[11px]">
                {lesson.secondary_skill}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-2 relative">
          <button
            type="button"
            onClick={() => onOpen && onOpen(lesson)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 text-xs font-semibold rounded bg-primary text-white hover:bg-primary-hover active:bg-primary-active transition-colors focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Launch Lesson
          </button>

          {/* Add to Folder Button */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFolderDropdown(!showFolderDropdown);
              }}
              title="Add to folder / playlist"
              className="h-9 w-9 inline-flex items-center justify-center rounded border border-border text-stone-600 hover:text-primary hover:border-primary/40 hover:bg-warm-bg transition-colors focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
            </button>

            {/* Folder dropdown menu */}
            {showFolderDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-2 w-56 bg-surface border border-border rounded-lg shadow-lg p-2 z-30"
              >
                <div className="px-2 py-1 text-xs font-semibold text-stone-500 border-b border-border mb-1">
                  Save to Therapy Folder
                </div>
                {addedNotice ? (
                  <div className="p-2 text-xs text-green-700 bg-green-50 rounded flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Saved to {addedNotice}!
                  </div>
                ) : userPlaylists && userPlaylists.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto flex flex-col gap-0.5">
                    {userPlaylists.map((pl) => (
                      <button
                        key={pl.id}
                        type="button"
                        onClick={(e) => handleFolderClick(e, pl)}
                        className="w-full text-left px-2 py-1.5 text-xs text-stone-700 hover:bg-warm-bg hover:text-primary rounded truncate transition-colors cursor-pointer"
                      >
                        + {pl.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 text-xs text-stone-500">
                    No folders yet. Create one in My Folders.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
