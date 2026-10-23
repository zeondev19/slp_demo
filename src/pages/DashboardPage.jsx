import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Play, FolderOpen, ArrowRight, Heart, Sparkles, BookOpen, Clock } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import LessonCard from '../components/LessonCard';
import LessonModal from '../components/LessonModal';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin =
    user?.role === 'admin' ||
    user?.email?.toLowerCase().includes('admin') ||
    user?.display_name?.toLowerCase().includes('admin');
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem('slp_dashboard_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => !localStorage.getItem('slp_dashboard_cache'));
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const cached = localStorage.getItem('slp_dashboard_cache');
      const parsed = cached ? JSON.parse(cached) : null;
      return (parsed?.favorites || []).map((f) => f.id || f.lesson_id);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    loadDashboard();
    const handleCreated = (e) => {
      loadDashboard();
      if (e.detail) setActiveLesson(e.detail);
    };
    window.addEventListener('slp-lesson-created', handleCreated);
    return () => window.removeEventListener('slp-lesson-created', handleCreated);
  }, []);

  const loadDashboard = async () => {
    try {
      if (!data) setLoading(true);
      setError(null);
      const res = await api.getDashboard();
      setData(res);
      localStorage.setItem('slp_dashboard_cache', JSON.stringify(res));
      // Extract favorite IDs directly from dashboard response (eliminates 2nd network request!)
      setFavorites((res.favorites || []).map((f) => f.id || f.lesson_id));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      if (!data) setError('Could not load dashboard content. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleFavoriteToggle = async (lessonId) => {
    const isCurrentlyFav = favorites.includes(lessonId);
    // Optimistic 0ms UI update
    setFavorites((prev) =>
      isCurrentlyFav ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
    try {
      await api.toggleFavorite(lessonId, !isCurrentlyFav);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleAddToFolder = (playlistId, lessonId) => {
    // Optimistic 0ms UI update of folder item count
    setData((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        folders: (prev.folders || []).map((f) =>
          f.id === playlistId ? { ...f, item_count: Number(f.item_count || 0) + 1 } : f
        ),
      };
      localStorage.setItem('slp_dashboard_cache', JSON.stringify(updated));
      return updated;
    });
    api.addToPlaylist(playlistId, lessonId).catch((err) => {
      console.error('Failed to add to folder:', err);
    });
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson from the library?')) return;
    if (activeLesson?.id === lessonId) setActiveLesson(null);
    setData((prev) => {
      if (!prev) return prev;
      const filterOut = (arr) => (arr || []).filter((item) => item.id !== lessonId);
      const updated = {
        ...prev,
        recentlyUsed: filterOut(prev.recentlyUsed),
        favorites: filterOut(prev.favorites),
        newlyAdded: filterOut(prev.newlyAdded),
        continueLesson: prev.continueLesson?.id === lessonId ? null : prev.continueLesson,
      };
      localStorage.setItem('slp_dashboard_cache', JSON.stringify(updated));
      return updated;
    });
    try {
      await api.deleteLesson(lessonId);
    } catch (err) {
      console.error('Failed to delete lesson:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <Spinner className="w-10 h-10 text-primary" />
        <p className="text-sm font-medium text-text-muted">Loading your personalized SLP dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-surface border border-error/30 rounded-lg text-center space-y-4">
        <p className="text-sm text-error font-medium">{error}</p>
        <Button onClick={loadDashboard} variant="primary" size="sm">
          Retry Loading
        </Button>
      </div>
    );
  }

  const continueLesson = data?.continueLesson;
  const recentlyUsed = data?.recentlyUsed || [];
  const folders = data?.folders || [];
  const favoriteLessons = data?.favorites || [];
  const newlyAdded = data?.newlyAdded || [];
  const savedFilters = data?.savedFilters || [];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Quick Search & Saved Filters */}
      <section className="bg-surface border border-border rounded-xl p-6 sm:p-8 space-y-5">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs uppercase font-mono tracking-wider text-primary font-bold">
            Therapist Portal
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text">
            What are you working on with your students today?
          </h1>
          <p className="text-sm text-text-muted">
            Instant zero-reload access across all 1,000+ interactive speech therapy decks and curriculum sequences.
          </p>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by target sound, goal, skill (e.g. Initial /S/, WH Questions, Turn Taking)..."
              className="w-full h-12 pl-12 pr-28 rounded-lg border-1.5 border-border-hover bg-bg text-text text-sm placeholder:text-stone-400 focus:border-primary focus:ring-3 focus:ring-primary/15 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 h-8 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-hover active:bg-primary-active transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Saved Filters Row */}
        {savedFilters.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-stone-500">Quick Filters:</span>
            {savedFilters.map((sf) => (
              <button
                key={sf.id}
                type="button"
                onClick={() => {
                  const filterParams = new URLSearchParams(sf.filters || {}).toString();
                  navigate(`/search?${filterParams}`);
                }}
                className="h-8 px-3 rounded-full border border-border bg-warm-bg/70 hover:bg-warm-bg hover:border-primary/40 text-xs text-stone-700 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{sf.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 2. Continue Where You Left Off (Hero Feature) */}
      {continueLesson && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-text flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Continue Where You Left Off
            </h2>
            <span className="text-xs text-stone-500">Last accessed session</span>
          </div>

          <Card className="p-5 sm:p-6 border-2 border-primary/30 bg-warm-bg/40 hover:border-primary transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    {continueLesson.domain}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    Target: {continueLesson.target} ({continueLesson.level})
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-text">
                  {continueLesson.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {continueLesson.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                  <span>Skill: <strong>{continueLesson.primary_skill}</strong></span>
                  <span>•</span>
                  <span>Format: <strong>{continueLesson.activity_format}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  onClick={() => setActiveLesson(continueLesson)}
                  variant="primary"
                  size="md"
                  className="gap-2 shadow-xs"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Resume Session
                </Button>
                <Button
                  onClick={() => navigate('/curriculums')}
                  variant="secondary"
                  size="md"
                >
                  View Curriculum
                </Button>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* 3. My Folders (Weekly Therapy Organizer) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-text flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            My Therapy Folders &amp; Playlists
          </h2>
          <button
            type="button"
            onClick={() => navigate('/folders')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            Manage All Folders <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <Card
              key={folder.id}
              onClick={() => navigate('/folders')}
              className="p-4 border border-border hover:border-primary/50 cursor-pointer bg-surface transition-all flex flex-col justify-between h-32"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    <FolderOpen className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {folder.item_count} items
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-text truncate">
                  {folder.name}
                </h4>
                <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                  {folder.description || 'Custom session playlist'}
                </p>
              </div>
              <div className="text-[11px] text-primary font-semibold flex items-center gap-1">
                Open Playlist <ArrowRight className="w-3 h-3" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Recently Used Activities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-text">
              Recently Used Activities
            </h2>
            <p className="text-xs text-text-muted">
              Quick access to materials opened during this week&apos;s speech therapy sessions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Explore Library
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentlyUsed.slice(0, 4).map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onOpen={(l) => setActiveLesson(l)}
              onFavorite={handleFavoriteToggle}
              isFavorited={favorites.includes(lesson.id)}
              onAddToFolder={handleAddToFolder}
              userPlaylists={folders}
              canDelete={isAdmin}
              onDelete={handleDeleteLesson}
            />
          ))}
        </div>
      </section>

      {/* 5. My Favorites */}
      {favoriteLessons.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-text flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              My Saved Favorites
            </h2>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              View More
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favoriteLessons.slice(0, 4).map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onOpen={(l) => setActiveLesson(l)}
                onFavorite={handleFavoriteToggle}
                isFavorited={true}
                onAddToFolder={handleAddToFolder}
                userPlaylists={folders}
                canDelete={isAdmin}
                onDelete={handleDeleteLesson}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Newly Added Activities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-text">
              Newly Added Interactive Activities
            </h2>
            <p className="text-xs text-text-muted">
              Fresh additions uploaded and curated by the curriculum team.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/search?sort=newest')}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Browse Newest
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newlyAdded.slice(0, 4).map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onOpen={(l) => setActiveLesson(l)}
              onFavorite={handleFavoriteToggle}
              isFavorited={favorites.includes(lesson.id)}
              onAddToFolder={handleAddToFolder}
              userPlaylists={folders}
              canDelete={isAdmin}
              onDelete={handleDeleteLesson}
            />
          ))}
        </div>
      </section>

      {/* Interactive Lesson Modal */}
      <LessonModal
        lesson={activeLesson}
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        isFavorited={activeLesson ? favorites.includes(activeLesson.id) : false}
        onFavorite={handleFavoriteToggle}
        userPlaylists={folders}
        onAddToFolder={handleAddToFolder}
        canDelete={isAdmin}
        onDelete={handleDeleteLesson}
      />
    </div>
  );
}
