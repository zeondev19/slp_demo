-- ============================================================
-- The SLP Curriculum — Seed Data
-- Target: MySQL 8.0+
-- Run AFTER schema.sql
-- ============================================================

SET NAMES utf8mb4;

-- -----------------------------------------------------------
-- Users
-- password_hash = bcrypt('password123') placeholder
-- -----------------------------------------------------------
INSERT INTO slp_users (id, email, password_hash, display_name, role) VALUES
(1, 'admin@slpcurriculum.com',  '$2b$10$ZrH3G5K8vLp2Qx1Yj0WnOeE4Bf5mJkLmN9Xa3TdRv6Uc7Ws1Yh2K', 'Admin User',   'admin'),
(2, 'member@slpcurriculum.com', '$2b$10$ZrH3G5K8vLp2Qx1Yj0WnOeE4Bf5mJkLmN9Xa3TdRv6Uc7Ws1Yh2K', 'Sarah Johnson', 'member'),
(3, 'demo@slpcurriculum.com',   '$2b$10$ZrH3G5K8vLp2Qx1Yj0WnOeE4Bf5mJkLmN9Xa3TdRv6Uc7Ws1Yh2K', 'Demo Therapist','member');

-- -----------------------------------------------------------
-- Curriculums (10 total — 2 per domain)
-- -----------------------------------------------------------
INSERT INTO slp_curriculums (id, title, domain, description, total_steps, sort_order) VALUES
(1,  'Articulation: Initial /S/ Mastery',            'Articulation', 'A structured progression from isolation through conversation-level production of initial /s/ in all word positions. Includes probe assessments at each stage.', 5, 1),
(2,  'Articulation: Final /R/ Blends',                'Articulation', 'Systematic practice targeting vocalic /r/ and final /r/ blends using multi-sensory cues and high-frequency vocabulary.', 5, 2),
(3,  'Language: WH Questions Progression',            'Language',     'Move students from answering concrete "what" and "where" questions to abstract "why" and "how" reasoning questions across contexts.', 5, 3),
(4,  'Language: Following Multi-Step Directions',     'Language',     'Build auditory processing and working memory through scaffolded 1-step, 2-step, and 3-step direction-following activities.', 5, 4),
(5,  'Pragmatics: Turn Taking & Conversation Skills', 'Pragmatics',  'Teach conversational turn-taking, topic maintenance, and appropriate topic shifts using structured role-play and video modeling.', 5, 5),
(6,  'Pragmatics: Social Problem Solving',            'Pragmatics',  'Guide students through identifying social problems, brainstorming solutions, and predicting outcomes using real-world scenarios.', 5, 6),
(7,  'Fluency: Stuttering Management Techniques',     'Fluency',     'Introduce and practice fluency-shaping techniques including easy onset, light contact, and continuous phonation across speaking contexts.', 5, 7),
(8,  'Fluency: Rate & Rhythm Control',                'Fluency',     'Target speech rate reduction and rhythmic pacing strategies using pacing boards, metronome apps, and structured reading passages.', 5, 8),
(9,  'Phonology: Phonological Processes Remediation',  'Phonology',   'Address common phonological processes including fronting, stopping, and cluster reduction through cycles approach and minimal pairs.', 5, 9),
(10, 'Phonology: Minimal Pairs Therapy',              'Phonology',   'Use contrastive minimal pair activities to eliminate phonological processes and improve speech intelligibility.', 5, 10);

-- -----------------------------------------------------------
-- Lessons (100 total)
-- -----------------------------------------------------------
INSERT INTO slp_lessons (id, title, description, curriculum_id, primary_skill, secondary_skill, domain, target, level, activity_format, topic, genially_embed_url, teaching_script, thumbnail_url, sort_order, is_new, popularity_score) VALUES

-- === ARTICULATION (20 lessons) ===
(1,  'Initial /S/ in Isolation — Snake Sounds',
     'Students practice producing the /s/ sound in isolation using visual and tactile cues. Clinician models tongue placement behind top teeth with continuous airflow.',
     1, 'Articulation', 'Oral Motor Awareness', 'Articulation', 'Initial /S/', 'Isolation', 'Interactive Genially Deck', 'Snake Sounds',
     'https://view.genially.com/embed/64a1b2c3d4e5f6a7b8c9d0e1', 'Model the /s/ sound by placing your tongue behind your top teeth and blowing air. Have the student feel the airstream on their hand. Reinforce with visual of a snake hissing.', '/thumbnails/lesson-1.jpg', 1, FALSE, 245),

(2,  'Initial /S/ at Syllable Level — Silly Syllables',
     'Combine /s/ with vowels to form CV and CVC syllables. Use rhythmic clapping to maintain syllable awareness.',
     1, 'Articulation', 'Phonological Awareness', 'Articulation', 'Initial /S/', 'Syllable', 'Interactive Genially Deck', 'Silly Syllables',
     'https://view.genially.com/embed/64a1b2c3d4e5f6a7b8c9d0e2', 'Present syllable cards (sa, se, si, so, su) and have the student repeat each three times. Use a clapping rhythm to keep pace. Provide corrective feedback on tongue placement.', '/thumbnails/lesson-2.jpg', 2, FALSE, 312),

(3,  'Initial /S/ at Word Level — S Words Safari',
     'Practice initial /s/ in high-frequency words through a safari-themed interactive deck with animal vocabulary.',
     1, 'Articulation', 'Vocabulary', 'Articulation', 'Initial /S/', 'Word', 'Interactive Genially Deck', 'Safari Animals',
     'https://view.genially.com/embed/64a1b2c3d4e5f6a7b8c9d0e3', 'Show each safari animal card and have the student name the word beginning with /s/. Words include: snake, seal, sun, sock, soap. Give specific praise for correct tongue placement.', '/thumbnails/lesson-3.jpg', 3, TRUE, 420),

(4,  'Initial /S/ in Phrases — Silly Sentence Starters',
     'Students produce initial /s/ words embedded in carrier phrases such as "I see a ___" and "She has a ___".',
     1, 'Articulation', 'Syntax', 'Articulation', 'Initial /S/', 'Phrase', 'Teaching Script', 'Sentence Starters',
     NULL, 'Use carrier phrases to elicit /s/ words in structured contexts. Model the phrase first, then have the student repeat. Gradually fade the carrier phrase as accuracy improves.', '/thumbnails/lesson-4.jpg', 4, FALSE, 189),

(5,  'Initial /S/ in Conversation — Story Retell',
     'Students retell a short story containing multiple initial /s/ words while maintaining conversational speech.',
     1, 'Articulation', 'Narrative Skills', 'Articulation', 'Initial /S/', 'Conversation', 'Teaching Script', 'Story Retell',
     NULL, 'Read a short story aloud emphasizing initial /s/ words. Have the student retell using their own words. Track /s/ accuracy across the narrative and provide gentle reminders as needed.', '/thumbnails/lesson-5.jpg', 5, FALSE, 156),

(6,  'Final /R/ Blends in Isolation — Growling Practice',
     'Isolate the vocalic /r/ sound using tactile feedback. Students feel throat vibration while producing a sustained /r/.',
     2, 'Articulation', 'Oral Motor Awareness', 'Articulation', 'R-Blends', 'Isolation', 'Teaching Script', 'Growling Sounds',
     NULL, 'Have the student place their hand on their throat and produce a growling /r/ sound. Emphasize tongue retraction and bunching. Use a mirror for visual feedback.', '/thumbnails/lesson-6.jpg', 6, FALSE, 198),

(7,  'Final /R/ Blends at Syllable Level — R Combos',
     'Practice /r/ blends in final position syllables (ark, ork, irt, art) with auditory bombardment.',
     2, 'Articulation', 'Auditory Discrimination', 'Articulation', 'R-Blends', 'Syllable', 'Flashcards', 'R Syllable Combos',
     NULL, 'Present flashcards with final /r/ blend syllables. Model each syllable clearly and have the student repeat. Use auditory bombardment by reading a list of /r/ words before practice begins.', '/thumbnails/lesson-7.jpg', 7, FALSE, 267),

(8,  'Final /R/ Blends at Word Level — Treasure Hunt',
     'Interactive treasure hunt game where students name objects containing final /r/ blends to unlock clues.',
     2, 'Articulation', 'Vocabulary', 'Articulation', 'R-Blends', 'Word', 'Interactive Genially Deck', 'Treasure Hunt',
     'https://view.genially.com/embed/64a1b2c3d4e5f6a7b8c9d0e8', 'Navigate the treasure map by correctly producing words with final /r/ blends. Target words: star, car, bear, chair, door. Each correct production reveals a clue.', '/thumbnails/lesson-8.jpg', 8, TRUE, 478),

(9,  'Final /R/ Blends in Phrases — Describe It',
     'Students describe pictures using phrases that contain final /r/ blend words in structured sentence frames.',
     2, 'Articulation', 'Descriptive Language', 'Articulation', 'R-Blends', 'Phrase', 'Printable Worksheet', 'Picture Descriptions',
     NULL, 'Present picture cards and have students describe them using the frame "I see a ___ near the ___." Monitor /r/ blend accuracy in connected speech.', '/thumbnails/lesson-9.jpg', 9, FALSE, 134),

(10, 'Final /R/ Blends in Conversation — Interview Game',
     'Students conduct mock interviews asking and answering questions loaded with final /r/ blend vocabulary.',
     2, 'Articulation', 'Pragmatic Skills', 'Articulation', 'R-Blends', 'Conversation', 'Teaching Script', 'Interview Game',
     NULL, 'Set up a mock interview scenario. Provide question cards that elicit final /r/ words. Students take turns being interviewer and interviewee. Track /r/ accuracy across conversation.', '/thumbnails/lesson-10.jpg', 10, FALSE, 201),

(11, 'Medial /S/ at Word Level — Middle Sounds Match',
     'Target medial /s/ in common words through a matching game format with visual supports.',
     NULL, 'Articulation', 'Phonological Awareness', 'Articulation', 'Medial /S/', 'Word', 'Interactive Genially Deck', 'Matching Game',
     'https://view.genially.com/embed/64a1b2c3d4e5f6a7b8c9d0f1', 'Present word pairs and have the student identify and produce words with medial /s/. Words include: baseball, dinosaur, bicycle, icicle, pencil.', '/thumbnails/lesson-11.jpg', 11, FALSE, 167),

(12, 'Final /S/ at Word Level — Ending Sounds Bingo',
     'Play bingo targeting final /s/ words. Students must correctly produce each word before covering the square.',
     NULL, 'Articulation', 'Auditory Discrimination', 'Articulation', 'Final /S/', 'Word', 'Printable Worksheet', 'Bingo Game',
     NULL, 'Distribute bingo boards with final /s/ pictures. Call out words and have students find and produce them. Words: bus, house, mouse, juice, dress, face, ice, rice.', '/thumbnails/lesson-12.jpg', 12, FALSE, 289),

(13, 'S-Blends at Word Level — Blend Builders',
     'Practice /s/ blends (sp, st, sk, sm, sn, sw, sl) at the word level with building-block themed activities.',
     NULL, 'Articulation', 'Phonological Awareness', 'Articulation', 'S-Blends', 'Word', 'Interactive Genially Deck', 'Building Blocks',
     'https://view.genially.com/embed/64a1b2c3d4e5f6a7b8c9d0f3', 'Show building block animations that combine /s/ with other consonants. Student produces the blend and target word. Words: stop, skip, smile, snow, swim, slide, spin.', '/thumbnails/lesson-13.jpg', 13, TRUE, 356),

(14, 'TH Sound at Isolation — Tongue Tip Tricks',
     'Teach correct tongue placement for voiced and voiceless /th/ sounds using visual models and mirrors.',
     NULL, 'Articulation', 'Oral Motor Awareness', 'Articulation', 'TH Sound', 'Isolation', 'Teaching Script', 'Tongue Placement',
     NULL, 'Have the student stick their tongue tip between their teeth and blow air gently. Demonstrate the difference between voiced /th/ (this) and voiceless /th/ (think). Use a mirror for visual feedback.', '/thumbnails/lesson-14.jpg', 14, FALSE, 145),

(15, 'TH Sound at Word Level — Think or That',
     'Sort and produce words beginning with voiced vs. voiceless /th/ through an interactive sorting activity.',
     NULL, 'Articulation', 'Auditory Discrimination', 'Articulation', 'TH Sound', 'Word', 'Interactive Genially Deck', 'Sound Sorting',
     'https://view.genially.com/embed/64a1b2c3d4e5f6a7b8c9d0f5', 'Present words beginning with /th/ and have students sort them into voiced (the, this, that) and voiceless (think, thumb, three) categories while producing each word.', '/thumbnails/lesson-15.jpg', 15, FALSE, 234),

(16, 'L Sound at Syllable Level — Lollipop Licks',
     'Practice /l/ in CV syllables with a candy-themed deck. Focus on tongue tip elevation to the alveolar ridge.',
     NULL, 'Articulation', 'Oral Motor Awareness', 'Articulation', 'L Sound', 'Syllable', 'Interactive Genially Deck', 'Candy Theme',
     'https://view.genially.com/embed/64a1b2c3d4e5f6a7b8c9d0f6', 'Model /l/ syllables (la, le, li, lo, lu) with exaggerated tongue elevation. Student earns virtual lollipops for correct productions. Provide tactile cue by touching under chin.', '/thumbnails/lesson-16.jpg', 16, FALSE, 178),

(17, 'L Sound at Phrase Level — Lovely Lunch',
     'Embed /l/ words in phrases about food and lunchtime. Students describe their ideal lunch using /l/ targets.',
     NULL, 'Articulation', 'Vocabulary', 'Articulation', 'L Sound', 'Phrase', 'Teaching Script', 'Food & Lunch',
     NULL, 'Present food items starting with /l/ (lemon, lettuce, lasagna, lollipop). Have students describe their ideal lunch using carrier phrases containing /l/ words.', '/thumbnails/lesson-17.jpg', 17, FALSE, 123),

(18, 'K/G Sounds at Word Level — Kitchen Sounds',
     'Target velar sounds /k/ and /g/ at the word level using a kitchen vocabulary theme.',
     NULL, 'Articulation', 'Vocabulary', 'Articulation', 'K/G Sounds', 'Word', 'Flashcards', 'Kitchen Theme',
     NULL, 'Use flashcards with kitchen items beginning with /k/ (cup, cake, cookie, corn) and /g/ (grape, glass, garlic). Model correct velar placement and have student repeat.', '/thumbnails/lesson-18.jpg', 18, FALSE, 215),

(19, 'CH/SH Sounds at Sentence Level — Choose or Share',
     'Practice /ch/ and /sh/ in sentences through a choice-making game where students make and explain decisions.',
     NULL, 'Articulation', 'Reasoning', 'Articulation', 'CH/SH Sounds', 'Sentence', 'Interactive Genially Deck', 'Decision Making',
     'https://view.genially.com/embed/64a1b2c3d4e5f6a7b8c9d0f9', 'Present two options and have the student choose one, explaining their choice in a complete sentence. Target words include: choose, chocolate, share, shoe, ship, cheese, chair, sheep.', '/thumbnails/lesson-19.jpg', 19, FALSE, 302),

(20, 'Articulation Progress Assessment — All Sounds',
     'Comprehensive articulation probe assessing /s/, /r/, /l/, /th/, /ch/, /sh/, /k/, /g/ at all levels.',
     NULL, 'Articulation', 'Assessment', 'Articulation', 'Mixed Sounds', 'Word', 'Assessment', 'Progress Probe',
     NULL, 'Administer the articulation probe by presenting target words for each sound in initial, medial, and final positions. Record accuracy percentages for each sound and position.', '/thumbnails/lesson-20.jpg', 20, FALSE, 389),

-- === LANGUAGE (20 lessons) ===
(21, 'What Questions — Naming Objects & Actions',
     'Introduce answering "what" questions using concrete objects and observable actions in pictures.',
     3, 'Receptive Language', 'Vocabulary', 'Language', 'WH Questions', 'Word', 'Interactive Genially Deck', 'What Questions',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e101', 'Show pictures of common objects and actions. Ask "What is this?" and "What is she doing?" Provide a field of 3 choices for students who need visual support.', '/thumbnails/lesson-21.jpg', 21, FALSE, 345),

(22, 'Where Questions — Locating Objects in Scenes',
     'Answer "where" questions by identifying locations of objects within detailed scene pictures.',
     3, 'Receptive Language', 'Spatial Concepts', 'Language', 'WH Questions', 'Phrase', 'Interactive Genially Deck', 'Where Questions',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e102', 'Present detailed scene pictures and ask "Where is the ___?" Students respond using prepositions (on, in, under, next to, behind). Scaffold with sentence frames as needed.', '/thumbnails/lesson-22.jpg', 22, FALSE, 278),

(23, 'Who Questions — Identifying People & Characters',
     'Practice answering "who" questions by identifying characters in stories and community helpers.',
     3, 'Receptive Language', 'Social Knowledge', 'Language', 'WH Questions', 'Sentence', 'Teaching Script', 'Who Questions',
     NULL, 'Read short passages about community helpers and story characters. Ask "Who helped the boy?" and "Who works at the hospital?" Students answer in complete sentences.', '/thumbnails/lesson-23.jpg', 23, FALSE, 189),

(24, 'When Questions — Understanding Time Concepts',
     'Answer "when" questions using temporal vocabulary (morning, afternoon, night, before, after, first, last).',
     3, 'Receptive Language', 'Temporal Concepts', 'Language', 'WH Questions', 'Sentence', 'Interactive Genially Deck', 'When Questions',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e104', 'Present daily routine pictures and ask "When do you eat breakfast?" "When does the sun come up?" Teach temporal vocabulary explicitly before asking questions.', '/thumbnails/lesson-24.jpg', 24, TRUE, 412),

(25, 'Why/How Questions — Reasoning & Inference',
     'Advance to abstract WH questions requiring reasoning skills. Students explain causes and processes.',
     3, 'Expressive Language', 'Critical Thinking', 'Language', 'WH Questions', 'Conversation', 'Teaching Script', 'Why & How',
     NULL, 'Present scenarios and ask "Why did the boy cry?" and "How do you make a sandwich?" Scaffold with visual supports and sentence starters. Expand student responses.', '/thumbnails/lesson-25.jpg', 25, FALSE, 367),

(26, 'Following 1-Step Directions — Listen & Do',
     'Build foundational direction-following skills with single-step commands using manipulatives.',
     4, 'Receptive Language', 'Auditory Processing', 'Language', 'Following Directions', 'Word', 'Interactive Genially Deck', 'One-Step Directions',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e106', 'Give one-step directions (Touch the ball. Pick up the red crayon. Point to the dog.) and have the student follow them. Increase complexity by adding modifiers.', '/thumbnails/lesson-26.jpg', 26, FALSE, 234),

(27, 'Following 2-Step Directions — Double Duty',
     'Progress to two-step sequential directions with temporal markers (first/then, before/after).',
     4, 'Receptive Language', 'Working Memory', 'Language', 'Following Directions', 'Phrase', 'Interactive Genially Deck', 'Two-Step Directions',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e107', 'Give two-step directions using temporal markers. "First touch the star, then clap your hands." Gradually remove the temporal markers. Track accuracy over 20 trials.', '/thumbnails/lesson-27.jpg', 27, FALSE, 298),

(28, 'Following 3-Step Directions — Triple Challenge',
     'Challenge students with three-step directions incorporating spatial and temporal vocabulary.',
     4, 'Receptive Language', 'Executive Function', 'Language', 'Following Directions', 'Sentence', 'Teaching Script', 'Three-Step Directions',
     NULL, 'Present three-step directions with increasing complexity. "Pick up the blue block, put it on the table, and clap twice." Have the student rehearse the steps before executing.', '/thumbnails/lesson-28.jpg', 28, FALSE, 176),

(29, 'Following Conditional Directions — If/Then',
     'Introduce conditional directions requiring students to make decisions based on conditions.',
     4, 'Receptive Language', 'Reasoning', 'Language', 'Following Directions', 'Sentence', 'Interactive Genially Deck', 'Conditional Directions',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e109', 'Give conditional directions: "If the circle is red, put it in the box. If it is blue, put it on the chair." Gradually add more conditions and steps.', '/thumbnails/lesson-29.jpg', 29, TRUE, 445),

(30, 'Multi-Step Directions Assessment',
     'Formal assessment of direction-following across 1-step, 2-step, and 3-step levels.',
     4, 'Receptive Language', 'Assessment', 'Language', 'Following Directions', 'Sentence', 'Assessment', 'Directions Assessment',
     NULL, 'Administer standardized direction-following probes at 1-step, 2-step, and 3-step levels. Record accuracy and note error patterns. Use results to guide therapy planning.', '/thumbnails/lesson-30.jpg', 30, FALSE, 156),

(31, 'Categories — Sorting & Grouping',
     'Teach categorization skills by sorting objects into semantic categories (animals, food, clothing, vehicles).',
     NULL, 'Expressive Language', 'Semantic Knowledge', 'Language', 'Categories', 'Word', 'Interactive Genially Deck', 'Sorting Game',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e111', 'Present objects and have students sort them into categories. Ask students to name the category and explain why each item belongs. Introduce superordinate and subordinate categories.', '/thumbnails/lesson-31.jpg', 31, FALSE, 378),

(32, 'Comparing & Contrasting — Same & Different',
     'Students identify similarities and differences between objects, people, and concepts using graphic organizers.',
     NULL, 'Expressive Language', 'Critical Thinking', 'Language', 'Compare/Contrast', 'Sentence', 'Printable Worksheet', 'Venn Diagrams',
     NULL, 'Use Venn diagrams to compare two objects. Model "Both ___ and ___ are ___. But ___ is ___ and ___ is ___." Students complete the organizer and verbalize comparisons.', '/thumbnails/lesson-32.jpg', 32, FALSE, 245),

(33, 'Sequencing Events — First, Next, Last',
     'Practice sequencing 3-step and 4-step event sequences using picture cards and temporal vocabulary.',
     NULL, 'Expressive Language', 'Narrative Skills', 'Language', 'Sequencing', 'Phrase', 'Interactive Genially Deck', 'Event Sequencing',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e113', 'Present scrambled picture sequences and have students arrange them in order. Students narrate using first, next, then, and last. Start with 3 steps and advance to 5 steps.', '/thumbnails/lesson-33.jpg', 33, FALSE, 312),

(34, 'Synonyms & Antonyms — Word Relationships',
     'Expand vocabulary by exploring synonyms and antonyms through interactive matching activities.',
     NULL, 'Expressive Language', 'Vocabulary', 'Language', 'Synonyms/Antonyms', 'Word', 'Interactive Genially Deck', 'Word Pairs',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e114', 'Present word pairs and have students identify whether they are synonyms or antonyms. Teach strategies for generating synonyms (think of another word that means the same thing).', '/thumbnails/lesson-34.jpg', 34, FALSE, 198),

(35, 'Making Predictions — What Happens Next?',
     'Develop inferencing skills by predicting outcomes based on story events and picture clues.',
     NULL, 'Receptive Language', 'Critical Thinking', 'Language', 'Predictions', 'Sentence', 'Teaching Script', 'Story Predictions',
     NULL, 'Read a story and pause at key moments. Ask "What do you think will happen next? Why?" Accept multiple valid predictions and discuss reasoning. Compare predictions to actual outcomes.', '/thumbnails/lesson-35.jpg', 35, FALSE, 267),

(36, 'Describing Objects — Feature, Function, Class',
     'Teach descriptive language using the feature-function-class framework for common objects.',
     NULL, 'Expressive Language', 'Vocabulary', 'Language', 'Describing', 'Sentence', 'Flashcards', 'Object Descriptions',
     NULL, 'Present object flashcards and model describing each using feature (what it looks like), function (what it does), and class (what group it belongs to). Students practice independently.', '/thumbnails/lesson-36.jpg', 36, FALSE, 334),

(37, 'Verb Tenses — Past, Present, Future',
     'Practice using regular and irregular verb tenses in structured sentences and narratives.',
     NULL, 'Expressive Language', 'Grammar', 'Language', 'Verb Tenses', 'Sentence', 'Interactive Genially Deck', 'Time Travel',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e117', 'Use a time-travel theme to practice verb tenses. Present action pictures in past, present, and future contexts. Students produce sentences using correct verb forms.', '/thumbnails/lesson-37.jpg', 37, TRUE, 423),

(38, 'Pronouns — He, She, They, Them',
     'Address pronoun use and agreement through story-based activities with multiple characters.',
     NULL, 'Expressive Language', 'Grammar', 'Language', 'Pronouns', 'Sentence', 'Teaching Script', 'Pronoun Practice',
     NULL, 'Tell stories with multiple characters and have students retell using correct pronouns. Address common errors (him went vs. he went). Use visual supports with pronoun cards.', '/thumbnails/lesson-38.jpg', 38, FALSE, 187),

(39, 'Narrative Retell — Story Grammar Elements',
     'Teach story grammar elements (character, setting, problem, solution) and practice retelling complete narratives.',
     NULL, 'Expressive Language', 'Narrative Skills', 'Language', 'Narratives', 'Conversation', 'Interactive Genially Deck', 'Story Retell',
     'https://view.genially.com/embed/64b2c3d4e5f6a7b8c9d0e119', 'Read a short story and identify story grammar elements using a visual map. Students retell the story using the map as a guide. Gradually fade the visual support.', '/thumbnails/lesson-39.jpg', 39, FALSE, 356),

(40, 'Language Concepts Assessment — Comprehensive',
     'Assess receptive and expressive language skills across categories, descriptions, WH questions, and directions.',
     NULL, 'Receptive Language', 'Assessment', 'Language', 'Mixed Language', 'Sentence', 'Assessment', 'Language Probe',
     NULL, 'Administer a comprehensive language probe covering categories, descriptions, WH questions, following directions, and narrative retell. Record data for goal tracking and progress monitoring.', '/thumbnails/lesson-40.jpg', 40, FALSE, 401),

-- === PRAGMATICS (20 lessons) ===
(41, 'Greetings & Introductions — Hello World',
     'Practice appropriate greetings, introductions, and leave-takings across social contexts.',
     5, 'Social Skills', 'Conversational Skills', 'Pragmatics', 'Greetings', 'Phrase', 'Interactive Genially Deck', 'Social Greetings',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10201', 'Model appropriate greetings for different contexts (meeting a friend vs. meeting a teacher). Students practice with role-play scenarios. Discuss formal vs. informal greetings.', '/thumbnails/lesson-41.jpg', 41, FALSE, 267),

(42, 'Conversation Turn-Taking — Talk Tennis',
     'Teach the back-and-forth nature of conversation using a tennis metaphor and structured practice.',
     5, 'Social Skills', 'Pragmatic Skills', 'Pragmatics', 'Turn Taking', 'Conversation', 'Interactive Genially Deck', 'Conversation Tennis',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10202', 'Explain conversation as a tennis match — you hit the ball (say something) and your partner hits it back. Use a visual volley tracker. Practice with structured topics.', '/thumbnails/lesson-42.jpg', 42, TRUE, 489),

(43, 'Topic Maintenance — Staying on Track',
     'Teach students to identify, maintain, and appropriately shift topics during conversation.',
     5, 'Social Skills', 'Self-Monitoring', 'Pragmatics', 'Topic Maintenance', 'Conversation', 'Teaching Script', 'On-Topic Train',
     NULL, 'Use a train metaphor — staying on the track means staying on topic. Present conversation samples and have students identify when the speaker goes off-topic. Practice maintaining topics for 3-5 turns.', '/thumbnails/lesson-43.jpg', 43, FALSE, 198),

(44, 'Asking Questions — Curious Conversations',
     'Build question-asking skills to initiate and sustain social conversations with peers.',
     5, 'Social Skills', 'Conversational Skills', 'Pragmatics', 'Asking Questions', 'Sentence', 'Interactive Genially Deck', 'Question Starters',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10204', 'Teach open-ended vs. closed questions. Model asking follow-up questions based on a conversational partner response. Students practice with conversation cards.', '/thumbnails/lesson-44.jpg', 44, FALSE, 312),

(45, 'Reading Body Language — What Are They Feeling?',
     'Interpret nonverbal communication cues including facial expressions, posture, and gestures.',
     5, 'Social Skills', 'Emotional Awareness', 'Pragmatics', 'Body Language', 'Phrase', 'Interactive Genially Deck', 'Body Language',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10205', 'Show photos of people displaying different emotions through body language. Students identify the emotion and explain the cues they used. Practice matching feelings to facial expressions.', '/thumbnails/lesson-45.jpg', 45, FALSE, 378),

(46, 'Identifying Social Problems — What Went Wrong?',
     'Teach students to recognize social problems in scenarios and identify what went wrong.',
     6, 'Social Skills', 'Problem Solving', 'Pragmatics', 'Social Problems', 'Sentence', 'Interactive Genially Deck', 'Problem Identification',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10206', 'Present social scenarios with problems (someone cuts in line, a friend is excluded). Students identify the problem and how each person might feel. Discuss expected vs. unexpected behaviors.', '/thumbnails/lesson-46.jpg', 46, FALSE, 345),

(47, 'Brainstorming Solutions — Fix-It Factory',
     'Generate multiple solutions to social problems and evaluate the consequences of each option.',
     6, 'Social Skills', 'Critical Thinking', 'Pragmatics', 'Problem Solving', 'Conversation', 'Interactive Genially Deck', 'Solution Factory',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10207', 'Present a social problem and brainstorm at least 3 solutions. Rate each solution (good, okay, bad) and discuss why. Students practice choosing the best solution and explaining their reasoning.', '/thumbnails/lesson-47.jpg', 47, TRUE, 456),

(48, 'Predicting Social Outcomes — Crystal Ball',
     'Practice predicting how others will react to different social behaviors and choices.',
     6, 'Social Skills', 'Perspective Taking', 'Pragmatics', 'Social Predictions', 'Sentence', 'Teaching Script', 'Crystal Ball',
     NULL, 'Present "If you do ___, what might happen?" scenarios. Students predict outcomes for both positive and negative social behaviors. Discuss the chain reaction of social choices.', '/thumbnails/lesson-48.jpg', 48, FALSE, 234),

(49, 'Perspective Taking — Walking in Their Shoes',
     'Develop theory of mind skills by considering situations from multiple perspectives.',
     6, 'Social Skills', 'Empathy', 'Pragmatics', 'Perspective Taking', 'Conversation', 'Interactive Genially Deck', 'Different Views',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10209', 'Present social scenarios and ask students how each person might feel and think. Use thought bubbles to visualize internal states. Practice the phrase "They might feel ___ because ___.".', '/thumbnails/lesson-49.jpg', 49, FALSE, 389),

(50, 'Compromise & Negotiation — Meet in the Middle',
     'Teach compromise and negotiation skills through structured role-play and problem-solving activities.',
     6, 'Social Skills', 'Conflict Resolution', 'Pragmatics', 'Compromise', 'Conversation', 'Teaching Script', 'Negotiation Skills',
     NULL, 'Model the steps of compromise: state what you want, listen to what they want, find a middle ground. Practice with common kid conflicts (choosing a game, sharing materials).', '/thumbnails/lesson-50.jpg', 50, FALSE, 167),

(51, 'Personal Space — Bubble Boundaries',
     'Teach appropriate personal space awareness through visual models and interactive practice.',
     NULL, 'Social Skills', 'Self-Awareness', 'Pragmatics', 'Personal Space', 'Phrase', 'Interactive Genially Deck', 'Space Bubbles',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10211', 'Use a bubble metaphor to teach personal space zones. Practice standing at appropriate distances for different relationships (friend, teacher, stranger). Use hula hoops as visual boundaries.', '/thumbnails/lesson-51.jpg', 51, FALSE, 256),

(52, 'Flexible Thinking — Plan B Thinkers',
     'Develop cognitive flexibility by practicing adapting when plans change or expectations are not met.',
     NULL, 'Social Skills', 'Executive Function', 'Pragmatics', 'Flexible Thinking', 'Sentence', 'Interactive Genially Deck', 'Plan B',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10212', 'Present scenarios where plans change unexpectedly. Model "Plan A" vs. "Plan B" thinking. Students practice rating the size of the problem and matching their reaction to the size.', '/thumbnails/lesson-52.jpg', 52, FALSE, 312),

(53, 'Emotions Vocabulary — Feelings Thermometer',
     'Expand emotional vocabulary beyond basic emotions using intensity scales and real-life examples.',
     NULL, 'Social Skills', 'Emotional Awareness', 'Pragmatics', 'Emotions', 'Word', 'Flashcards', 'Feelings Words',
     NULL, 'Introduce a feelings thermometer with intensity levels (calm, annoyed, frustrated, angry, furious). Students sort emotion words by intensity. Practice identifying their own emotion levels.', '/thumbnails/lesson-53.jpg', 53, FALSE, 289),

(54, 'Conversation Repair — Fix the Mix-Up',
     'Teach strategies for repairing communication breakdowns (asking for repetition, clarification, rephrasing).',
     NULL, 'Social Skills', 'Conversational Skills', 'Pragmatics', 'Conversation Repair', 'Sentence', 'Teaching Script', 'Communication Repair',
     NULL, 'Introduce repair strategies: "Can you say that again?" "What do you mean?" "Do you mean ___?" Practice with intentionally ambiguous messages. Students identify breakdowns and use repair strategies.', '/thumbnails/lesson-54.jpg', 54, FALSE, 178),

(55, 'Giving & Receiving Compliments — Kind Words',
     'Practice genuine compliment-giving and graceful compliment-receiving in social situations.',
     NULL, 'Social Skills', 'Pragmatic Skills', 'Pragmatics', 'Compliments', 'Phrase', 'Interactive Genially Deck', 'Compliment Practice',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10215', 'Model sincere compliments about appearance, skills, and character. Practice responding with "Thank you" and a follow-up comment. Discuss the difference between genuine and forced compliments.', '/thumbnails/lesson-55.jpg', 55, FALSE, 145),

(56, 'Joining a Group — Entry Strategies',
     'Teach appropriate strategies for joining an ongoing activity or conversation with peers.',
     NULL, 'Social Skills', 'Pragmatic Skills', 'Pragmatics', 'Group Entry', 'Conversation', 'Teaching Script', 'Joining In',
     NULL, 'Teach the steps: watch, wait, listen, find the right moment, say something related. Practice with video models showing successful and unsuccessful group entry. Role-play with peers.', '/thumbnails/lesson-56.jpg', 56, FALSE, 223),

(57, 'Understanding Sarcasm & Figurative Language',
     'Help students interpret non-literal language including sarcasm, idioms, and metaphors.',
     NULL, 'Social Skills', 'Language Comprehension', 'Pragmatics', 'Figurative Language', 'Sentence', 'Interactive Genially Deck', 'Hidden Meanings',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10217', 'Present sentences with literal and figurative meanings. Students determine if the speaker means what they literally said. Discuss tone of voice and context clues for identifying sarcasm.', '/thumbnails/lesson-57.jpg', 57, FALSE, 334),

(58, 'Digital Communication Etiquette — Text Smart',
     'Navigate appropriate digital communication including texting, email, and social media norms.',
     NULL, 'Social Skills', 'Digital Literacy', 'Pragmatics', 'Digital Etiquette', 'Sentence', 'Interactive Genially Deck', 'Online Communication',
     'https://view.genially.com/embed/64c3d4e5f6a7b8c9d0e10218', 'Compare face-to-face and digital communication. Discuss appropriate use of emojis, ALL CAPS, and response timing. Students rate sample text messages as appropriate or inappropriate.', '/thumbnails/lesson-58.jpg', 58, TRUE, 401),

(59, 'Self-Advocacy — Speaking Up for Yourself',
     'Build self-advocacy skills for academic and social situations using assertive communication.',
     NULL, 'Social Skills', 'Self-Advocacy', 'Pragmatics', 'Self-Advocacy', 'Conversation', 'Teaching Script', 'Assertive Communication',
     NULL, 'Teach the difference between passive, assertive, and aggressive communication. Model I-statements: "I feel ___ when ___ because ___." Practice in common scenarios (needing help, disagreeing politely).', '/thumbnails/lesson-59.jpg', 59, FALSE, 256),

(60, 'Pragmatics Skills Assessment',
     'Comprehensive assessment of social communication skills across greetings, conversation, and problem-solving.',
     NULL, 'Social Skills', 'Assessment', 'Pragmatics', 'Mixed Pragmatics', 'Conversation', 'Assessment', 'Social Skills Probe',
     NULL, 'Observe and rate social communication skills using a rubric covering eye contact, turn-taking, topic maintenance, problem solving, and perspective taking. Compare to baseline data.', '/thumbnails/lesson-60.jpg', 60, FALSE, 178),

-- === FLUENCY (20 lessons) ===
(61, 'Understanding Stuttering — What Is Bumpy Speech?',
     'Introduce stuttering in child-friendly terms. Students learn that bumpy speech is common and manageable.',
     7, 'Fluency', 'Self-Awareness', 'Fluency', 'Stuttering Education', 'Word', 'Interactive Genially Deck', 'Bumpy Speech',
     'https://view.genially.com/embed/64d4e5f6a7b8c9d0e1020301', 'Explain stuttering using the analogy of a bumpy road. Model different types of disfluency (repetitions, prolongations, blocks). Normalize the experience and introduce the concept of smooth vs. bumpy speech.', '/thumbnails/lesson-61.jpg', 61, FALSE, 234),

(62, 'Easy Onset — Gentle Beginnings',
     'Teach the easy onset technique for reducing blocks at the beginning of words and phrases.',
     7, 'Fluency', 'Speech Motor Control', 'Fluency', 'Easy Onset', 'Syllable', 'Teaching Script', 'Gentle Starts',
     NULL, 'Model starting sounds gently with a slow, easy release of air. Contrast hard onset (tense, sudden) with easy onset (relaxed, gradual). Practice with vowel-initial words first, then consonants.', '/thumbnails/lesson-62.jpg', 62, FALSE, 198),

(63, 'Light Contact — Soft Touch Sounds',
     'Practice light articulatory contact to reduce tension during speech production.',
     7, 'Fluency', 'Speech Motor Control', 'Fluency', 'Light Contact', 'Word', 'Interactive Genially Deck', 'Soft Touch',
     'https://view.genially.com/embed/64d4e5f6a7b8c9d0e1020303', 'Teach students to use light, easy touches of their articulators instead of pressing hard. Practice with stop consonants (/p/, /b/, /t/, /d/) that are prone to tension. Use a feather metaphor.', '/thumbnails/lesson-63.jpg', 63, FALSE, 267),

(64, 'Continuous Phonation — Smooth Connections',
     'Practice linking sounds and words together with continuous voicing and airflow.',
     7, 'Fluency', 'Speech Motor Control', 'Fluency', 'Continuous Phonation', 'Phrase', 'Teaching Script', 'Smooth Connections',
     NULL, 'Model stretching words together like a rubber band. Practice with short phrases first, then expand to longer sentences. Emphasize keeping the voice "on" between words.', '/thumbnails/lesson-64.jpg', 64, FALSE, 189),

(65, 'Fluency Strategies in Conversation — Putting It Together',
     'Combine easy onset, light contact, and continuous phonation in spontaneous conversation.',
     7, 'Fluency', 'Generalization', 'Fluency', 'Combined Strategies', 'Conversation', 'Teaching Script', 'Strategy Combo',
     NULL, 'Engage in structured conversation topics. Encourage self-monitoring for fluency strategy use. Provide gentle reminders when tension is observed. Celebrate smooth speech segments.', '/thumbnails/lesson-65.jpg', 65, FALSE, 345),

(66, 'Pacing Board — Slow & Steady',
     'Introduce pacing board use for rate reduction and word-by-word pacing during connected speech.',
     8, 'Fluency', 'Rate Control', 'Fluency', 'Pacing Board', 'Phrase', 'Interactive Genially Deck', 'Pacing Practice',
     'https://view.genially.com/embed/64d4e5f6a7b8c9d0e1020306', 'Introduce the virtual pacing board with 5 dots. Student touches one dot per word while speaking. Practice with phrases of increasing length. Gradually fade the pacing board support.', '/thumbnails/lesson-66.jpg', 66, FALSE, 312),

(67, 'Stretched Speech — Turtle Talk',
     'Practice slowing speech rate by stretching vowels and consonants within words.',
     8, 'Fluency', 'Rate Control', 'Fluency', 'Stretched Speech', 'Word', 'Teaching Script', 'Turtle Talk',
     NULL, 'Use a turtle metaphor for slow, stretched speech. Model elongating vowels and continuant consonants. Practice at the word level first, then phrases and sentences. Use a timer for rate measurement.', '/thumbnails/lesson-67.jpg', 67, FALSE, 178),

(68, 'Rhythmic Speech — Beat the Drum',
     'Use rhythmic pacing with a metronome or drum beat to establish a steady speech rate.',
     8, 'Fluency', 'Rhythm', 'Fluency', 'Rhythmic Pacing', 'Sentence', 'Interactive Genially Deck', 'Rhythm Practice',
     'https://view.genially.com/embed/64d4e5f6a7b8c9d0e1020308', 'Set a metronome to 60 BPM. Student produces one word or syllable per beat. Gradually increase rate to normal conversational speed. Practice with reading passages and spontaneous speech.', '/thumbnails/lesson-68.jpg', 68, TRUE, 423),

(69, 'Breathing for Speech — Belly Breaths',
     'Teach diaphragmatic breathing techniques to support smooth airflow during speech.',
     8, 'Fluency', 'Respiratory Support', 'Fluency', 'Breathing Techniques', 'Isolation', 'Teaching Script', 'Breath Support',
     NULL, 'Teach belly breathing by having the student lie down with a book on their stomach. Practice inhaling through the nose and exhaling slowly through the mouth. Connect breath support to phrase production.', '/thumbnails/lesson-69.jpg', 69, FALSE, 234),

(70, 'Choral Reading — Read Together',
     'Use choral reading as a fluency-enhancing condition to build confidence and reduce stuttering.',
     8, 'Fluency', 'Reading Fluency', 'Fluency', 'Choral Reading', 'Sentence', 'Printable Worksheet', 'Reading Together',
     NULL, 'Select age-appropriate reading passages. Read together with the student (choral reading) at a slightly reduced rate. Gradually fade clinician voice while maintaining student fluency.', '/thumbnails/lesson-70.jpg', 70, FALSE, 167),

(71, 'Identifying Moments of Stuttering',
     'Teach students to identify their own moments of stuttering without judgment or negative emotion.',
     NULL, 'Fluency', 'Self-Monitoring', 'Fluency', 'Self-Identification', 'Conversation', 'Teaching Script', 'Catch the Bumps',
     NULL, 'During conversation, have the student signal (raise a finger) when they notice a moment of stuttering. Praise accurate identification. Discuss the type of disfluency without judgment.', '/thumbnails/lesson-71.jpg', 71, FALSE, 145),

(72, 'Voluntary Stuttering — Bumping on Purpose',
     'Practice intentional, easy repetitions to reduce fear and tension associated with stuttering.',
     NULL, 'Fluency', 'Desensitization', 'Fluency', 'Voluntary Stuttering', 'Word', 'Teaching Script', 'Purposeful Bumps',
     NULL, 'Model easy, relaxed repetitions on non-feared words. Student practices voluntary stuttering in a safe environment. Discuss how intentional stuttering reduces surprise and tension.', '/thumbnails/lesson-72.jpg', 72, FALSE, 123),

(73, 'Cancellations — Stop and Redo',
     'Teach the cancellation technique: pausing after a stuttered word and re-producing it with a strategy.',
     NULL, 'Fluency', 'Speech Motor Control', 'Fluency', 'Cancellations', 'Phrase', 'Teaching Script', 'Stop & Redo',
     NULL, 'After a moment of stuttering, pause completely. Take a breath. Re-say the word using easy onset or light contact. Practice in structured activities before using in conversation.', '/thumbnails/lesson-73.jpg', 73, FALSE, 198),

(74, 'Pull-Outs — Easing Out',
     'Learn to modify stuttering in the moment by transitioning from tense to relaxed production mid-stutter.',
     NULL, 'Fluency', 'Speech Motor Control', 'Fluency', 'Pull-Outs', 'Phrase', 'Teaching Script', 'Smooth Exit',
     NULL, 'During a moment of stuttering, teach the student to slow down, reduce tension, and ease out of the stutter smoothly rather than pushing through. Practice with simulated stuttering first.', '/thumbnails/lesson-74.jpg', 74, FALSE, 167),

(75, 'Preparatory Sets — Plan Ahead',
     'Practice pre-planning articulatory movements before producing feared words to prevent blocks.',
     NULL, 'Fluency', 'Speech Motor Planning', 'Fluency', 'Preparatory Sets', 'Word', 'Teaching Script', 'Speech Planning',
     NULL, 'Identify words the student anticipates stuttering on. Practice planning the first sound with easy onset before saying the word. Gradually increase to more challenging words and speaking contexts.', '/thumbnails/lesson-75.jpg', 75, FALSE, 134),

(76, 'Confidence Building — My Fluency Story',
     'Build positive attitudes toward communication through self-reflection and success journaling.',
     NULL, 'Fluency', 'Self-Esteem', 'Fluency', 'Confidence Building', 'Conversation', 'Printable Worksheet', 'Fluency Journal',
     NULL, 'Students write or draw about their speech journey, what they are proud of, and what strategies help them most. Share stories with the clinician. Build a portfolio of fluency successes.', '/thumbnails/lesson-76.jpg', 76, FALSE, 189),

(77, 'Speaking in Different Contexts — Real World Practice',
     'Generalize fluency strategies to real-world speaking situations (ordering food, talking to teachers).',
     NULL, 'Fluency', 'Generalization', 'Fluency', 'Generalization', 'Conversation', 'Teaching Script', 'Real World',
     NULL, 'Create a hierarchy of speaking situations from easiest to most challenging. Practice fluency strategies in simulated real-world scenarios. Assign homework to practice in natural environments.', '/thumbnails/lesson-77.jpg', 77, FALSE, 278),

(78, 'Phone Calls & Virtual Communication',
     'Practice fluency strategies during phone calls and video chats, which can increase stuttering for many students.',
     NULL, 'Fluency', 'Generalization', 'Fluency', 'Phone Skills', 'Conversation', 'Teaching Script', 'Phone Practice',
     NULL, 'Discuss why phone calls can be harder (no visual cues, time pressure). Practice calling for information (library hours, store prices). Use fluency strategies in simulated phone conversations.', '/thumbnails/lesson-78.jpg', 78, FALSE, 156),

(79, 'Group Fluency Therapy — Supporting Each Other',
     'Facilitate peer support through group activities that normalize stuttering and build community.',
     NULL, 'Fluency', 'Social Support', 'Fluency', 'Group Therapy', 'Conversation', 'Teaching Script', 'Peer Support',
     NULL, 'Structure group activities where students practice strategies together, share experiences, and provide supportive feedback. Emphasize that stuttering is just one part of who they are.', '/thumbnails/lesson-79.jpg', 79, FALSE, 212),

(80, 'Fluency Progress Assessment',
     'Measure stuttering frequency, duration, and severity across reading and conversation samples.',
     NULL, 'Fluency', 'Assessment', 'Fluency', 'Fluency Assessment', 'Conversation', 'Assessment', 'Fluency Probe',
     NULL, 'Collect 300-word reading and conversation samples. Calculate percent syllables stuttered, average stuttering duration, and severity rating. Compare to baseline and previous probes.', '/thumbnails/lesson-80.jpg', 80, FALSE, 334),

-- === PHONOLOGY (20 lessons) ===
(81, 'Fronting Remediation — Back Sound School',
     'Address the phonological process of fronting (replacing velars with alveolars) using minimal pairs.',
     9, 'Phonology', 'Phonological Awareness', 'Phonology', 'Fronting', 'Word', 'Interactive Genially Deck', 'Back Sounds',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030401', 'Present minimal pairs contrasting fronted and correct productions (tea/key, top/cop, two/coo). Student produces the target word and points to the matching picture. Emphasize the meaning change.', '/thumbnails/lesson-81.jpg', 81, FALSE, 345),

(82, 'Stopping Remediation — Let It Flow',
     'Target stopping of fricatives (replacing /f/, /s/, /sh/ with stops) through auditory discrimination and production.',
     9, 'Phonology', 'Auditory Discrimination', 'Phonology', 'Stopping', 'Word', 'Interactive Genially Deck', 'Flowing Sounds',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030402', 'Use minimal pairs (fin/pin, sip/tip, shoe/two) to demonstrate meaning changes when fricatives are stopped. Practice auditory discrimination first, then move to production.', '/thumbnails/lesson-82.jpg', 82, FALSE, 289),

(83, 'Cluster Reduction — Blend It Up',
     'Remediate cluster reduction by teaching students to produce consonant clusters in initial and final positions.',
     9, 'Phonology', 'Phonological Awareness', 'Phonology', 'Cluster Reduction', 'Syllable', 'Interactive Genially Deck', 'Blend Builders',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030403', 'Start with auditory bombardment of target clusters. Use building block animations to show how two sounds combine. Practice CV then CCV syllables. Target clusters: /sp/, /st/, /sk/, /bl/, /fl/.', '/thumbnails/lesson-83.jpg', 83, FALSE, 312),

(84, 'Final Consonant Deletion — Ending Sounds Matter',
     'Address omission of final consonants using minimal pairs and auditory bombardment.',
     9, 'Phonology', 'Phonological Awareness', 'Phonology', 'Final Consonant Deletion', 'Word', 'Flashcards', 'Ending Sounds',
     NULL, 'Present minimal pairs contrasting CVC and CV words (boat/bow, cup/cuh, hat/ha). Help students hear and produce the difference. Use tactile cues for final consonants.', '/thumbnails/lesson-84.jpg', 84, FALSE, 267),

(85, 'Cycles Approach — Weekly Sound Targets',
     'Implement the cycles approach by targeting one phonological pattern per week with structured bombardment and production.',
     9, 'Phonology', 'Treatment Planning', 'Phonology', 'Cycles Approach', 'Word', 'Teaching Script', 'Weekly Cycles',
     NULL, 'Begin with auditory bombardment of the target pattern. Practice 5-7 target words with production practice. End with repeated auditory bombardment. Cycle to the next pattern weekly.', '/thumbnails/lesson-85.jpg', 85, FALSE, 198),

(86, 'Minimal Pairs — /t/ vs /k/ Contrasts',
     'Use /t/ vs /k/ minimal pairs to remediate fronting of velars with contrastive production practice.',
     10, 'Phonology', 'Auditory Discrimination', 'Phonology', 'Minimal Pairs', 'Word', 'Interactive Genially Deck', 'T vs K',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030406', 'Present /t/ vs /k/ minimal pairs (tea/key, tie/kai, toe/co, tub/cub). Student produces the target word. If the wrong picture is selected, provide feedback on the meaning change.', '/thumbnails/lesson-86.jpg', 86, FALSE, 378),

(87, 'Minimal Pairs — /d/ vs /g/ Contrasts',
     'Use /d/ vs /g/ minimal pairs for fronting remediation targeting voiced velar stops.',
     10, 'Phonology', 'Auditory Discrimination', 'Phonology', 'Minimal Pairs', 'Word', 'Interactive Genially Deck', 'D vs G',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030407', 'Present /d/ vs /g/ minimal pairs (doe/go, dumb/gum, dale/gale). Follow the communicative approach — clinician picks up the wrong picture if the student fronts. Discuss meaning differences.', '/thumbnails/lesson-87.jpg', 87, FALSE, 312),

(88, 'Minimal Pairs — /f/ vs /p/ Contrasts',
     'Target stopping of /f/ using contrastive /f/ vs /p/ minimal pairs.',
     10, 'Phonology', 'Production Accuracy', 'Phonology', 'Minimal Pairs', 'Word', 'Flashcards', 'F vs P',
     NULL, 'Use flashcard pairs (fin/pin, fan/pan, four/pour, fast/past). Student produces the fricative target. Provide visual cues for airflow (feel the air on your hand for /f/).', '/thumbnails/lesson-88.jpg', 88, FALSE, 234),

(89, 'Minimal Pairs — /s/ vs /t/ Contrasts',
     'Address stopping of /s/ through contrastive /s/ vs /t/ minimal pair therapy.',
     10, 'Phonology', 'Production Accuracy', 'Phonology', 'Minimal Pairs', 'Word', 'Interactive Genially Deck', 'S vs T',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030409', 'Present /s/ vs /t/ minimal pairs (sip/tip, sun/ton, sew/toe). Emphasize the continuous airflow of /s/ vs. the quick release of /t/. Practice in communicative contexts.', '/thumbnails/lesson-89.jpg', 89, TRUE, 456),

(90, 'Minimal Pairs — /sh/ vs /s/ Contrasts',
     'Differentiate /sh/ and /s/ production using contrastive minimal pairs for depalatalization patterns.',
     10, 'Phonology', 'Auditory Discrimination', 'Phonology', 'Minimal Pairs', 'Word', 'Interactive Genially Deck', 'SH vs S',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030410', 'Present /sh/ vs /s/ minimal pairs (ship/sip, shoe/sue, shop/sop). Teach lip rounding for /sh/ vs. retracted lips for /s/. Use a mirror for visual feedback.', '/thumbnails/lesson-90.jpg', 90, FALSE, 289),

(91, 'Phonological Awareness — Rhyme Time',
     'Build phonological awareness through rhyming activities that support phonological pattern remediation.',
     NULL, 'Phonology', 'Phonological Awareness', 'Phonology', 'Rhyming', 'Word', 'Interactive Genially Deck', 'Rhyming Words',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030411', 'Present word sets and have students identify rhyming pairs. Generate rhymes for target words. Use rhyming word families to practice target sounds in multiple word positions.', '/thumbnails/lesson-91.jpg', 91, FALSE, 345),

(92, 'Sound Segmentation — Break It Apart',
     'Practice segmenting words into individual phonemes to build sound awareness for phonological therapy.',
     NULL, 'Phonology', 'Phonological Awareness', 'Phonology', 'Segmentation', 'Syllable', 'Interactive Genially Deck', 'Sound Segments',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030412', 'Present words and have students count and identify individual sounds. Use tokens or blocks to represent each phoneme. Progress from 2-phoneme to 4-phoneme words.', '/thumbnails/lesson-92.jpg', 92, FALSE, 267),

(93, 'Sound Blending — Put It Together',
     'Practice blending individual phonemes into complete words to support phonological processing.',
     NULL, 'Phonology', 'Phonological Awareness', 'Phonology', 'Blending', 'Syllable', 'Interactive Genially Deck', 'Sound Blending',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030413', 'Slowly say individual sounds and have students blend them into a word (/k/-/æ/-/t/ = cat). Use robot voice for segmented sounds and regular voice for blended words.', '/thumbnails/lesson-93.jpg', 93, FALSE, 223),

(94, 'Gliding Remediation — /r/ and /l/ vs /w/',
     'Address the phonological process of gliding where /r/ and /l/ are replaced with /w/.',
     NULL, 'Phonology', 'Production Accuracy', 'Phonology', 'Gliding', 'Word', 'Teaching Script', 'R L vs W',
     NULL, 'Use minimal pairs (rake/wake, lake/wake, red/wed, led/wed). Teach tongue placement differences between /w/ (rounded lips, back tongue) and /r/ or /l/ (tongue tip up).', '/thumbnails/lesson-94.jpg', 94, FALSE, 198),

(95, 'Deaffrication — Keeping the Combo',
     'Remediate deaffrication where affricates /ch/ and /j/ are produced as fricatives /sh/ and /zh/.',
     NULL, 'Phonology', 'Production Accuracy', 'Phonology', 'Deaffrication', 'Word', 'Flashcards', 'Affricate Practice',
     NULL, 'Teach that /ch/ and /j/ are combo sounds (stop + fricative). Use minimal pairs (chip/ship, chop/shop). Practice the "explosion" at the beginning of the affricate. Use hand cues.', '/thumbnails/lesson-95.jpg', 95, FALSE, 156),

(96, 'Prevocalic Voicing — Voice On/Off',
     'Address prevocalic voicing errors where voiceless consonants become voiced before vowels.',
     NULL, 'Phonology', 'Auditory Discrimination', 'Phonology', 'Prevocalic Voicing', 'Word', 'Teaching Script', 'Voice Control',
     NULL, 'Teach the concept of voice on (vocal cords vibrating) vs. voice off (quiet). Use hand on throat to feel vibration. Practice minimal pairs (pig/big, ten/den, cap/gab) with voicing awareness.', '/thumbnails/lesson-96.jpg', 96, FALSE, 134),

(97, 'Syllable Structure — Building Bigger Words',
     'Practice producing multisyllabic words with correct syllable structure and stress patterns.',
     NULL, 'Phonology', 'Phonological Awareness', 'Phonology', 'Syllable Structure', 'Syllable', 'Interactive Genially Deck', 'Syllable Building',
     'https://view.genially.com/embed/64e5f6a7b8c9d0e102030417', 'Start with 2-syllable words and progress to 3- and 4-syllable words. Use clapping and tapping for syllable counting. Practice words with weak syllable deletion (banana, telephone, elephant).', '/thumbnails/lesson-97.jpg', 97, FALSE, 178),

(98, 'Auditory Bombardment — Listen & Learn',
     'Provide focused auditory bombardment of target phonological patterns using amplified speech and word lists.',
     NULL, 'Phonology', 'Auditory Processing', 'Phonology', 'Auditory Bombardment', 'Word', 'Teaching Script', 'Listening Activity',
     NULL, 'Read a list of words containing the target pattern at a slightly amplified level. Student listens without producing. Repeat at the beginning and end of each session. Use themed word lists.', '/thumbnails/lesson-98.jpg', 98, FALSE, 145),

(99, 'Multiple Oppositions — Sound Contrasts',
     'Use multiple oppositions approach for students with highly unintelligible speech and multiple errors.',
     NULL, 'Phonology', 'Treatment Planning', 'Phonology', 'Multiple Oppositions', 'Word', 'Teaching Script', 'Sound Contrasts',
     NULL, 'Identify the student collapsed phoneme (e.g., /d/ for /g/, /k/, /s/, /sh/). Create a treatment set contrasting the collapse with all target sounds simultaneously. Use communicative approach.', '/thumbnails/lesson-99.jpg', 99, FALSE, 278),

(100, 'Phonology Progress Assessment',
      'Assess phonological process use across a standardized word list and connected speech sample.',
      NULL, 'Phonology', 'Assessment', 'Phonology', 'Phonology Assessment', 'Word', 'Assessment', 'Phonology Probe',
      NULL, 'Administer a phonological process analysis using a standardized word list. Analyze connected speech for process use. Calculate percent occurrence of each process and compare to age norms.', '/thumbnails/lesson-100.jpg', 100, FALSE, 367);

-- -----------------------------------------------------------
-- Curriculum Steps (50 total — 5 per curriculum)
-- -----------------------------------------------------------
INSERT INTO slp_curriculum_steps (id, curriculum_id, lesson_id, step_number, suggested_next_lesson_id) VALUES
-- Curriculum 1: Articulation: Initial /S/ Mastery
(1,  1, 1,  1, 2),
(2,  1, 2,  2, 3),
(3,  1, 3,  3, 4),
(4,  1, 4,  4, 5),
(5,  1, 5,  5, NULL),

-- Curriculum 2: Articulation: Final /R/ Blends
(6,  2, 6,  1, 7),
(7,  2, 7,  2, 8),
(8,  2, 8,  3, 9),
(9,  2, 9,  4, 10),
(10, 2, 10, 5, NULL),

-- Curriculum 3: Language: WH Questions Progression
(11, 3, 21, 1, 22),
(12, 3, 22, 2, 23),
(13, 3, 23, 3, 24),
(14, 3, 24, 4, 25),
(15, 3, 25, 5, NULL),

-- Curriculum 4: Language: Following Multi-Step Directions
(16, 4, 26, 1, 27),
(17, 4, 27, 2, 28),
(18, 4, 28, 3, 29),
(19, 4, 29, 4, 30),
(20, 4, 30, 5, NULL),

-- Curriculum 5: Pragmatics: Turn Taking & Conversation Skills
(21, 5, 41, 1, 42),
(22, 5, 42, 2, 43),
(23, 5, 43, 3, 44),
(24, 5, 44, 4, 45),
(25, 5, 45, 5, NULL),

-- Curriculum 6: Pragmatics: Social Problem Solving
(26, 6, 46, 1, 47),
(27, 6, 47, 2, 48),
(28, 6, 48, 3, 49),
(29, 6, 49, 4, 50),
(30, 6, 50, 5, NULL),

-- Curriculum 7: Fluency: Stuttering Management Techniques
(31, 7, 61, 1, 62),
(32, 7, 62, 2, 63),
(33, 7, 63, 3, 64),
(34, 7, 64, 4, 65),
(35, 7, 65, 5, NULL),

-- Curriculum 8: Fluency: Rate & Rhythm Control
(36, 8, 66, 1, 67),
(37, 8, 67, 2, 68),
(38, 8, 68, 3, 69),
(39, 8, 69, 4, 70),
(40, 8, 70, 5, NULL),

-- Curriculum 9: Phonology: Phonological Processes Remediation
(41, 9, 81, 1, 82),
(42, 9, 82, 2, 83),
(43, 9, 83, 3, 84),
(44, 9, 84, 4, 85),
(45, 9, 85, 5, NULL),

-- Curriculum 10: Phonology: Minimal Pairs Therapy
(46, 10, 86, 1, 87),
(47, 10, 87, 2, 88),
(48, 10, 88, 3, 89),
(49, 10, 89, 4, 90),
(50, 10, 90, 5, NULL);

-- -----------------------------------------------------------
-- Playlists (4 for user 2)
-- -----------------------------------------------------------
INSERT INTO slp_playlists (id, user_id, name, description, is_default, sort_order) VALUES
(1, 2, 'Monday Speech Groups',    'Activities for Monday morning articulation and language groups.', TRUE,  1),
(2, 2, 'Final /S/ Practice',      'Collection of final /s/ activities across all levels for targeted practice.', FALSE, 2),
(3, 2, 'WH Questions',            'WH question activities from basic what/where through complex why/how.', FALSE, 3),
(4, 2, 'Second Grade Language',    'Language activities appropriate for second grade caseload.', FALSE, 4);

-- -----------------------------------------------------------
-- Playlist Items (10 total)
-- -----------------------------------------------------------
INSERT INTO slp_playlist_items (id, playlist_id, lesson_id, sort_order, notes) VALUES
(1,  1, 3,  1, 'Great warm-up activity — kids love the safari theme'),
(2,  1, 21, 2, 'Use for mixed group — pair with WH question goals'),
(3,  1, 42, 3, 'Perfect for pragmatic group on Mondays'),
(4,  2, 12, 1, 'Start with bingo for final /s/ at word level'),
(5,  2, 4,  2, 'Adapt for final position — use ending sentence frames'),
(6,  2, 20, 3, 'Use as progress check every 4 weeks'),
(7,  3, 21, 1, 'Begin with concrete what questions'),
(8,  3, 22, 2, 'Progress to where questions once 80% accuracy on what'),
(9,  3, 25, 3, 'Advanced — save for students ready for inferencing'),
(10, 4, 33, 1, 'Sequencing is a hit with 2nd graders');

-- -----------------------------------------------------------
-- Favorites (15 for user 2)
-- -----------------------------------------------------------
INSERT INTO slp_favorites (user_id, lesson_id) VALUES
(2, 3),
(2, 8),
(2, 13),
(2, 21),
(2, 24),
(2, 29),
(2, 37),
(2, 42),
(2, 47),
(2, 52),
(2, 58),
(2, 68),
(2, 81),
(2, 89),
(2, 91);

-- -----------------------------------------------------------
-- User Progress (20 records for user 2)
-- -----------------------------------------------------------
INSERT INTO slp_user_progress (user_id, lesson_id, curriculum_id, last_opened_at, times_opened) VALUES
(2, 1,  1,    '2026-10-20 09:15:00', 5),
(2, 2,  1,    '2026-10-20 09:30:00', 4),
(2, 3,  1,    '2026-10-21 10:00:00', 7),
(2, 4,  1,    '2026-10-21 10:30:00', 3),
(2, 5,  1,    '2026-10-22 08:45:00', 2),
(2, 8,  2,    '2026-10-19 14:00:00', 6),
(2, 12, NULL, '2026-10-18 11:00:00', 3),
(2, 13, NULL, '2026-10-22 09:00:00', 8),
(2, 21, 3,    '2026-10-22 10:15:00', 9),
(2, 22, 3,    '2026-10-22 10:30:00', 5),
(2, 24, 3,    '2026-10-21 14:00:00', 4),
(2, 29, 4,    '2026-10-20 13:00:00', 2),
(2, 33, NULL, '2026-10-19 15:30:00', 6),
(2, 37, NULL, '2026-10-18 09:00:00', 3),
(2, 42, 5,    '2026-10-22 11:00:00', 10),
(2, 47, 6,    '2026-10-21 13:45:00', 4),
(2, 68, 8,    '2026-10-20 10:00:00', 5),
(2, 81, 9,    '2026-10-19 09:30:00', 7),
(2, 89, 10,   '2026-10-22 14:00:00', 6),
(2, 91, NULL, '2026-10-17 11:30:00', 2);

-- -----------------------------------------------------------
-- Saved Filters (2 for user 2)
-- -----------------------------------------------------------
INSERT INTO slp_saved_filters (user_id, name, filters, filter_json) VALUES
(2, 'Articulation Word Level',
    '{"domain": "Articulation", "level": "Word", "activity_format": null, "target": null}',
    '{"domain": "Articulation", "level": "Word", "activity_format": null, "target": null}'),
(2, 'Language Interactive Decks',
    '{"domain": "Language", "level": null, "activity_format": "Interactive Genially Deck", "target": null}',
    '{"domain": "Language", "level": null, "activity_format": "Interactive Genially Deck", "target": null}');
