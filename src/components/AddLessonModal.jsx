import { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Link2, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import Button from './ui/Button';

const DOMAINS = ['Language', 'Articulation', 'Pragmatics', 'Fluency', 'Phonology'];

const TARGETS_BY_DOMAIN = {
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
  ],
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

// Parses either a direct Genially URL or a full <iframe src="..."> snippet
export function parseGeniallyInput(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  const srcMatch = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1].trim();
  }
  return trimmed;
}

export default function AddLessonModal({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Articulation');
  const [target, setTarget] = useState('Initial /S/');
  const [level, setLevel] = useState('Word');
  const [primarySkill, setPrimarySkill] = useState('Phoneme Production');
  const [secondarySkill, setSecondarySkill] = useState('Vocabulary');
  const [activityFormat, setActivityFormat] = useState('Interactive Genially Deck');
  const [topic, setTopic] = useState('Animals');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [geniallyRaw, setGeniallyRaw] = useState('');
  const [description, setDescription] = useState('');
  const [teachingScript, setTeachingScript] = useState('');
  const [materials, setMaterials] = useState('Interactive device (iPad / Laptop), token board.');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const extractedEmbedUrl = parseGeniallyInput(geniallyRaw);
  const availableTargets = TARGETS_BY_DOMAIN[domain] || TARGETS_BY_DOMAIN.Articulation;

  const handleDomainChange = (newDomain) => {
    setDomain(newDomain);
    const list = TARGETS_BY_DOMAIN[newDomain] || [];
    if (list.length > 0) setTarget(list[0]);
  };

  const handleStandardizeTitle = () => {
    setTitle(`${target}: ${level} Level ${topic} Practice`);
    if (!description) {
      setDescription(
        `Interactive ${activityFormat.toLowerCase()} targeting ${target} at the ${level.toLowerCase()} level with ${topic.toLowerCase()} vocabulary.`
      );
    }
    if (!teachingScript) {
      setTeachingScript(
        `Model the target (${target}) clearly using visual placement cues. Have the student complete 5 structured trials at the ${level.toLowerCase()} level before advancing through the interactive activity.`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        domain,
        target: target.trim(),
        level,
        primary_skill: primarySkill.trim() || domain,
        secondary_skill: secondarySkill.trim() || null,
        activity_format: activityFormat,
        topic,
        duration_minutes: Number(durationMinutes) || 15,
        genially_embed_url: extractedEmbedUrl || null,
        teaching_script: teachingScript.trim(),
        materials: materials.trim(),
      };

      const res = await api.createLesson(payload);
      setSuccess(true);
      window.dispatchEvent(new CustomEvent('slp-lesson-created', { detail: res.lesson }));

      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setGeniallyRaw('');
        setDescription('');
        setTeachingScript('');
        if (onCreated) onCreated(res.lesson);
        onClose();
      }, 900);
    } catch (err) {
      setError(err.message || 'Failed to save lesson to database.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl max-h-[92vh] bg-surface border border-border rounded-xl flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-lesson-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-warm-bg/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold block">
              Priority 4 • VA &amp; Admin Content Uploader
            </span>
            <h2 id="add-lesson-title" className="font-heading text-lg font-bold text-text">
              Add New Interactive Lesson
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-border bg-surface hover:bg-warm-bg flex items-center justify-center text-stone-500 hover:text-stone-800 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-error/30 text-xs text-error font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Lesson published to MySQL library! Opening in catalog...
            </div>
          )}

          {/* 1. Genially Link / Iframe Embed Input (Highlighted) */}
          <div className="p-4 rounded-xl bg-warm-bg/70 border border-primary/30 space-y-2">
            <label className="text-xs font-bold text-text flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-primary" />
              Genially Share Link or Full &lt;iframe&gt; Embed Code
            </label>
            <textarea
              rows={2}
              value={geniallyRaw}
              onChange={(e) => setGeniallyRaw(e.target.value)}
              placeholder='Paste https://view.genially.com/... OR full <iframe src="https://view.genially.com/..."></iframe>'
              className="w-full p-2.5 rounded-lg border border-border bg-surface text-xs font-mono text-text focus:border-primary focus:outline-none"
            />
            {extractedEmbedUrl ? (
              <p className="text-[11px] text-emerald-700 font-mono truncate">
                ✓ Detected Embed URL: {extractedEmbedUrl}
              </p>
            ) : (
              <p className="text-[11px] text-stone-500">
                Supports both direct Genially links (<code>https://view.genially.com/...</code>) and pasted HTML <code>&lt;iframe&gt;</code> snippets.
              </p>
            )}
          </div>

          {/* 2. Domain, Target, Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Curriculum Domain *
              </label>
              <select
                value={domain}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="w-full h-9 px-2.5 rounded border border-border bg-surface text-xs font-medium text-text focus:border-primary focus:outline-none"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Specific Target / Goal *
              </label>
              <input
                type="text"
                list="slp-targets-list"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. Initial /S/"
                required
                className="w-full h-9 px-2.5 rounded border border-border bg-surface text-xs text-text focus:border-primary focus:outline-none"
              />
              <datalist id="slp-targets-list">
                {availableTargets.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Hierarchy Level *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full h-9 px-2.5 rounded border border-border bg-surface text-xs font-medium text-text focus:border-primary focus:outline-none"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Format, Topic, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Activity Format
              </label>
              <select
                value={activityFormat}
                onChange={(e) => setActivityFormat(e.target.value)}
                className="w-full h-9 px-2.5 rounded border border-border bg-surface text-xs font-medium text-text focus:border-primary focus:outline-none"
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Topic / Theme
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-9 px-2.5 rounded border border-border bg-surface text-xs font-medium text-text focus:border-primary focus:outline-none"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min={5}
                max={90}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full h-9 px-2.5 rounded border border-border bg-surface text-xs text-text focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Title + AI Naming Standardization Helper (PRD Priority 4) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-text">
                Standardized Lesson Title *
              </label>
              <button
                type="button"
                onClick={handleStandardizeTitle}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Auto-Standardize Title &amp; Script
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Initial /S/: Word Level Animals Practice"
              required
              className="w-full h-9 px-3 rounded border border-border bg-surface text-xs text-text focus:border-primary focus:outline-none"
            />
          </div>

          {/* 5. Primary & Secondary Skill Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Primary Skill Badge
              </label>
              <input
                type="text"
                value={primarySkill}
                onChange={(e) => setPrimarySkill(e.target.value)}
                placeholder="e.g. Phoneme Production"
                className="w-full h-9 px-2.5 rounded border border-border bg-surface text-xs text-text focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Secondary Skill Badge
              </label>
              <input
                type="text"
                value={secondarySkill}
                onChange={(e) => setSecondarySkill(e.target.value)}
                placeholder="e.g. Working Memory"
                className="w-full h-9 px-2.5 rounded border border-border bg-surface text-xs text-text focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* 6. Description & Step-by-Step Teaching Script */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Short Activity Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="1-sentence summary shown on result cards..."
                className="w-full p-2.5 rounded border border-border bg-surface text-xs text-text focus:border-primary focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text block mb-1">
                Step-by-Step Teaching Script
              </label>
              <textarea
                rows={3}
                value={teachingScript}
                onChange={(e) => setTeachingScript(e.target.value)}
                placeholder="Clinician instructions shown beside the Genially deck..."
                className="w-full p-2.5 rounded border border-border bg-surface text-xs text-text focus:border-primary focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting}
              className="gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              {submitting ? 'Publishing Lesson...' : 'Publish Lesson'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
