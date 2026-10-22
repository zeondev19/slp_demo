import { useState, useEffect } from 'react';
import { 
  X, Heart, FolderPlus, Play, RotateCcw, Volume2, 
  ChevronLeft, ChevronRight, CheckCircle2, Bookmark, 
  ExternalLink, Sparkles, Clock, Target, Award
} from 'lucide-react';
import Badge from './ui/Badge';

export default function LessonModal({
  lesson,
  isOpen,
  onClose,
  isFavorited = false,
  onFavorite,
  userPlaylists = [],
  onAddToFolder,
}) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [therapistNotes, setTherapistNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [folderNotice, setFolderNotice] = useState(null);

  // Load existing notes for this lesson from localStorage
  useEffect(() => {
    if (lesson?.id) {
      setCurrentSlide(1);
      const saved = localStorage.getItem(`slp_notes_${lesson.id}`) || '';
      setTherapistNotes(saved);
      setNotesSaved(false);
    }
  }, [lesson?.id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !lesson) return null;

  const totalSlides = 5;

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setTherapistNotes(val);
    localStorage.setItem(`slp_notes_${lesson.id}`, val);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const playSimulatedAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 2200);
  };

  const handleAddToFolderClick = (playlist) => {
    if (onAddToFolder) {
      onAddToFolder(playlist.id, lesson.id);
      setFolderNotice(playlist.name);
      setTimeout(() => {
        setFolderNotice(null);
        setShowFolderDropdown(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-6xl max-h-[94vh] bg-surface border border-border rounded-xl flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Top Header Bar */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between gap-4 bg-warm-bg/40 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0">
              {lesson.domain}
            </span>
            <h2 id="modal-title" className="font-heading text-lg font-bold text-text truncate">
              {lesson.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Favorite Button */}
            <button
              type="button"
              onClick={() => onFavorite && onFavorite(lesson.id)}
              className="h-9 px-3 rounded border border-border bg-surface hover:bg-warm-bg flex items-center gap-1.5 text-xs font-medium text-stone-700 transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-primary text-primary' : 'text-stone-400'}`} />
              <span className="hidden sm:inline">{isFavorited ? 'Favorited' : 'Favorite'}</span>
            </button>

            {/* Add to Folder Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                className="h-9 px-3 rounded border border-border bg-surface hover:bg-warm-bg flex items-center gap-1.5 text-xs font-medium text-stone-700 transition-colors cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Add to Folder</span>
              </button>

              {showFolderDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-surface border border-border rounded-lg shadow-xl p-2 z-40">
                  <div className="px-2 py-1 text-xs font-semibold text-stone-500 border-b border-border mb-1">
                    Select Therapy Folder
                  </div>
                  {folderNotice ? (
                    <div className="p-2 text-xs text-green-700 bg-green-50 rounded">
                      Saved to {folderNotice}!
                    </div>
                  ) : userPlaylists && userPlaylists.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
                      {userPlaylists.map((pl) => (
                        <button
                          key={pl.id}
                          type="button"
                          onClick={() => handleAddToFolderClick(pl)}
                          className="w-full text-left px-2 py-1.5 text-xs text-stone-700 hover:bg-warm-bg hover:text-primary rounded truncate transition-colors cursor-pointer"
                        >
                          + {pl.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 text-xs text-stone-500">
                      No folders created yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded border border-border bg-surface hover:bg-warm-bg flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer focus:ring-2 focus:ring-primary/20 focus:outline-none"
              aria-label="Close lesson modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two-Column Split (Interactive Media 60% | Teaching Panel 40%) */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto lg:overflow-hidden">
          {/* Left Column: Interactive Genially / Media Viewport */}
          <div className="w-full lg:w-[60%] flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-stone-900 text-white min-h-[380px] lg:min-h-0">
            {/* Viewport Top Bar */}
            <div className="h-10 px-4 bg-stone-950 flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[11px] text-stone-300">
                  Genially Headless Interactive Embed Engine
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>Slide {currentSlide} of {totalSlides}</span>
                <button
                  type="button"
                  onClick={() => setCurrentSlide(1)}
                  title="Reset slide deck"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Slide Canvas Area */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden bg-radial from-stone-800 to-stone-900">
              {/* Slide Content by Number */}
              <div className="w-full max-w-lg bg-surface text-text rounded-lg border-2 border-stone-700 p-6 shadow-xl flex flex-col items-center text-center">
                {currentSlide === 1 && (
                  <div className="space-y-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Warm-Up Exercise
                    </span>
                    <h3 className="font-heading text-xl font-bold text-stone-900">
                      Step 1: Oral Motor Placement
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Place tongue tip behind the upper teeth. Keep lips slightly smiling. Feel the cool air stream through the center.
                    </p>
                    <div className="p-4 bg-warm-bg rounded-lg border border-border flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={playSimulatedAudio}
                        className="px-4 py-2 bg-primary text-white rounded font-medium text-xs flex items-center gap-2 hover:bg-primary-hover transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                        {isPlayingAudio ? 'Playing Cue Audio...' : 'Hear Model Sound'}
                      </button>
                    </div>
                  </div>
                )}

                {currentSlide === 2 && (
                  <div className="space-y-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Target Production
                    </span>
                    <h3 className="font-heading text-xl font-bold text-stone-900">
                      Step 2: Stimulus Repetition
                    </h3>
                    <div className="grid grid-cols-2 gap-3 my-2 text-left">
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded text-center">
                        <span className="text-2xl font-bold text-primary block">/S/</span>
                        <span className="text-xs text-stone-500">Initial Sound</span>
                      </div>
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded text-center">
                        <span className="text-2xl font-bold text-tertiary block">5x</span>
                        <span className="text-xs text-stone-500">Target Repetitions</span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-500">
                      Tap the counter for each accurate production by the student.
                    </p>
                  </div>
                )}

                {currentSlide === 3 && (
                  <div className="space-y-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Carrier Phrase
                    </span>
                    <h3 className="font-heading text-xl font-bold text-stone-900">
                      Step 3: Structured Context
                    </h3>
                    <div className="p-4 bg-warm-bg/70 border-2 border-dashed border-primary/30 rounded-lg">
                      <p className="font-heading text-lg font-medium text-stone-800">
                        &quot;I can see the <span className="text-primary font-bold">{lesson.target}</span> over there.&quot;
                      </p>
                    </div>
                    <p className="text-xs text-stone-600">
                      Encourage natural intonation and rate of speech while retaining clear articulation.
                    </p>
                  </div>
                )}

                {currentSlide === 4 && (
                  <div className="space-y-4">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Interactive Challenge
                    </span>
                    <h3 className="font-heading text-xl font-bold text-stone-900">
                      Step 4: Rapid Picture Naming
                    </h3>
                    <p className="text-sm text-stone-600">
                      Show target items one by one. Prompt the student to produce the full sentence without clinician cueing.
                    </p>
                    <div className="flex justify-center gap-2 pt-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                        Accuracy: 85%
                      </span>
                    </div>
                  </div>
                )}

                {currentSlide === 5 && (
                  <div className="space-y-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Session Summary
                    </span>
                    <Award className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="font-heading text-xl font-bold text-stone-900">
                      Lesson Complete!
                    </h3>
                    <p className="text-sm text-stone-600">
                      Great work! Record private session notes in the right-hand panel before moving to the next lesson.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Viewport Playback Control Bar */}
            <div className="h-14 px-6 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
              <button
                type="button"
                disabled={currentSlide <= 1}
                onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Slide
              </button>

              {/* Slide Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentSlide(num)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === num ? 'bg-primary w-6' : 'bg-stone-600 hover:bg-stone-400'
                    }`}
                    aria-label={`Jump to slide ${num}`}
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={currentSlide >= totalSlides}
                onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
                className="px-4 py-2 rounded bg-primary hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-white"
              >
                Next Slide
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Teaching Script, Notes, Metadata */}
          <div className="w-full lg:w-[40%] flex flex-col bg-surface overflow-y-auto p-6 space-y-6">
            {/* Step-by-Step Teaching Script Panel */}
            <div className="p-4 rounded-lg bg-warm-bg border border-border space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase font-mono">
                <Target className="w-4 h-4" />
                Step-by-Step Teaching Script
              </div>
              <p className="text-sm text-text leading-relaxed font-body">
                {lesson.teaching_script || 'Model the target sound clearly using visual placement cues. Have the student repeat 5 times with immediate feedback before moving to interactive games.'}
              </p>
            </div>

            {/* Target Objectives & Materials */}
            <div className="space-y-3">
              <h4 className="font-heading text-sm font-semibold text-text">
                Session Objective &amp; Materials
              </h4>
              <div className="text-xs text-text-muted space-y-1.5 bg-stone-50 p-3 rounded border border-border">
                <p>
                  <strong className="text-text">Goal:</strong> {lesson.objectives || `Demonstrate master of ${lesson.target} at the ${lesson.level} level with 80% accuracy.`}
                </p>
                <p>
                  <strong className="text-text">Materials Needed:</strong> {lesson.materials || 'Interactive device (iPad / Laptop), token board, mirror.'}
                </p>
                {lesson.preparation_notes && (
                  <p>
                    <strong className="text-text">Prep Note:</strong> {lesson.preparation_notes}
                  </p>
                )}
              </div>
            </div>

            {/* Metadata Tags */}
            <div className="space-y-2">
              <h4 className="font-heading text-sm font-semibold text-text">
                Curriculum Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="primary-skill">{lesson.primary_skill}</Badge>
                {lesson.secondary_skill && (
                  <Badge variant="secondary-skill">{lesson.secondary_skill}</Badge>
                )}
                <Badge variant="domain">{lesson.domain}</Badge>
                <Badge variant="level">{lesson.level}</Badge>
              </div>
            </div>

            {/* Private Therapist Notes Area */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="therapist-notes" 
                  className="font-heading text-sm font-semibold text-text flex items-center gap-1.5"
                >
                  <Bookmark className="w-4 h-4 text-primary" />
                  Private Therapist Notes
                </label>
                {notesSaved && (
                  <span className="text-[11px] text-green-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Auto-saved
                  </span>
                )}
              </div>
              <textarea
                id="therapist-notes"
                value={therapistNotes}
                onChange={handleNotesChange}
                placeholder="Write student performance notes, baseline percentages, or cues to remember for next session..."
                rows={4}
                className="w-full text-xs p-3 rounded border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none bg-stone-50/50"
              />
              <p className="text-[11px] text-text-light">
                Notes are private and synced automatically to your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
