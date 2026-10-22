// database/generate-1000-records.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAINS = ['Language', 'Articulation', 'Pragmatics', 'Fluency', 'Phonology'];

const DOMAIN_TARGETS = {
  Language: [
    'WH Questions', '2-Step Directions', '3-Step Directions', 'Categories', 
    'Past Tense Verbs', 'Plurals', 'Sequencing', 'Spatial Concepts', 
    'Describing Objects', 'Compare & Contrast'
  ],
  Articulation: [
    'Initial /S/', 'Final /S/', 'Initial /R/', 'Vocalic R', 'R-Blends', 
    'S-Blends', 'Initial /L/', 'L-Blends', 'TH Sounds', 'SH & CH Sounds'
  ],
  Pragmatics: [
    'Turn Taking', 'Topic Maintenance', 'Social Problem Solving', 
    'Perspective Taking', 'Emotion Recognition', 'Nonverbal Cues', 
    'Conversational Repair', 'Asking Follow-Up Questions'
  ],
  Fluency: [
    'Easy Onsets', 'Light Articulatory Contacts', 'Continuous Phonation', 
    'Pacing & Rate Control', 'Pausing & Chunking', 'Cancellation Technique', 
    'Pull-Out Strategy', 'Voluntary Stuttering'
  ],
  Phonology: [
    'Fronting Remediation', 'Stopping of Fricatives', 'Cluster Reduction', 
    'Final Consonant Deletion', 'Gliding of Liquids', 'Minimal Pairs /k/ vs /t/', 
    'Minimal Pairs /s/ vs /t/', 'Syllable Deletion Remediation'
  ]
};

const LEVELS = ['Isolation', 'Syllable', 'Word', 'Phrase', 'Sentence', 'Conversation'];

const FORMATS = [
  'Interactive Genially Deck', 'Printable Worksheet', 'Teaching Script', 
  'Flashcards', 'Assessment'
];

const TOPICS = [
  'Animals', 'School', 'Seasonal', 'Everyday Routines', 'Food & Cooking', 
  'Sports & Games', 'Community Helpers', 'Space & Planets', 'Nature & Outdoors', 
  'Under the Sea'
];

const PRIMARY_SKILLS = {
  Language: ['Receptive Language', 'Expressive Language', 'Auditory Memory', 'Vocabulary Acquisition'],
  Articulation: ['Phoneme Production', 'Speech Intelligibility', 'Oral Motor Placement', 'Acoustic Discrimination'],
  Pragmatics: ['Social Communication', 'Conversational Competence', 'Theory of Mind', 'Peer Interaction'],
  Fluency: ['Fluency Shaping', 'Stuttering Modification', 'Self-Monitoring', 'Speaking Confidence'],
  Phonology: ['Phonological Awareness', 'Contrastive Discrimination', 'Pattern Elimination', 'Sound System Rules']
};

const SECONDARY_SKILLS = [
  'Working Memory', 'Visual Processing', 'Self-Regulation', 'Syntax Development',
  'Semantic Association', 'Attention to Task', 'Expressive Elaboration', 'Fine Motor Control'
];

const TEACHING_SCRIPTS = [
  "Begin with warm-up cues focusing on correct tongue position and relaxed posture. Prompt the student to imitate model productions before independent attempts. Reinforce positive efforts with immediate auditory and visual feedback.",
  "Present the target visual stimulus and ask the student to identify the target element. Provide verbal prompts: 'Remember to use your snake sound /s/' or 'Keep your voice smooth and continuous'. Record baseline accuracy over 10 consecutive trials.",
  "Guide the student through the interactive deck step-by-step. Encourage multi-sensory awareness by having the student feel airflow or watch mouth movements in a mirror. Transition from carrier phrases to open-ended conversational retell.",
  "Introduce the minimal pair cards side-by-side to highlight meaning differences. Ask: 'Did you say sea or tea?' Allow the student to self-correct with minimal clinician cueing before progressing to sentence-level tasks.",
  "Review the conversational strategy using role-play scenarios. Prompt the student to observe the listener's facial cues and body posture before responding. Practice maintaining the chosen topic across at least 4 conversational exchanges."
];

const GENIALLY_IDS = [
  '64a1b2c3d4e5f6a7b8c9d001', '64a1b2c3d4e5f6a7b8c9d002', '64a1b2c3d4e5f6a7b8c9d003',
  '64a1b2c3d4e5f6a7b8c9d004', '64a1b2c3d4e5f6a7b8c9d005', '64a1b2c3d4e5f6a7b8c9d006',
  '64a1b2c3d4e5f6a7b8c9d007', '64a1b2c3d4e5f6a7b8c9d008', '64a1b2c3d4e5f6a7b8c9d009',
  '64a1b2c3d4e5f6a7b8c9d010'
];

function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

// Generate 1000 lessons
const lessons = [];

for (let i = 1; i <= 1000; i++) {
  const domain = DOMAINS[(i - 1) % DOMAINS.length];
  const targets = DOMAIN_TARGETS[domain];
  const target = targets[(i - 1) % targets.length];
  const level = LEVELS[((i - 1) * 3) % LEVELS.length];
  const format = FORMATS[((i - 1) * 7) % FORMATS.length];
  const topic = TOPICS[((i - 1) * 2) % TOPICS.length];
  const primSkills = PRIMARY_SKILLS[domain];
  const primarySkill = primSkills[((i - 1) * 2) % primSkills.length];
  const secondarySkill = SECONDARY_SKILLS[((i - 1) * 3) % SECONDARY_SKILLS.length];
  const script = TEACHING_SCRIPTS[(i - 1) % TEACHING_SCRIPTS.length];
  
  // 10 curriculums total (2 per domain: IDs 1..10)
  const domainIndex = DOMAINS.indexOf(domain);
  const curriculumId = (i % 4 === 0) ? null : (domainIndex * 2 + 1 + (i % 2));
  
  const hasEmbed = format === 'Interactive Genially Deck';
  const geniallyId = GENIALLY_IDS[(i - 1) % GENIALLY_IDS.length];
  const geniallyUrl = hasEmbed ? `https://view.genially.com/embed/${geniallyId}?lesson=${i}` : null;
  
  const isNew = i > 900;
  const popularity = 10 + Math.floor(Math.sin(i) * 240 + 250);
  const duration = [10, 15, 20, 25, 30][i % 5];
  const timesUsed = Math.floor(popularity * 1.5);
  
  const title = `${target}: ${level} Level ${topic} Adventure (Vol. ${Math.floor((i - 1) / 50) + 1})`;
  const description = `Interactive ${format.toLowerCase()} targeting ${primarySkill.toLowerCase()} and ${secondarySkill.toLowerCase()} through engaging ${topic.toLowerCase()} activities designed for speech-language pathologists.`;
  
  lessons.push({
    id: i,
    title,
    description,
    curriculum_id: curriculumId,
    primary_skill: primarySkill,
    secondary_skill: secondarySkill,
    domain,
    target,
    level,
    activity_format: format,
    topic,
    genially_embed_url: geniallyUrl,
    teaching_script: script,
    thumbnail_url: `/thumbnails/lesson-${(i % 12) + 1}.jpg`,
    duration_minutes: duration,
    materials: 'Digital interactive deck, dry-erase marker, student response tokens.',
    objectives: `Student will accurately produce or demonstrate ${target} in ${level.toLowerCase()} contexts with 80% accuracy across 3 sessions.`,
    preparation_notes: 'Review student baseline targets. Have visual cue cards accessible.',
    times_used: timesUsed,
    sort_order: i,
    is_new: isNew,
    popularity_score: popularity,
    created_at: new Date(Date.now() - (1000 - i) * 86400000 * 0.3).toISOString().slice(0, 19).replace('T', ' '),
  });
}

// 1. Export as JS for frontend in-memory cache and API fallback
const jsContent = `// Auto-generated 1,000 SLP lessons dataset
export const MOCK_LESSONS = ${JSON.stringify(lessons, null, 2)};
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'mockLessons.js'),
  jsContent,
  'utf8'
);

fs.writeFileSync(
  path.join(__dirname, '..', 'api', 'lib', 'mockData.js'),
  jsContent,
  'utf8'
);

// 2. Generate SQL Insert statements in batches of 50
let sqlContent = `-- ============================================================
-- The SLP Curriculum — 1,000 Lessons Dataset
-- Target: MySQL 8.0+
-- Run after schema.sql
-- ============================================================

SET NAMES utf8mb4;

INSERT INTO slp_lessons (
  id, title, description, curriculum_id, primary_skill, secondary_skill,
  domain, target, level, activity_format, topic, genially_embed_url,
  teaching_script, thumbnail_url, duration_minutes, materials, objectives,
  preparation_notes, times_used, sort_order, is_new, popularity_score, created_at
) VALUES\n`;

const rows = lessons.map(l => {
  return `(${l.id}, ${escapeSQL(l.title)}, ${escapeSQL(l.description)}, ${l.curriculum_id || 'NULL'}, ${escapeSQL(l.primary_skill)}, ${escapeSQL(l.secondary_skill)}, ${escapeSQL(l.domain)}, ${escapeSQL(l.target)}, ${escapeSQL(l.level)}, ${escapeSQL(l.activity_format)}, ${escapeSQL(l.topic)}, ${escapeSQL(l.genially_embed_url)}, ${escapeSQL(l.teaching_script)}, ${escapeSQL(l.thumbnail_url)}, ${l.duration_minutes}, ${escapeSQL(l.materials)}, ${escapeSQL(l.objectives)}, ${escapeSQL(l.preparation_notes)}, ${l.times_used}, ${l.sort_order}, ${l.is_new ? 1 : 0}, ${l.popularity_score}, ${escapeSQL(l.created_at)})`;
});

// Group into batches of 50
for (let b = 0; b < rows.length; b += 50) {
  const batch = rows.slice(b, b + 50);
  if (b > 0) {
    sqlContent += `;\n\nINSERT INTO slp_lessons (
  id, title, description, curriculum_id, primary_skill, secondary_skill,
  domain, target, level, activity_format, topic, genially_embed_url,
  teaching_script, thumbnail_url, duration_minutes, materials, objectives,
  preparation_notes, times_used, sort_order, is_new, popularity_score, created_at
) VALUES\n`;
  }
  sqlContent += batch.join(',\n');
}
sqlContent += ';\n';

fs.writeFileSync(
  path.join(__dirname, 'seed-1000-lessons.sql'),
  sqlContent,
  'utf8'
);

console.log('Successfully generated 1,000 records in JS and SQL!');
