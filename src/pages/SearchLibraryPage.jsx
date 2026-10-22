import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, X, BookmarkCheck, ArrowUpDown, 
  RotateCcw, SlidersHorizontal, ChevronDown, Check, Sparkles 
} from 'lucide-react';
import { api } from '../lib/api';
import LessonCard from '../components/LessonCard';
import LessonModal from '../components/LessonModal';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const DOMAINS = ['Language', 'Articulation', 'Pragmatics', 'Fluency', 'Phonology'];

const TARGETS_BY_DOMAIN = {
  All: [
    'Initial /S/', 'Final /S/', 'Initial /R/', 'R-Blends', 'S-Blends',
    'WH Questions', '2-Step Directions', '3-Step Directions', 'Categories',
    'Past Tense Verbs', 'Plurals', 'Turn Taking', 'Topic Maintenance',
    'Social Problem Solving', 'Easy Onsets', 'Fronting Remediation'
  ],
  Language: [
    'WH Questions', '2-Step Directions', '3-Step Directions', 
    'Categories', 'Past Tense Verbs', 'Plurals', 'Sequencing', 'Spatial Concepts'
  ],
  Articulation: [
    'Initial /S/', 'Final /S/', 'Initial /R/', 'Vocalic R', 
    'R-Blends', 'S-Blends', 'Initial /L/', 'TH Sounds'
  ],
  Pragmatics: [
    'Turn Taking', 'Topic Maintenance', 'Social Problem Solving', 
    'Perspective Taking', 'Emotion Recognition', 'Conversational Repair'
  ],
  Fluency: [
    'Easy Onsets', 'Light Articulatory Contacts', 'Continuous Phonation', 
    'Pacing & Rate Control', 'Pausing & Chunking', 'Cancellation Technique'
  ],
  Phonology: [
    'Fronting Remediation', 'Stopping of Fricatives', 'Cluster Reduction', 
    'Final Consonant Deletion', 'Gliding of Liquids', 'Minimal Pairs /k/ vs /t/'
  ]
};

const LEVELS = ['Isolation', 'Syllable', 'Word', 'Phrase', 'Sentence', 'Conversation'];

const FORMATS = [
  'Interactive Genially Deck', 'Printable Worksheet', 'Teaching Script', 
  'Flashcards', 'Assessment'
];

const TOPICS = [
  'Animals', 'School', 'Seasonal', 'Everyday Routines', 
  'Food & Cooking', 'Sports & Games', 'Community Helpers', 'Nature & Outdoors'
];

export default function SearchLibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and Filter states initialized from URL params
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get('domain') || '');
  const [selectedTarget, setSelectedTarget] = useState(searchParams.get('target') || '');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || '');
  const [selectedFormat, setSelectedFormat] = useState(searchParams.get('activity_format') || '');
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevant');
  const [page, setPage] = useState(1);
  const pageSize = 24;

  // Data states
  const [lessons, setLessons] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterQuerySpeed, setFilterQuerySpeed] = useState('1.20');
  const [saveFilterModal, setSaveFilterModal] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState('');
  const [filterSavedSuccess, setFilterSavedSuccess] = useState(false);
  const clientQueryCache = useRef(new Map());

  // Sync to URL params
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedDomain) params.set('domain', selectedDomain);
    if (selectedTarget) params.set('target', selectedTarget);
    if (selectedLevel) params.set('level', selectedLevel);
    if (selectedFormat) params.set('activity_format', selectedFormat);
    if (selectedTopic) params.set('topic', selectedTopic);
    if (sortBy && sortBy !== 'relevant') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [query, selectedDomain, selectedTarget, selectedLevel, selectedFormat, selectedTopic, sortBy, setSearchParams]);

  // Load favorites & playlists once
  useEffect(() => {
    async function loadMeta() {
      try {
        const [favRes, plRes] = await Promise.all([
          api.getFavorites(),
          api.getPlaylists()
        ]);
        setFavorites(favRes.ids || (favRes.favorites || []).map((f) => f.id || f.lesson_id));
        setUserPlaylists(plRes.playlists || []);
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch lessons with query timer and client-side instant cache
  useEffect(() => {
    let isMounted = true;
    updateURL();

    const cacheKey = JSON.stringify({
      q: query,
      domain: selectedDomain,
      target: selectedTarget,
      level: selectedLevel,
      activity_format: selectedFormat,
      topic: selectedTopic,
      sort: sortBy,
      page,
      limit: pageSize,
    });

    async function fetchFilteredLessons() {
      const startTime = performance.now();

      // Check instant client cache first
      if (clientQueryCache.current.has(cacheKey)) {
        const cached = clientQueryCache.current.get(cacheKey);
        const duration = (performance.now() - startTime).toFixed(2);
        setFilterQuerySpeed(duration);
        setLessons(cached.lessons || []);
        setTotal(cached.total || 0);
        return;
      }

      setLoading(true);

      try {
        const res = await api.getLessons({
          q: query,
          domain: selectedDomain,
          target: selectedTarget,
          level: selectedLevel,
          activity_format: selectedFormat,
          topic: selectedTopic,
          sort: sortBy,
          page,
          limit: pageSize,
        });

        if (isMounted) {
          const duration = (performance.now() - startTime).toFixed(2);
          setFilterQuerySpeed(duration);
          setLessons(res.lessons || []);
          setTotal(res.total || 0);
          clientQueryCache.current.set(cacheKey, res);
        }
      } catch (err) {
        console.error('Error fetching lessons:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Debounce query search slightly, filter clicks are instant
    const timer = setTimeout(fetchFilteredLessons, query ? 150 : 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, selectedDomain, selectedTarget, selectedLevel, selectedFormat, selectedTopic, sortBy, page, updateURL]);

  const handleFavoriteToggle = async (lessonId) => {
    try {
      const res = await api.toggleFavorite(lessonId);
      if (res && res.favorites) {
        setFavorites(res.favorites);
      } else {
        setFavorites((prev) =>
          prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
        );
      }
    } catch (err) {
      console.error('Failed to favorite:', err);
    }
  };

  const handleAddToFolder = async (playlistId, lessonId) => {
    try {
      await api.addToPlaylist(playlistId, lessonId);
    } catch (err) {
      console.error('Failed to add to folder:', err);
    }
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedDomain('');
    setSelectedTarget('');
    setSelectedLevel('');
    setSelectedFormat('');
    setSelectedTopic('');
    setSortBy('relevant');
    setPage(1);
  };

  const handleSaveFilterCombo = async (e) => {
    e.preventDefault();
    if (!saveFilterName.trim()) return;

    try {
      await api.saveFilter(saveFilterName.trim(), {
        domain: selectedDomain,
        target: selectedTarget,
        level: selectedLevel,
        activity_format: selectedFormat,
        topic: selectedTopic,
      });
      setFilterSavedSuccess(true);
      setTimeout(() => {
        setFilterSavedSuccess(false);
        setSaveFilterModal(false);
        setSaveFilterName('');
      }, 1500);
    } catch (err) {
      console.error('Error saving filter:', err);
    }
  };

  const activeFilterCount = [
    selectedDomain, selectedTarget, selectedLevel, selectedFormat, selectedTopic
  ].filter(Boolean).length;

  const availableTargets = selectedDomain
    ? (TARGETS_BY_DOMAIN[selectedDomain] || TARGETS_BY_DOMAIN.All)
    : TARGETS_BY_DOMAIN.All;

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner and Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-xs uppercase font-mono tracking-wider text-primary font-bold">
            Full Materials Catalog
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text">
            Search &amp; Filter Library (1,000+ Items)
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Zero-reload instant querying across all speech therapy domains, target phonemes, and structured levels.
          </p>
        </div>

        {/* Speed and Total Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-500">Query Speed:</span>
            <span className="font-bold text-emerald-700">{filterQuerySpeed} ms</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden h-9 px-3 rounded border border-border bg-surface flex items-center gap-1.5 text-xs font-semibold text-stone-700"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Results Grid */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Multi-Facet Sidebar */}
        <aside
          className={`
            w-full md:w-72 shrink-0 bg-surface border border-border rounded-xl p-5 space-y-6
            ${mobileFilterOpen ? 'block' : 'hidden md:block'}
          `}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-heading text-sm font-bold text-text flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Filter Facets
            </h3>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-primary hover:underline font-medium cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* 1. Domain / Curriculum */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Curriculum Domain
            </label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => { setSelectedDomain(''); setSelectedTarget(''); setPage(1); }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  selectedDomain === ''
                    ? 'bg-primary text-white font-semibold'
                    : 'text-stone-700 hover:bg-warm-bg'
                }`}
              >
                <span>All Domains</span>
                <span className="text-[11px] opacity-70">1,000</span>
              </button>
              {DOMAINS.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => { setSelectedDomain(dom === selectedDomain ? '' : dom); setSelectedTarget(''); setPage(1); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedDomain === dom
                      ? 'bg-primary text-white font-semibold'
                      : 'text-stone-700 hover:bg-warm-bg'
                  }`}
                >
                  <span>{dom}</span>
                  {selectedDomain === dom && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Specific Target Sound / Goal */}
          <div className="space-y-2.5 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Target / Goal
              </label>
              {selectedTarget && (
                <button
                  type="button"
                  onClick={() => { setSelectedTarget(''); setPage(1); }}
                  className="text-[11px] text-stone-400 hover:text-primary"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
              {availableTargets.map((tgt) => (
                <button
                  key={tgt}
                  type="button"
                  onClick={() => { setSelectedTarget(tgt === selectedTarget ? '' : tgt); setPage(1); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedTarget === tgt
                      ? 'bg-secondary/30 text-amber-950 font-semibold border border-secondary'
                      : 'text-stone-700 hover:bg-warm-bg'
                  }`}
                >
                  <span className="truncate">{tgt}</span>
                  {selectedTarget === tgt && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Level */}
          <div className="space-y-2.5 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Hierarchy Level
              </label>
              {selectedLevel && (
                <button
                  type="button"
                  onClick={() => { setSelectedLevel(''); setPage(1); }}
                  className="text-[11px] text-stone-400 hover:text-primary"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => { setSelectedLevel(lvl === selectedLevel ? '' : lvl); setPage(1); }}
                  className={`px-2 py-1.5 rounded text-xs font-medium border text-center transition-colors cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface border-border text-stone-700 hover:bg-warm-bg'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Activity Format */}
          <div className="space-y-2.5 pt-3 border-t border-border">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Activity Format
            </label>
            <div className="space-y-1">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => { setSelectedFormat(fmt === selectedFormat ? '' : fmt); setPage(1); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedFormat === fmt
                      ? 'bg-primary text-white font-semibold'
                      : 'text-stone-700 hover:bg-warm-bg'
                  }`}
                >
                  <span className="truncate">{fmt}</span>
                  {selectedFormat === fmt && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Topic / Theme */}
          <div className="space-y-2.5 pt-3 border-t border-border">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Topic / Theme
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TOPICS.map((top) => (
                <button
                  key={top}
                  type="button"
                  onClick={() => { setSelectedTopic(top === selectedTopic ? '' : top); setPage(1); }}
                  className={`px-2 py-1 rounded text-xs border transition-colors cursor-pointer ${
                    selectedTopic === top
                      ? 'bg-tertiary text-white border-tertiary'
                      : 'bg-surface border-border text-stone-700 hover:bg-warm-bg'
                  }`}
                >
                  {top}
                </button>
              ))}
            </div>
          </div>

          {/* Save Filter Combination Button */}
          <div className="pt-3 border-t border-border">
            <Button
              onClick={() => setSaveFilterModal(true)}
              variant="secondary"
              size="sm"
              className="w-full gap-2 text-xs"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-primary" />
              Save Filter Combination
            </Button>
          </div>
        </aside>

        {/* Right Main Results Section */}
        <div className="flex-1 space-y-5 min-w-0">
          {/* Top Controls: Search Bar + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Type to filter titles, sound targets, skills (zero reload)..."
                className="w-full h-11 pl-10 pr-10 rounded-lg border border-border bg-surface text-text text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setPage(1); }}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="h-11 pl-3 pr-8 rounded-lg border border-border bg-surface text-xs font-semibold text-stone-700 focus:border-primary focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="relevant">Sort: Most Relevant</option>
                  <option value="popular">Sort: Most Popular</option>
                  <option value="newest">Sort: Newest Added</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips Row */}
          {(activeFilterCount > 0 || query) && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-surface border border-border rounded-lg text-xs">
              <span className="font-semibold text-stone-500">Active:</span>
              {query && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 text-stone-800 border border-stone-200">
                  Search: &ldquo;{query}&rdquo;
                  <button type="button" onClick={() => setQuery('')} className="hover:text-primary cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedDomain && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  Domain: {selectedDomain}
                  <button type="button" onClick={() => setSelectedDomain('')} className="hover:text-primary cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedTarget && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-orange-50 text-orange-800 border border-orange-200">
                  Target: {selectedTarget}
                  <button type="button" onClick={() => setSelectedTarget('')} className="hover:text-primary cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedLevel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200">
                  Level: {selectedLevel}
                  <button type="button" onClick={() => setSelectedLevel('')} className="hover:text-primary cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedFormat && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Format: {selectedFormat}
                  <button type="button" onClick={() => setSelectedFormat('')} className="hover:text-primary cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedTopic && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  Topic: {selectedTopic}
                  <button type="button" onClick={() => setSelectedTopic('')} className="hover:text-primary cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-primary hover:underline font-semibold ml-auto cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Count Bar */}
          <div className="flex items-center justify-between text-xs text-text-muted px-1">
            <span>
              Showing <strong className="text-text">{lessons.length}</strong> of <strong className="text-text">{total}</strong> materials
            </span>
            <span>
              Page {page} of {totalPages}
            </span>
          </div>

          {/* Lessons Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-surface border border-border rounded-lg animate-pulse p-4 space-y-4">
                  <div className="h-28 bg-stone-100 rounded" />
                  <div className="h-4 bg-stone-100 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-full" />
                  <div className="h-3 bg-stone-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : lessons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onOpen={(l) => setActiveLesson(l)}
                  onFavorite={handleFavoriteToggle}
                  isFavorited={favorites.includes(lesson.id)}
                  onAddToFolder={handleAddToFolder}
                  userPlaylists={userPlaylists}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-xl p-12 text-center space-y-4 my-8">
              <Search className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-heading text-lg font-bold text-text">
                No materials match your exact filter combination
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                Try widening your search terms, changing the target sound position, or resetting the level filter.
              </p>
              <Button onClick={handleClearFilters} variant="secondary" size="sm">
                Reset All Filters
              </Button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 text-xs font-semibold">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pNum = i + 1;
                  if (page > 3 && totalPages > 5) {
                    pNum = page - 2 + i;
                    if (pNum > totalPages) pNum = totalPages - 4 + i;
                  }
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded border text-xs font-mono transition-colors cursor-pointer ${
                        page === pNum
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface border-border text-stone-700 hover:bg-warm-bg'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Save Filter Modal */}
      {saveFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-text">
                Save Filter Combination
              </h3>
              <button
                type="button"
                onClick={() => setSaveFilterModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-text-muted">
              Give this combination a name to quickly re-apply it from your dashboard anytime.
            </p>
            <form onSubmit={handleSaveFilterCombo} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text block mb-1">
                  Preset Name
                </label>
                <input
                  type="text"
                  value={saveFilterName}
                  onChange={(e) => setSaveFilterName(e.target.value)}
                  placeholder="e.g. Grade 2 Final /S/ Sentence Drill"
                  required
                  className="w-full h-10 px-3 rounded border border-border text-xs focus:border-primary focus:outline-none"
                />
              </div>
              {filterSavedSuccess ? (
                <div className="p-2.5 rounded bg-green-50 text-green-800 text-xs font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Preset saved to your dashboard!
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSaveFilterModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Preset
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Interactive Lesson Modal */}
      <LessonModal
        lesson={activeLesson}
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        isFavorited={activeLesson ? favorites.includes(activeLesson.id) : false}
        onFavorite={handleFavoriteToggle}
        userPlaylists={userPlaylists}
        onAddToFolder={handleAddToFolder}
      />
    </div>
  );
}
