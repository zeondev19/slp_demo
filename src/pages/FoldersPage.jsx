import { useState, useEffect } from 'react';
import { 
  FolderPlus, FolderOpen, Play, Trash2, Edit2, Copy, 
  Plus, Check, X, Sparkles, BookOpen, Clock, ArrowRight,
  ListOrdered, Layers, CheckCircle2, ChevronRight, FileText
} from 'lucide-react';
import { api } from '../lib/api';
import LessonModal from '../components/LessonModal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

const AI_GOALS = [
  { id: 'g1', label: 'Following two-step directions', domain: 'Language', skill: 'Receptive Language' },
  { id: 'g2', label: 'Answering WHERE questions', domain: 'Language', skill: 'Auditory Memory' },
  { id: 'g3', label: 'Producing /S/ in sentences', domain: 'Articulation', skill: 'Phoneme Production' },
  { id: 'g4', label: 'Using past tense verbs in conversation', domain: 'Language', skill: 'Syntax Development' },
  { id: 'g5', label: 'Turn-taking in peer conversation', domain: 'Pragmatics', skill: 'Social Communication' },
  { id: 'g6', label: 'Sequencing 3-step event stories', domain: 'Language', skill: 'Executive Function' },
  { id: 'g7', label: 'Easy onset fluency technique', domain: 'Fluency', skill: 'Fluency Shaping' },
  { id: 'g8', label: 'Producing initial /R/ blends in words', domain: 'Articulation', skill: 'Oral Motor Placement' },
];

export default function FoldersPage() {
  // Folder / Playlist states
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);

  // Sequential Therapy Session Playback state
  const [sessionIndex, setSessionIndex] = useState(0);

  // AI Lesson Planner Preview states (Phase 2 Preview)
  const [selectedGoals, setSelectedGoals] = useState(['g1', 'g2', 'g3']);
  const [aiOutputMode, setAiOutputMode] = useState('quick'); // 'quick' | 'full'
  const [generatingAiPlan, setGeneratingAiPlan] = useState(false);
  const [aiPlanReady, setAiPlanReady] = useState(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const res = await api.getPlaylists();
      const list = res.playlists || [];
      setPlaylists(list);
      if (list.length > 0 && !selectedPlaylist) {
        // Load details for first playlist
        const first = await api.getPlaylist(list[0].id);
        setSelectedPlaylist(first.playlist || list[0]);
      }
    } catch (err) {
      console.error('Failed to load playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlaylist = async (pl) => {
    try {
      const res = await api.getPlaylist(pl.id);
      setSelectedPlaylist(res.playlist || pl);
      setSessionIndex(0);
    } catch (err) {
      setSelectedPlaylist(pl);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const tempFolder = {
      id: Date.now(),
      name: newFolderName.trim(),
      description: newFolderDesc.trim(),
      item_count: 0,
      items: [],
    };
    setPlaylists((prev) => [tempFolder, ...prev]);
    setNewFolderName('');
    setNewFolderDesc('');
    setNewFolderModal(false);

    try {
      await api.createPlaylist({
        name: tempFolder.name,
        description: tempFolder.description,
      });
      await loadPlaylists();
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  const handleDeleteFolder = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this folder?')) return;

    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    if (selectedPlaylist?.id === id) {
      setSelectedPlaylist(null);
    }

    try {
      await api.deletePlaylist(id);
    } catch (err) {
      console.error('Failed to delete folder:', err);
    }
  };

  const handleRenameFolder = async (id, e) => {
    e.stopPropagation();
    if (!editName.trim()) return;

    const newName = editName.trim();
    setEditingId(null);
    setPlaylists((prev) => prev.map((p) => (p.id === id ? { ...p, name: newName } : p)));
    if (selectedPlaylist?.id === id) {
      setSelectedPlaylist((prev) => (prev ? { ...prev, name: newName } : prev));
    }

    try {
      await api.updatePlaylist(id, { name: newName });
    } catch (err) {
      console.error('Failed to rename folder:', err);
    }
  };

  const handleRemoveItem = async (itemId, e) => {
    e.stopPropagation();
    if (!selectedPlaylist) return;

    setSelectedPlaylist((prev) =>
      prev
        ? {
            ...prev,
            items: (prev.items || []).filter(
              (it) => it.item_id !== itemId && it.id !== itemId && it.lesson_id !== itemId
            ),
          }
        : prev
    );
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === selectedPlaylist.id
          ? { ...p, item_count: Math.max(0, Number(p.item_count || 1) - 1) }
          : p
      )
    );

    try {
      await api.removeFromPlaylist(selectedPlaylist.id, itemId);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleGoalToggle = (goalId) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const handleRunAiMatching = () => {
    setGeneratingAiPlan(true);
    setTimeout(() => {
      setGeneratingAiPlan(false);
      setAiPlanReady(true);
    }, 600);
  };

  const handleStartTherapySession = () => {
    const items = selectedPlaylist?.items || [];
    if (items.length > 0) {
      setActiveLesson(items[sessionIndex] || items[0]);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Top Banner */}
      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase font-mono tracking-wider text-primary font-bold">
            Personal Library &amp; AI Engine
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text">
            My Folders &amp; AI Lesson Planner
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your daily speech groups, run sequential therapy sessions, or let the AI engine map multiple goals into unified activities.
          </p>
        </div>

        <Button
          onClick={() => setNewFolderModal(true)}
          variant="primary"
          size="md"
          className="gap-1.5 shrink-0"
        >
          <FolderPlus className="w-4 h-4" />
          Create New Folder
        </Button>
      </div>

      {/* Two Column Layout: Folders & Playlists (60%) | AI Lesson Planner (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section: My Folders Management (7 cols / 60%) */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-text flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Custom Playlists &amp; Weekly Folders
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              {playlists.length} Folders Available
            </span>
          </div>

          {/* Folder Chips / List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {playlists.map((pl) => {
              const isSelected = selectedPlaylist?.id === pl.id;
              return (
                <div
                  key={pl.id}
                  onClick={() => handleSelectPlaylist(pl)}
                  className={`
                    p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between
                    ${
                      isSelected
                        ? 'bg-warm-bg border-primary ring-2 ring-primary/20 shadow-xs'
                        : 'bg-surface border-border hover:border-primary/40'
                    }
                  `}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        <FolderOpen className="w-4 h-4" />
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(pl.id);
                            setEditName(pl.name);
                          }}
                          className="p-1 hover:text-primary text-stone-400 cursor-pointer"
                          title="Rename folder"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteFolder(pl.id, e)}
                          className="p-1 hover:text-error text-stone-400 cursor-pointer"
                          title="Delete folder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {editingId === pl.id ? (
                      <div className="flex items-center gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-7 px-2 text-xs rounded border border-primary w-full"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={(e) => handleRenameFolder(pl.id, e)}
                          className="p-1 bg-primary text-white rounded cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <h4 className="font-heading text-sm font-bold text-text truncate pt-1">
                        {pl.name}
                      </h4>
                    )}

                    <p className="text-[11px] text-text-muted line-clamp-1">
                      {pl.description || 'Weekly group session'}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-border flex items-center justify-between text-xs text-stone-500">
                    <span className="font-mono text-[11px]">
                      {pl.item_count || (pl.items?.length || 0)} materials
                    </span>
                    <span className="text-primary font-semibold text-[11px]">
                      {isSelected ? 'Active Folder' : 'View Items'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Folder Detail & Sequential Session Runner */}
          {selectedPlaylist && (
            <Card className="p-6 bg-surface border border-border space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary">
                      Selected Playlist
                    </span>
                    <h3 className="font-heading text-lg font-bold text-text">
                      {selectedPlaylist.name}
                    </h3>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    {selectedPlaylist.description || 'Sequential therapy playlist.'}
                  </p>
                </div>

                {/* Sequential Session Button */}
                <Button
                  onClick={handleStartTherapySession}
                  disabled={!selectedPlaylist.items || selectedPlaylist.items.length === 0}
                  variant="primary"
                  size="md"
                  className="gap-2 shrink-0 shadow-xs"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Start Therapy Session
                </Button>
              </div>

              {/* Items List in this Folder */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
                  <span>Sequence of Materials ({selectedPlaylist.items?.length || 0})</span>
                  <span>Sequential Playback Order</span>
                </div>

                {selectedPlaylist.items && selectedPlaylist.items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPlaylist.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3 rounded-lg border border-border bg-stone-50/60 hover:bg-warm-bg/40 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <h5 className="font-heading text-xs font-bold text-text truncate">
                              {item.title}
                            </h5>
                            <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                              <span>{item.domain}</span>
                              <span>•</span>
                              <span>{item.target}</span>
                              <span>•</span>
                              <span>{item.level}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveLesson(item)}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-current" /> Launch
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveItem(item.id, e)}
                            className="p-1.5 text-stone-400 hover:text-error rounded hover:bg-stone-100 cursor-pointer"
                            title="Remove from playlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-lg">
                    This folder is empty. Browse the Search Library and click &ldquo;+ Add to Folder&rdquo; on any lesson.
                  </div>
                )}
              </div>
            </Card>
          )}
        </section>

        {/* Right Section: Phase 2 Preview AI Lesson Planner (5 cols / 40%) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-surface border-2 border-secondary/40 rounded-xl p-6 space-y-5 shadow-xs">
            {/* Header with Phase 2 Chip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-secondary/30 text-amber-950 border border-secondary">
                  Phase 2 Preview
                </span>
                <span className="text-xs font-mono text-stone-400 font-medium">
                  Smart Multi-Goal Engine
                </span>
              </div>
              <h2 className="font-heading text-xl font-bold text-text flex items-center gap-2">
                AI Lesson Finder &amp; Planner
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Check multiple therapy targets for your mixed speech group. The engine finds single activities covering all selected goals simultaneously.
              </p>
            </div>

            {/* Goal Selection Engine (Checkboxes) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Select Therapy Goals (Choose 2 or more):
              </label>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {AI_GOALS.map((goal) => {
                  const isChecked = selectedGoals.includes(goal.id);
                  return (
                    <div
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`
                        p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors
                        ${
                          isChecked
                            ? 'bg-warm-bg border-primary font-semibold text-text'
                            : 'bg-stone-50/50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`
                            w-4 h-4 rounded border flex items-center justify-center shrink-0
                            ${
                              isChecked
                                ? 'bg-primary border-primary text-white'
                                : 'border-stone-300 bg-white'
                            }
                          `}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-3" />}
                        </div>
                        <span>{goal.label}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200/60 text-stone-600">
                        {goal.domain}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handleRunAiMatching}
                disabled={selectedGoals.length < 2 || generatingAiPlan}
                variant="primary"
                size="sm"
                className="w-full gap-2 mt-2 text-xs"
              >
                {generatingAiPlan ? (
                  <>
                    <Spinner className="w-3.5 h-3.5 text-white" />
                    Analyzing Target Matrix...
                  </>
                ) : (
                  <>
                    Run Smart Goal Matcher ({selectedGoals.length} Goals)
                  </>
                )}
              </Button>
            </div>

            {/* Dual Output Generator Area */}
            {aiPlanReady && (
              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-stone-700">
                    Generated Therapy Plan
                  </h4>
                  {/* Mode Toggle Pills: Option A vs Option B */}
                  <div className="flex items-center rounded-lg border border-border p-0.5 bg-stone-100 text-[11px] font-medium">
                    <button
                      type="button"
                      onClick={() => setAiOutputMode('quick')}
                      className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        aiOutputMode === 'quick' ? 'bg-white shadow-xs text-primary font-bold' : 'text-stone-600'
                      }`}
                    >
                      Option A: Quick Guide
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiOutputMode('full')}
                      className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        aiOutputMode === 'full' ? 'bg-white shadow-xs text-primary font-bold' : 'text-stone-600'
                      }`}
                    >
                      Option B: Full Plan
                    </button>
                  </div>
                </div>

                {/* Output Display */}
                {aiOutputMode === 'quick' ? (
                  <div className="p-3.5 rounded-lg bg-warm-bg/70 border border-primary/20 space-y-2 text-xs text-stone-800 leading-relaxed">
                    <p className="font-semibold text-primary flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Multi-Goal Integration Strategy:
                    </p>
                    <p>
                      Use the <strong>Safari Animals Interactive Deck</strong> to address all {selectedGoals.length} selected goals simultaneously:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-stone-700 text-[11px]">
                      <li>
                        <strong>Following directions:</strong> Have Student A move the binoculars item to the watering hole before Student B speaks.
                      </li>
                      <li>
                        <strong>WHERE questions:</strong> Ask Student B: &ldquo;Where is the seal resting?&rdquo;
                      </li>
                      <li>
                        <strong>Target /S/ production:</strong> Elicit full sentence response: &ldquo;The snake sits in the sun.&rdquo;
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-stone-50 border border-border space-y-3 text-xs text-stone-800 font-body">
                    <div className="border-b border-border pb-2">
                      <h5 className="font-heading text-sm font-bold text-stone-900">
                        Structured 30-Minute Group Session Plan
                      </h5>
                      <span className="text-[11px] text-stone-500">
                        Targeting {selectedGoals.length} Integrated Clinical Goals
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px] leading-relaxed">
                      <div>
                        <strong className="text-primary uppercase tracking-wider font-mono text-[10px] block">
                          Phase 1: Warm-Up (5 Mins)
                        </strong>
                        Model visual tongue placement for /s/ sound. Review classroom listening rules with token board.
                      </div>
                      <div>
                        <strong className="text-primary uppercase tracking-wider font-mono text-[10px] block">
                          Phase 2: Core Interactive Activity (15 Mins)
                        </strong>
                        Open the Safari Deck. Alternate turns between Student A (following two-step directions) and Student B (answering WHERE questions).
                      </div>
                      <div>
                        <strong className="text-primary uppercase tracking-wider font-mono text-[10px] block">
                          Phase 3: Probe Assessment &amp; Co-Evaluation (10 Mins)
                        </strong>
                        Record 10 trials per student. Target benchmark: 80% accuracy over 3 consecutive sessions.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* New Folder Modal */}
      {newFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-text">
                Create Therapy Folder
              </h3>
              <button
                type="button"
                onClick={() => setNewFolderModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Tuesday Kindergarten Group"
                  required
                  className="w-full h-10 px-3 rounded border border-border text-xs focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  placeholder="e.g. Mixed articulation and receptive language"
                  className="w-full h-10 px-3 rounded border border-border text-xs focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setNewFolderModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Folder
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Lesson Modal */}
      <LessonModal
        lesson={activeLesson}
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
      />
    </div>
  );
}
