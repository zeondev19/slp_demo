import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Play, ChevronRight, 
  Sparkles, Layers, BookOpen, Clock, Heart, Award 
} from 'lucide-react';
import { api } from '../lib/api';
import LessonModal from '../components/LessonModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function CurriculumDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getCurriculum(id);
        setCurriculum(res.curriculum);
        const favRes = await api.getFavorites();
        setFavorites(favRes.ids || (favRes.favorites || []).map((f) => f.id || f.lesson_id));
      } catch (err) {
        console.error('Failed to load curriculum details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleFavoriteToggle = async (lessonId) => {
    try {
      const res = await api.toggleFavorite(lessonId);
      if (res && res.favorites) {
        setFavorites(res.favorites);
      } else {
        setFavorites((prev) =>
          prev.includes(lessonId) ? prev.filter((i) => i !== lessonId) : [...prev, lessonId]
        );
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-xs font-medium text-text-muted">Loading step progression...</p>
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-sm text-text-muted">Curriculum sequence not found.</p>
        <Button onClick={() => navigate('/curriculums')} variant="primary" size="sm">
          Back to Curriculums
        </Button>
      </div>
    );
  }

  const steps = curriculum.steps || [];

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto">
      {/* Back button and header */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/curriculums')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Curriculums
        </button>

        <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {curriculum.domain}
            </span>
            <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
              5-Step Systematic Progression
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text">
            {curriculum.title}
          </h1>

          <p className="text-sm text-text-muted leading-relaxed">
            {curriculum.description}
          </p>

          {/* Progress Indicator */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-stone-500">
            <span>Current Status: Step {currentStepIndex + 1} of {steps.length || 5}</span>
            <span className="font-mono font-bold text-primary">
              {Math.round(((currentStepIndex + 1) / (steps.length || 5)) * 100)}% Trajectory
            </span>
          </div>
        </div>
      </div>

      {/* Step by Step Vertical Timeline */}
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-text">
          Step-by-Step Curriculum Sequence
        </h2>

        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={step.lesson_id || index} className="relative group">
                {/* Step Circle Marker */}
                <div
                  className={`
                    absolute -left-6 sm:-left-10 top-5 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10
                    ${
                      isCompleted
                        ? 'bg-tertiary text-white shadow-xs'
                        : isCurrent
                        ? 'bg-primary text-white ring-4 ring-primary/20 shadow-xs'
                        : 'bg-surface border-2 border-stone-300 text-stone-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <span>{step.step_number || index + 1}</span>
                  )}
                </div>

                {/* Step Card Content */}
                <Card
                  className={`
                    p-5 sm:p-6 transition-all border
                    ${
                      isCurrent
                        ? 'bg-warm-bg/50 border-primary/50 shadow-xs'
                        : 'bg-surface border-border hover:border-stone-400'
                    }
                  `}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
                          Step {step.step_number || index + 1}
                        </span>
                        <Badge variant="level">{step.level}</Badge>
                        <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                          {step.activity_format}
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-text">
                        {step.title}
                      </h3>

                      {step.teaching_script && (
                        <div className="p-3 rounded bg-stone-50 border border-border text-xs text-stone-700 leading-relaxed font-body">
                          <strong className="text-stone-900 block font-semibold mb-0.5 font-mono uppercase text-[10px] tracking-wider text-primary">
                            Clinician Script:
                          </strong>
                          {step.teaching_script}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <Badge variant="primary-skill">{step.primary_skill}</Badge>
                        {step.secondary_skill && (
                          <Badge variant="secondary-skill">{step.secondary_skill}</Badge>
                        )}
                      </div>
                    </div>

                    {/* Step Action Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                      <Button
                        onClick={() => {
                          setCurrentStepIndex(index);
                          setActiveLesson({
                            id: step.lesson_id,
                            title: step.title,
                            domain: step.domain || curriculum.domain,
                            level: step.level,
                            primary_skill: step.primary_skill,
                            secondary_skill: step.secondary_skill,
                            activity_format: step.activity_format,
                            teaching_script: step.teaching_script,
                            target: curriculum.title,
                          });
                        }}
                        variant={isCurrent ? 'primary' : 'secondary'}
                        size="sm"
                        className="gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Launch Step {index + 1}
                      </Button>

                      {index < steps.length - 1 && (
                        <button
                          type="button"
                          onClick={() => setCurrentStepIndex(index + 1)}
                          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          Suggested Next Lesson <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Lesson Modal */}
      <LessonModal
        lesson={activeLesson}
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        isFavorited={activeLesson ? favorites.includes(activeLesson.id) : false}
        onFavorite={handleFavoriteToggle}
      />
    </div>
  );
}
