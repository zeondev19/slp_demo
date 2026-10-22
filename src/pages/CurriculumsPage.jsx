import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const DOMAINS = ['All', 'Language', 'Articulation', 'Pragmatics', 'Fluency', 'Phonology'];

const DOMAIN_ACCENTS = {
  Language: { border: 'border-l-blue-600', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
  Articulation: { border: 'border-l-primary', badge: 'bg-orange-50 text-orange-800 border-orange-200' },
  Pragmatics: { border: 'border-l-purple-600', badge: 'bg-purple-50 text-purple-800 border-purple-200' },
  Fluency: { border: 'border-l-amber-500', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  Phonology: { border: 'border-l-emerald-600', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
};

export default function CurriculumsPage() {
  const navigate = useNavigate();
  const [curriculums, setCurriculums] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurriculums() {
      try {
        setLoading(true);
        const res = await api.getCurriculums();
        setCurriculums(res.curriculums || []);
      } catch (err) {
        console.error('Failed to load curriculums:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCurriculums();
  }, []);

  const filteredCurriculums = selectedDomain === 'All'
    ? curriculums
    : curriculums.filter((c) => c.domain === selectedDomain);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="border-b border-border pb-5 space-y-2">
        <p className="text-xs uppercase font-mono tracking-wider text-primary font-bold">
          Step-by-Step Clinical Pathways
        </p>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text">
          Structured SLP Curriculums
        </h1>
        <p className="text-sm text-text-muted max-w-3xl leading-relaxed">
          Sequential step-by-step therapy trajectories designed by speech-language pathologists. 
          Progress through systematic levels: Isolation, Syllable, Word, Phrase, Sentence, and Conversation.
        </p>
      </div>

      {/* Domain Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {DOMAINS.map((domain) => (
          <button
            key={domain}
            type="button"
            onClick={() => setSelectedDomain(domain)}
            className={`h-9 px-4 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              selectedDomain === domain
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-surface border-border text-stone-700 hover:bg-warm-bg'
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Curriculums Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 space-y-4">
          <Spinner className="w-8 h-8 text-primary" />
          <p className="text-xs font-medium text-text-muted">Loading curriculum sequences...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCurriculums.map((curr) => {
            const accent = DOMAIN_ACCENTS[curr.domain] || DOMAIN_ACCENTS.Language;
            return (
              <Card
                key={curr.id}
                onClick={() => navigate(`/curriculums/${curr.id}`)}
                className={`p-6 border border-border border-l-4 ${accent.border} hover:border-primary/40 transition-all bg-surface flex flex-col justify-between group cursor-pointer`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${accent.badge}`}>
                      {curr.domain}
                    </span>
                    <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-primary" />
                      {curr.total_steps || 5} Systematic Steps
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-text group-hover:text-primary transition-colors">
                    {curr.title}
                  </h3>

                  <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                    {curr.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-stone-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" />
                    Structured Step 1 to Step 5
                  </span>
                  <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Step Progression <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
