// Parent-guide article bodies (EN/ES/FR), one record per guide, keyed by the
// registry slug in src/data/resources.ts. Moved out of src/pages/Resources.tsx
// when each guide got its own /resources/<slug> page: the index page lists the
// guides, the article page renders one body, and nothing is duplicated.
//
// Brand voice is warm, multilingual, parent-to-parent, lightly poetic.
// Translations are adapted (not literal) so each language reads as if Eva
// wrote it in that language directly.
import type { Language } from '../lib/language';
import { amazonDp } from '../lib/amazon';

export type AffiliatePart = { href: string; text: string };
export type BodyPart = string | AffiliatePart;
export type Section = { title: string; body: BodyPart[] };
export type SkipList = { title: string; items: { lead: string; rest: string }[] };

export interface ArticleBody {
  eyebrow: string;
  title: string;
  intro: string;
  /** Ordinary guides: headed sections. */
  sections?: Section[];
  /** Reading-environment guide: the "choose" sections, followed by a skip list. */
  choices?: Section[];
  skip?: SkipList;
}

// Affiliate URLs -- single source of truth. Keep in sync with
// outputs/social_media_infra/trackers/00_master_tracker.xlsx -> Affiliate_Links.
// The Associates tracking ID is centralized in lib/amazon (amazonDp appends it).
const AFFILIATE = {
  readingLamp: amazonDp('B0FMJRR92L'), // AF-001 -- SMARTERIOR Bedside Table Lamp for Kids
  floorCushion: amazonDp('B0DNZJ2W9C'), // AF-002 -- MAXYOYO 3-in-1 Kids Bean Bag Chair Couch
  bookshelf: amazonDp('B0GJLKWVKJ'), // AF-003 -- Chuiendi 4-Tier Montessori Front-Facing Bookshelf
  storyCubes: amazonDp('B07P3MB9H8'), // AF-004 -- Rory's Story Cubes Classic (Box)
  galaxyProjector: amazonDp('B09Q2WL7C6'), // AF-005 -- SFOUR Astronaut Galaxy Projector
} as const;

const BODIES = {
  en: {
    article1: {
      eyebrow: 'Reading Tips \xb7 5 min read',
      title: '10 Ways to Make Reading Time Magical',
      intro: 'Transform ordinary reading sessions into memorable adventures your child will look forward to every single day.',
      sections: [
        { title: '1. Set the mood – light matters more than you think', body: [
          'Bedtime reading hits different when the overhead light is off and a soft, warm glow surrounds the book. We use a clip-on kids’ reading lamp that gives off just enough light for the words without the overstimulation of a ceiling fixture. Our pick: ',
          { href: AFFILIATE.readingLamp, text: 'this dimmable bedside lamp' },
          '.',
        ] },
        { title: '2. Build a reading rhythm, not a reading rule', body: [
          'Kids resist rules; they lean into rhythms. Pair reading time with something sensory – a particular blanket, a specific tea for you, the same playlist on low. After two weeks the cue alone makes them reach for a book.',
        ] },
        { title: '3. Pair the story with hands-on play', body: [
          'Reading about animals? Pull out finger puppets. About space? Cardboard rockets. The point isn’t a Pinterest-perfect craft, it’s the bridge from page to body. After the last page, we keep a tin of ',
          { href: AFFILIATE.storyCubes, text: 'story cubes' },
          ' on the shelf. Nine dice with images instead of words, so the kids invent the sequel together in whichever language they feel like that night.',
        ] },
        { title: '4. Let them turn the pages – even when they get it wrong', body: [
          'Control is the gateway to engagement. A three-year-old turning two pages at once still chose to be there. Don’t correct it. Just keep reading.',
        ] },
        { title: '5. Voice acting is allowed', body: [
          'If you’ve never been a grandmother witch with a stuffy nose, this is your moment. Kids will quote you back to themselves for weeks.',
        ] },
        { title: '6. Read the same book until you can’t stand it', body: [
          'Repetition is how fluency develops. The book you’ve read 47 times is the one teaching them most. Keep going.',
        ] },
        { title: '7. Bring in a second language casually', body: [
          'Even if you’re not fluent, swap a single word per page. “Look at the perro.” Then “The perro is sleeping.” Children absorb the second language as part of the story, not as a lesson.',
        ] },
        { title: '8. Pause for predictions', body: [
          'Halfway through, ask: “What do you think will happen?” Then go back to reading. Kids who have already made a guess follow the story more closely on the next read-through.',
        ] },
        { title: '9. Build the nook', body: [
          'A reading nook is a vote of confidence – a small space that says “this matters here.” Start with a ',
          { href: AFFILIATE.floorCushion, text: 'convertible floor cushion' },
          ' and a ',
          { href: AFFILIATE.bookshelf, text: 'front-facing Montessori bookshelf' },
          ' so they can see the covers. That’s the whole setup.',
        ] },
        { title: '10. Be the reader your child sees most', body: [
          'Children read more if they live with someone who reads. Twenty minutes of you on the couch with your own book does more for their literacy than any printable.',
        ] },
      ] satisfies Section[],
    },
    article3: {
      eyebrow: 'Child Development \xb7 8 min read',
      title: 'Age-Appropriate Reading Milestones',
      intro: 'Every child arrives at reading on their own schedule. But knowing what to gently look for at each stage helps you meet them exactly where they are.',
      sections: [
        { title: 'Ages 2–3: The world is one big sound experiment', body: [
          'At this age, children are not learning to read – they are learning that words mean things. Sturdy board books with big, clear illustrations are ideal. You’ll notice your child pointing at pictures, babbling in the rhythm of your sentences, and asking you to name objects on each page. This is vocabulary building at its most natural. Repetition is the engine here: re-reading the same book a dozen times in a row is not boredom, it is fluency in formation. Look for books with simple rhyme schemes and two to four words per page. Bilingual books at this stage work beautifully because young brains are not yet locked into a single sound system.',
        ] },
        { title: 'Ages 4–5: Pattern recognition and the magic of “I know this word”', body: [
          'Around age four, children start to notice that letters correspond to sounds. They will pick out the first letter of their name in a book title and announce it loudly. This is phonemic awareness beginning to bloom. Look for books with clear repetitive phrases that a child can begin to chant along with you: “Brown Bear, Brown Bear, what do you see?” that kind of call-and-response structure lets them feel like readers before they technically are. At this stage, running your finger under the words as you read is one of the most powerful things you can do. Eva’s books are designed with this finger-tracking in mind.',
        ] },
        { title: 'Ages 5–6: Decoding begins – and so does the urge to read alone', body: [
          'This is the year many children crack the code. The vowel sounds, the sight words, the realization that the black marks on the page produce the same story every time – it clicks. Your child may start trying to read signage, cereal boxes, everything. Feed that hunger. Keep a basket of easy-reader books near the breakfast table. The goal is not perfection but momentum. Mistakes are evidence that reading is happening.',
        ] },
        { title: 'Ages 6–7: From reading to read-for-pleasure', body: [
          'By now most children in school are formally decoding. What you are nurturing at home is something school cannot fully reach: the love of a story for its own sake. Chapter books with short chapters, comics, illustrated diaries – anything that makes a child stay up past bedtime with a flashlight. Let them. The habit you build now is the one that carries them through middle school, high school, and beyond. The Eva Gallo bilingual stories are wonderful here as bridge books: familiar enough to feel safe, rich enough to stretch.',
        ] },
        { title: 'A note on timelines', body: [
          'These windows are guides, not report cards. Some five-year-olds are reading full sentences; some seven-year-olds are still working on letter sounds, and both can be entirely typical. If you have a concern, talk to your child’s teacher or a reading specialist. What you can always do, at every age, is read with them. That part never goes wrong.',
        ] },
      ] satisfies Section[],
    },
    article4: {
      eyebrow: 'Activity Ideas \xb7 6 min read',
      title: '5 Creative Follow-Up Activities After Reading',
      intro: 'The last page is not the end of the story. Here are five ways to keep the conversation going, the imagination moving, and the vocabulary growing.',
      sections: [
        { title: '1. Act it out – the living-room stage', body: [
          'After finishing a story, invite your child to be one of the characters. You take another. Re-enact the scene they liked most. Children who physically embody a character remember vocabulary, sequencing, and theme far better than those who only listened. No costumes required – a kitchen-towel cape and a cardboard crown are more than enough. If the story is bilingual, try performing one character’s lines in each language. You’ll be surprised how naturally the second language flows when it’s attached to a role.',
        ] },
        { title: '2. Draw the part that wasn’t there', body: [
          'Ask your child: “What do you think happened right before the story started?” or “What comes next after the last page?” and invite them to draw it. This builds narrative thinking – the understanding that stories have a before, during, and after. Tape the drawings into the back cover of the book. Over time you’ll have a collection of sequels written and illustrated entirely by your child.',
        ] },
        { title: '3. Play “word of the day”', body: [
          'Choose one new word from the book – ideally a rich descriptive word rather than a sight word – and challenge your child to use it three times before dinner. Make it a game, not a test. If they use it at the table, everyone cheers. If you use it first, they can call you out. Words encountered in stories and then used in real life stick in long-term memory at dramatically higher rates than words from a list.',
        ] },
        { title: '4. Cook or make something from the story', body: [
          'Did the characters eat something? Make it together. Did they build something? Try it. The sensory connection between a story and a hands-on activity is one of the most durable learning bridges we know of. It also transforms reading from a sit-still activity into something that moves through the whole day. Keep a set of ',
          { href: AFFILIATE.storyCubes, text: 'story dice' },
          ' on the kitchen counter so your child can roll them after reading and invent a new version of the story while you cook together.',
        ] },
        { title: '5. Write a letter from the character', body: [
          'For children who are beginning to write, or who love dictating while a parent writes: invite them to write a letter as if they are the main character. Who would that character write to? What would they say about what happened? This exercise develops perspective-taking, narrative voice, and writing motivation all at once. It also creates a keepsake: a collection of these letters, dated and tucked into a folder, becomes one of the most treasured things a family can look back on years later.',
        ] },
      ] satisfies Section[],
    },
    article5: {
      eyebrow: 'Building Engagement \xb7 7 min read',
      title: 'Building a Love for Reading in Reluctant Readers',
      intro: 'Some children love books on contact. Others need a longer runway. If your child is in the second group, you are not doing anything wrong – and there is a lot you can do.',
      sections: [
        { title: 'Start where the interest already lives', body: [
          'If your child loves trucks, dinosaurs, superheroes, or a specific cartoon character – there is a book for that. The content of the book matters far less than the act of choosing, holding, and returning to it. Reluctant readers are almost never reluctant about everything; they are often deeply passionate about something specific. Follow that thread into books. Once a child has had the experience of a book they genuinely wanted to pick up, the category of “reading” expands in their mind.',
        ] },
        { title: 'Make it active, not passive', body: [
          'Some children resist sitting still for a book but will happily follow along while they draw, build with blocks, or play with small figures. Listening while doing is a legitimate form of reading engagement. Audiobooks, books with a read-along feature, and bilingual audio tracks like the ones in Eva’s stories can all be the entry point. The voice, the rhythm, the story – these reach children who are not yet ready to sit at a page.',
        ] },
        { title: 'Let them choose, even if the choice surprises you', body: [
          'A child who chooses a comic book, a joke book, a sports almanac, or a graphic novel is choosing to read. Resist the urge to redirect toward something that looks more “educational.” Engagement is the education. A seven-year-old who burns through every Captain Underpants book is building stamina, humor recognition, plot comprehension, and vocabulary. Those skills transfer.',
        ] },
        { title: 'Read aloud past the age when you think you should stop', body: [
          'Many parents stop reading aloud when children start reading independently. This is understandable but worth reconsidering. Hearing a fluent reader model expression, pacing, and emotion – especially in a second language – is something a beginning reader cannot yet give themselves. The read-aloud relationship also matters emotionally. The child who was read to at seven still remembers it at thirty-seven.',
        ] },
        { title: 'Never use books as a punishment or a chore', body: [
          'Reading for twenty minutes before screen time, reading instead of play, reading as a consequence for misbehavior – all of these frame books as the opposite of joy. We want reading to live in the category of warm, unhurried, wanted things. If the only reading happening in your house is assigned reading, find one book – just one – that has nothing to do with school and everything to do with what your child finds funny, beautiful, or exciting. The Eva Gallo collection was designed with exactly this in mind: stories that feel like an invitation, not an assignment.',
        ] },
      ] satisfies Section[],
    },
    article2: {
      eyebrow: 'Reading Tips \xb7 4 min read',
      title: 'Creating the Perfect Reading Environment',
      intro: 'Design a space that makes your child reach for a book without being asked. This isn’t about Pinterest-perfect rooms. It’s about three deliberate choices.',
      choices: [
        { title: 'Choice 1 – Comfort that says “stay a while”', body: [
          'Forget structured chairs. Kids read longer when they’re slouching, side-lying, or upside-down on something soft. A washable floor cushion is the workhorse here. Our pick: ',
          { href: AFFILIATE.floorCushion, text: 'this 3-in-1 convertible kids’ bean bag couch' },
          '. Machine-washable, big enough that two kids can pile on without an elbow war.',
        ] },
        { title: 'Choice 2 – Book covers, not book spines', body: [
          'Traditional bookshelves hide picture-book covers and turn reading into a search problem. A forward-facing Montessori-style bookshelf shows four to six books at a time. Rotate them weekly. Kids pick up books they see, not books they have to dig for. Our pick: ',
          { href: AFFILIATE.bookshelf, text: 'this 4-tier wooden front-facing bookshelf' },
          '.',
        ] },
        { title: 'Choice 3 – Light that signals “reading”', body: [
          'Lighting is the most underrated piece. We use ',
          { href: AFFILIATE.readingLamp, text: 'a warm dimmable lamp' },
          ' that we only turn on for reading. After a few weeks, the click of the lamp is itself the bedtime cue. The lamp goes on, the body settles.',
        ] },
        { title: 'Choice 4 – On special nights, turn the ceiling into the sky', body: [
          'We keep this one for the books that deserve an event. Maya’s Shadow, anything moon-related, the rare second-read request. Plug in ',
          { href: AFFILIATE.galaxyProjector, text: 'a star projector' },
          ', kill the lamps, and the ceiling becomes a slow-drifting galaxy. The remote lets you match the brightness to the mood. Eight nebula effects, timer included, so it switches off after they’ve fallen asleep mid-page.',
        ] },
      ] satisfies Section[],
      skip: {
        title: 'Three things to skip',
        items: [
          { lead: 'A theme.', rest: 'Nautical, jungle, princess – kids outgrow themes faster than the paint dries.' },
          { lead: 'A screen anywhere in sight.', rest: 'Even an off iPad on a side table is a competitor. Move it.' },
          { lead: 'Background music with lyrics.', rest: 'Instrumental only. Lyrics fight with the story for the same processing channel.' },
        ],
      } satisfies SkipList,
    },
    article6: {
      eyebrow: 'Child Development \xb7 6 min read',
      title: 'Why Bilingual Reading Matters',
      intro: 'Reading to your child in two languages is one of the most powerful things you can do for their brain, their confidence, and their sense of who they are in the world.',
      sections: [
        { title: 'What the research actually says', body: [
          'Studies consistently show that children raised in bilingual environments develop stronger executive function – the set of skills that includes attention, flexible thinking, and impulse control. Reading in two languages adds another layer: children who regularly hear two languages in the same story start to understand that one idea can live in multiple forms. That is not confusion; that is cognitive flexibility. Researchers at the University of Washington found that bilingual infants as young as six months old are better at ignoring distractions. The advantage compounds over time.',
        ] },
        { title: 'When to start – earlier than you might think', body: [
          'The window for phoneme acquisition – the ability to hear and reproduce the distinct sounds of a language – begins to narrow around age seven. This does not mean children cannot learn a second language after seven; they absolutely can and do. But the youngest years are uniquely receptive. A baby hearing Spanish lullabies and English picture books in the same evening is not overwhelmed – their brain is doing exactly what it was built to do. You do not need to be fluent to start. A bilingual book read in both languages, page by page, is enough.',
        ] },
        { title: 'Code-switching is a feature, not a bug', body: [
          'If your child starts mixing languages – saying “I want the perro to come inside” – this is a sign of sophisticated language processing, not confusion. Code-switching is what multilingual adults do naturally. It reflects fluency across both systems and the ability to draw from whichever resource is most expressive in the moment. Never correct it toward monolingualism. If you want to gently reinforce a word, model it: “Yes, the dog! Can you tell grandma what the dog is called in Spanish?”',
        ] },
        { title: 'Heritage language and family identity', body: [
          'For many families, a heritage language is not just communication – it is a thread to grandparents, to food, to music, to a place. Children who have access to that thread in their early reading life carry it differently than children who encounter it only in formal lessons. When Eva writes a bilingual story, she is thinking about the grandmother reading in Spanish while her grandchild follows in English. She is thinking about the child who will one day read that book to their own child. That is the length of time a story can travel.',
        ] },
        { title: 'A practical first step', body: [
          'Choose one bilingual book and commit to reading it in both languages at least once a week for a month. You do not need to translate every page perfectly. You do not need to be a teacher. You need to be present, warm, and willing to stumble through a word in another language while your child watches and learns that languages are something humans do, not something only experts have. Start with Eva’s collection – every story is crafted to make both languages feel equally at home on the page.',
        ] },
      ] satisfies Section[],
    },
  },
  es: {
    article1: {
      eyebrow: 'Consejos de lectura \xb7 5 min de lectura',
      title: '10 formas de hacer m\xe1gico el tiempo de lectura',
      intro: 'Transforma las sesiones de lectura cotidianas en aventuras memorables que tu peque esperar\xe1 con ilusi\xf3n cada d\xeda.',
      sections: [
        { title: '1. Crea el ambiente – la luz importa m\xe1s de lo que crees', body: [
          'La lectura a la hora de dormir cambia cuando se apaga la luz del techo y un resplandor c\xe1lido y suave envuelve el libro. Usamos una l\xe1mpara infantil con pinza que da la luz justa para las palabras, sin la sobrecarga de la luz cenital. Nuestra elecci\xf3n: ',
          { href: AFFILIATE.readingLamp, text: 'esta l\xe1mpara de mesilla regulable' },
          '.',
        ] },
        { title: '2. Crea un ritmo de lectura, no una regla de lectura', body: [
          'Los ni\xf1os se resisten a las reglas; se inclinan a los rituales. Empareja el tiempo de lectura con algo sensorial: una manta concreta, un t\xe9 espec\xedfico para ti, la misma playlist a volumen bajo. A las dos semanas, la se\xf1al sola basta para que cojan un libro.',
        ] },
        { title: '3. Une la historia con juego sensorial', body: [
          '\xbfLeen sobre animales? Saca marionetas de dedo. \xbfSobre el espacio? Cohetes de cart\xf3n. No se trata de una manualidad perfecta de Pinterest, se trata del puente entre la p\xe1gina y el cuerpo. Cuando termina el cuento, guardamos una caja de ',
          { href: AFFILIATE.storyCubes, text: 'cubos de cuentos' },
          ' en la estanter\xeda. Nueve dados con im\xe1genes en vez de palabras, para que los peques inventen la continuaci\xf3n juntos en el idioma que les apetezca esa noche.',
        ] },
        { title: '4. D\xe9jales pasar las p\xe1ginas – incluso cuando se equivocan', body: [
          'El control es la puerta de entrada al inter\xe9s. Un peque de tres a\xf1os que pasa dos p\xe1ginas a la vez igualmente eligi\xf3 estar ah\xed. No corrijas. Sigue leyendo.',
        ] },
        { title: '5. Las voces de personajes est\xe1n permitidas', body: [
          'Si nunca has sido una abuela bruja con la nariz tapada, este es tu momento. Los ni\xf1os te imitar\xe1n durante semanas.',
        ] },
        { title: '6. Lee el mismo libro hasta que no lo soportes', body: [
          'La repetici\xf3n es como se desarrolla la fluidez. El libro que has le\xeddo 47 veces es el que m\xe1s les est\xe1 ense\xf1ando. Sigue.',
        ] },
        { title: '7. Introduce un segundo idioma con naturalidad', body: [
          'Aunque no domines el idioma, cambia una sola palabra por p\xe1gina. “Look at the perro.” Luego “The perro is sleeping.” Los ni\xf1os absorben el segundo idioma como parte de la historia, no como una lecci\xf3n.',
        ] },
        { title: '8. Pausa para predecir', body: [
          'A mitad del cuento, pregunta: “\xbfQu\xe9 crees que pasar\xe1?” Luego sigue leyendo. Los ni\xf1os que ya han hecho una conjetura siguen la historia con m\xe1s atenci\xf3n en la siguiente lectura.',
        ] },
        { title: '9. Construye el rinc\xf3n', body: [
          'Un rinc\xf3n de lectura es un voto de confianza – un peque\xf1o espacio que dice “esto importa aqu\xed.” Empieza con un ',
          { href: AFFILIATE.floorCushion, text: 'coj\xedn de suelo convertible' },
          ' y una ',
          { href: AFFILIATE.bookshelf, text: 'estanter\xeda Montessori de frente' },
          ' para que vean las portadas. Esa es toda la instalaci\xf3n.',
        ] },
        { title: '10. S\xe9 el lector que tu peque m\xe1s ve', body: [
          'Los ni\xf1os leen m\xe1s si conviven con alguien que lee. Veinte minutos tuyos en el sof\xe1 con tu propio libro hacen m\xe1s por su alfabetizaci\xf3n que cualquier imprimible.',
        ] },
      ] satisfies Section[],
    },
    article3: {
      eyebrow: 'Desarrollo infantil \xb7 8 min de lectura',
      title: 'Hitos de lectura por edades',
      intro: 'Cada ni\xf1o llega a la lectura a su propio ritmo. Conocer lo que puedes esperar en cada etapa te ayuda a acompa\xf1arle justo donde est\xe1.',
      sections: [
        { title: 'De 2 a 3 a\xf1os: el mundo es un gran experimento sonoro', body: [
          'A esta edad los ni\xf1os no aprenden a leer – aprenden que las palabras significan cosas. Los libros de cart\xf3n con im\xE1genes grandes y claras son ideales. La repetici\xf3n es el motor: releer el mismo libro doce veces seguidas no es aburrimiento, es fluidez en formaci\xf3n. Los libros biling\xfces funcionan de maravilla porque los cerebros j\xf3venes a\xfan no est\xe1n bloqueados en un \xfanico sistema de sonidos.',
        ] },
        { title: 'De 4 a 5 a\xf1os: el reconocimiento de patrones y la magia de “ya s\xe9 esta palabra”', body: [
          'Alrededor de los cuatro a\xf1os los ni\xf1os empiezan a notar que las letras corresponden a sonidos. Busca libros con frases repetitivas que puedan corear contigo. Ir pasando el dedo por debajo de las palabras al leer es una de las cosas m\xe1s poderosas que puedes hacer en esta etapa.',
        ] },
        { title: 'De 5 a 6 a\xf1os: empieza la decodificaci\xf3n, y tambi\xe9n las ganas de leer solo', body: [
          'Este es el a\xf1o en que muchos ni\xf1os descifran el c\xf3digo. Los sonidos de las vocales, las palabras de uso frecuente, darse cuenta de que las marcas negras de la p\xe1gina producen la misma historia cada vez: hace clic. Tu peque puede empezar a intentar leer carteles, cajas de cereales, todo. Alimenta esas ganas. Ten una cesta de libros de lectura f\xe1cil cerca de la mesa del desayuno. La meta no es la perfecci\xf3n sino el impulso. Los errores son la prueba de que la lectura est\xe1 ocurriendo.',
        ] },
        { title: 'De 6 a 7 a\xf1os: de leer a leer por placer', body: [
          'A estas alturas, la mayor\xeda de los ni\xf1os ya decodifican formalmente en la escuela. Lo que cultivas en casa es algo que la escuela no puede alcanzar del todo: el amor por una historia por s\xed misma. Libros de cap\xedtulos cortos, c\xf3mics, diarios ilustrados: cualquier cosa que mantenga a un ni\xf1o despierto pasada la hora de dormir con una linterna. D\xe9jalos. El h\xe1bito que construyes ahora es el que los acompa\xf1ar\xe1 en la secundaria, el bachillerato y m\xe1s all\xe1. Los libros biling\xfces de Eva Gallo son ideales como libros puente: suficientemente familiares para sentirse seguros, suficientemente ricos para crecer.',
        ] },
        { title: 'Sobre los plazos', body: [
          'Estas ventanas son gu\xedas, no calificaciones. Lo que siempre puedes hacer, a cualquier edad, es leer con tu peque. Eso nunca falla.',
        ] },
      ] satisfies Section[],
    },
    article4: {
      eyebrow: 'Ideas de actividades \xb7 6 min de lectura',
      title: '5 actividades creativas para despu\xe9s de leer',
      intro: 'La \xfaltima p\xe1gina no es el final de la historia. Aqu\xed tienes cinco formas de seguir la conversaci\xf3n, mover la imaginaci\xf3n y hacer crecer el vocabulario.',
      sections: [
        { title: '1. Repr\xe9sentalo', body: [
          'Despu\xe9s del cuento, invite a tu peque a ser uno de los personajes. T\xfa toma otro. Representa la escena que m\xe1s le gust\xf3. Los ni\xf1os que encarnan f\xedsicamente un personaje recuerdan el vocabulario, la secuencia y el tema mucho mejor que los que solo escucharon.',
        ] },
        { title: '2. Dibuja la parte que no estaba', body: [
          'Pregunta: “\xbfQu\xe9 crees que pas\xf3 justo antes de que empezara la historia?” o “\xbfQu\xe9 pasa despu\xe9s de la \xfaltima p\xe1gina?” e inv\xedtale a dibujarlo. Esto desarrolla el pensamiento narrativo: la comprensi\xf3n de que las historias tienen un antes, un durante y un despu\xe9s.',
        ] },
        { title: '3. Juega a la “palabra del d\xeda”', body: [
          'Elige una palabra nueva del libro y desaf\xeda a tu peque a usarla tres veces antes de cenar. Las palabras que se encuentran en historias y luego se usan en la vida real permanecen en la memoria a largo plazo a tasas mucho m\xe1s altas que las palabras de una lista.',
        ] },
        { title: '4. Cocina o haz algo de la historia', body: [
          '\xbfLos personajes comieron algo? Prep\xe1ralo juntos. \xbfConstruyeron algo? Inténtalo. Mant\xe9n unos ',
          { href: AFFILIATE.storyCubes, text: 'dados de cuentos' },
          ' en la cocina para que tu peque pueda tirarlos despu\xe9s de leer e inventar una nueva versi\xf3n.',
        ] },
        { title: '5. Escribe una carta del personaje', body: [
          'Invita a tu peque a escribir una carta como si fuera el personaje principal. Este ejercicio desarrolla la toma de perspectiva, la voz narrativa y la motivaci\xf3n para escribir, todo a la vez.',
        ] },
      ] satisfies Section[],
    },
    article5: {
      eyebrow: 'Fomentar el inter\xe9s \xb7 7 min de lectura',
      title: 'Cultivar el amor por la lectura en lectores reticentes',
      intro: 'Algunos ni\xf1os aman los libros al instante. Otros necesitan un camino m\xe1s largo. Si tu peque est\xe1 en el segundo grupo, no est\xe1s haciendo nada mal.',
      sections: [
        { title: 'Empieza donde ya existe el inter\xe9s', body: [
          'Si a tu peque le encantan los camiones, los dinosaurios o los superh\xe9roes, hay un libro para eso. El contenido del libro importa mucho menos que el acto de elegirlo, sostenerlo y volver a \xe9l. Sigue ese hilo hacia los libros.',
        ] },
        { title: 'Hazlo activo, no pasivo', body: [
          'Algunos ni\xf1os se resisten a estar quietos con un libro, pero felizmente siguen la historia mientras dibujan o construyen. Los audiolibros y las pistas de audio biling\xfces como las de los cuentos de Eva pueden ser la puerta de entrada.',
        ] },
        { title: 'D\xe9jales elegir, aunque la elecci\xf3n te sorprenda', body: [
          'Un ni\xf1o que elige un c\xf3mic, un libro de chistes o un almanaque deportivo est\xe1 eligiendo leer. El inter\xe9s es el aprendizaje. Esas habilidades se transfieren.',
        ] },
        { title: 'Lee en voz alta m\xe1s tiempo del que crees necesario', body: [
          'Muchos padres dejan de leer en voz alta cuando los ni\xf1os empiezan a leer solos. La relaci\xf3n de lectura en voz alta tambi\xe9n importa emocionalmente. El ni\xf1o al que le le\xedas a los siete a\xf1os lo recuerda a los treinta y siete.',
        ] },
        { title: 'Nunca uses los libros como castigo', body: [
          'Queremos que la lectura viva en la categor\xeda de las cosas c\xe1lidas, tranquilas y deseadas. La colecci\xf3n de Eva Gallo fue dise\xf1ada exactamente con esto en mente: historias que se sienten como una invitaci\xf3n, no como una tarea.',
        ] },
      ] satisfies Section[],
    },
    article2: {
      eyebrow: 'Consejos de lectura \xb7 4 min de lectura',
      title: 'Crear el ambiente perfecto para leer',
      intro: 'Dise\xf1a un espacio que invite a tu peque a coger un libro sin que se lo pidas. No se trata de habitaciones perfectas de Pinterest. Se trata de tres decisiones deliberadas.',
      choices: [
        { title: 'Decisi\xf3n 1 – Comodidad que dice “qu\xe9date un rato”', body: [
          'Olvida las sillas r\xedgidas. Los peques leen m\xe1s tiempo cuando est\xe1n desparramados, de lado o boca abajo sobre algo blando. Un coj\xedn de suelo lavable es el caballo de batalla aqu\xed. Nuestra elecci\xf3n: ',
          { href: AFFILIATE.floorCushion, text: 'este sof\xe1 puff 3-en-1 para ni\xf1os' },
          '. Lavable a m\xe1quina, lo bastante grande para que dos peques se amontonen sin guerra de codos.',
        ] },
        { title: 'Decisi\xf3n 2 – Portadas de libros, no lomos', body: [
          'Las estanter\xedas tradicionales esconden las portadas de los \xe1lbumes ilustrados y convierten la lectura en un problema de b\xfasqueda. Una estanter\xeda Montessori de frente muestra entre cuatro y seis libros a la vez. Rotalos cada semana. Los ni\xf1os cogen los libros que ven, no los que tienen que rebuscar. Nuestra elecci\xf3n: ',
          { href: AFFILIATE.bookshelf, text: 'esta estanter\xeda de madera de 4 niveles, libros de frente' },
          '.',
        ] },
        { title: 'Decisi\xf3n 3 – Una luz que dice “lectura”', body: [
          'La iluminaci\xf3n es la pieza m\xe1s infravalorada. Usamos ',
          { href: AFFILIATE.readingLamp, text: 'una l\xe1mpara c\xe1lida regulable' },
          ' que solo encendemos para leer. A las pocas semanas, el clic de la l\xe1mpara es la se\xf1al de la hora de dormir. La l\xe1mpara se enciende, el cuerpo se calma.',
        ] },
        { title: 'Decisi\xf3n 4 – En noches especiales, convierte el techo en un cielo', body: [
          'Esta la reservamos para los libros que merecen ceremonia. Enchufa ',
          { href: AFFILIATE.galaxyProjector, text: 'un proyector de estrellas' },
          ', apaga las l\xe1mparas, y el techo se convierte en una galaxia que se mueve despacio.',
        ] },
      ] satisfies Section[],
      skip: {
        title: 'Tres cosas que evitar',
        items: [
          { lead: 'Una tem\xe1tica.', rest: 'Marinera, selva, princesa – los peques superan las tem\xe1ticas antes de que se seque la pintura.' },
          { lead: 'Una pantalla a la vista.', rest: 'Incluso un iPad apagado en la mesilla es competencia. Mu\xe9velo.' },
          { lead: 'M\xfasica de fondo con letra.', rest: 'Solo instrumental. La letra pelea con la historia por el mismo canal.' },
        ],
      } satisfies SkipList,
    },
    article6: {
      eyebrow: 'Desarrollo infantil \xb7 6 min de lectura',
      title: 'Por qu\xe9 importa leer en dos idiomas',
      intro: 'Leer a tu peque en dos idiomas es una de las cosas m\xe1s poderosas que puedes hacer por su cerebro, su confianza y su sentido de qui\xe9n es en el mundo.',
      sections: [
        { title: 'Lo que dice la investigaci\xf3n', body: [
          'Los ni\xf1os criados en entornos biling\xfces desarrollan una funci\xf3n ejecutiva m\xe1s fuerte: atenci\xf3n, pensamiento flexible y control de impulsos. Leer en dos idiomas a\xf1ade otra capa: los ni\xf1os que escuchan dos idiomas en la misma historia entienden que una idea puede existir en m\xfaltiples formas. Eso no es confusi\xf3n; es flexibilidad cognitiva.',
        ] },
        { title: 'Cu\xe1ndo empezar', body: [
          'La ventana para la adquisici\xf3n de fonemas empieza a cerrarse alrededor de los siete a\xf1os. No necesitas ser fluido para empezar. Un libro biling\xfce le\xeddo en ambos idiomas, p\xe1gina a p\xe1gina, es suficiente.',
        ] },
        { title: 'Mezclar idiomas es una habilidad, no un error', body: [
          'Si tu peque mezcla idiomas – dice “quiero que el perro entre” en ingl\xe9s – es una se\xf1al de procesamiento ling\xfc\xedstico sofisticado, no de confusi\xf3n. Nunca lo corrijas hacia el monoling\xfcismo.',
        ] },
        { title: 'La lengua materna y la identidad familiar', body: [
          'Para muchas familias, la lengua heredada no es solo comunicaci\xf3n: es un hilo hacia los abuelos, la comida, la m\xfasica, un lugar. Cuando Eva escribe una historia biling\xfce, piensa en la abuela leyendo en espa\xf1ol mientras su nieto sigue en ingl\xe9s.',
        ] },
        { title: 'Un primer paso pr\xe1ctico', body: [
          'Elige un libro biling\xfce y comp\xf3mprometete a leerlo en ambos idiomas al menos una vez a la semana durante un mes. Empieza con la colecci\xf3n de Eva – cada historia est\xe1 dise\xf1ada para que los dos idiomas se sientan igualmente en casa en la p\xe1gina.',
        ] },
      ] satisfies Section[],
    },
  },
  fr: {
    article1: {
      eyebrow: 'Conseils de lecture \xb7 5 min de lecture',
      title: '10 fa\xe7ons de rendre le temps de lecture magique',
      intro: 'Transformez les s\xe9ances de lecture ordinaires en aventures inoubliables que votre enfant attendra avec impatience chaque jour.',
      sections: [
        { title: '1. Pr\xe9parez l’ambiance – la lumi\xe8re compte plus que vous ne le pensez', body: [
          'La lecture du soir change quand la lumi\xe8re du plafond s’\xe9teint et qu’une lueur douce et chaude entoure le livre. Nous utilisons une lampe pince pour enfants qui \xe9claire juste assez les mots, sans la surcharge d’une suspension. Notre choix\xa0: ',
          { href: AFFILIATE.readingLamp, text: 'cette lampe de chevet \xe0 intensit\xe9 r\xe9glable' },
          '.',
        ] },
        { title: '2. Cr\xe9ez un rythme de lecture, pas une r\xe8gle de lecture', body: [
          'Les enfants r\xe9sistent aux r\xe8gles\xa0; ils adoptent les rituels. Associez la lecture \xe0 quelque chose de sensoriel – une couverture pr\xe9cise, une tisane particuli\xe8re pour vous, la m\xeame playlist en sourdine. Au bout de deux semaines, le signal seul suffit \xe0 leur faire ouvrir un livre.',
        ] },
        { title: '3. Associez l’histoire \xe0 un jeu manuel', body: [
          'Vous lisez une histoire d’animaux\xa0? Sortez les marionnettes \xe0 doigts. De l’espace\xa0? Des fus\xe9es en carton. Apr\xe8s la derni\xe8re page, nous gardons une bo\xeete de ',
          { href: AFFILIATE.storyCubes, text: 'd\xe9s \xe0 histoires' },
          ' sur l’\xe9tag\xe8re. Neuf d\xe9s avec des images au lieu de mots, pour que les enfants inventent la suite ensemble dans la langue qu’ils choisissent ce soir-l\xe0.',
        ] },
        { title: '4. Laissez-les tourner les pages – m\xeame quand ils se trompent', body: [
          'Le contr\xf4le est la porte d’entr\xe9e de l’engagement. Un enfant de trois ans qui tourne deux pages d’un coup a quand m\xeame choisi d’\xeatre l\xe0. Ne corrigez pas. Continuez \xe0 lire.',
        ] },
        { title: '5. Le doublage est autoris\xe9', body: [
          'Si vous n’avez jamais jou\xe9 une grand-m\xe8re sorci\xe8re enrhum\xe9e, c’est le moment. Les enfants vous reciteront vos voix pendant des semaines.',
        ] },
        { title: '6. Lisez le m\xeame livre jusqu’\xe0 n’en plus pouvoir', body: [
          'C’est par la r\xe9p\xe9tition que la fluidit\xe9 se construit. Le livre que vous avez lu 47 fois est celui qui leur apprend le plus. Continuez.',
        ] },
        { title: '7. Glissez une seconde langue, l’air de rien', body: [
          'M\xeame si vous ne parlez pas couramment, remplacez un mot par page. \xab\xa0Look at the perro.\xa0\xbb Puis \xab\xa0The perro is sleeping.\xa0\xbb Les enfants int\xe8grent la deuxi\xe8me langue comme une partie de l’histoire, pas comme une le\xe7on.',
        ] },
        { title: '8. Faites une pause pour pr\xe9dire', body: [
          '\xc0 mi-parcours, demandez\xa0: \xab\xa0\xc0 ton avis, qu’est-ce qui va se passer\xa0?\xa0\xbb Puis reprenez la lecture. Les enfants qui ont d\xe9j\xe0 fait une hypoth\xe8se suivent l’histoire de plus pr\xe8s \xe0 la relecture.',
        ] },
        { title: '9. Am\xe9nagez le coin lecture', body: [
          'Un coin lecture est un vote de confiance – un petit espace qui dit \xab\xa0\xe7a compte ici\xa0\xbb. Commencez avec un ',
          { href: AFFILIATE.floorCushion, text: 'coussin de sol convertible' },
          ' et une ',
          { href: AFFILIATE.bookshelf, text: '\xe9tag\xe8re Montessori frontale' },
          ' pour qu’ils voient les couvertures. C’est toute l’installation.',
        ] },
        { title: '10. Soyez le lecteur que votre enfant voit le plus', body: [
          'Les enfants lisent davantage s’ils vivent avec quelqu’un qui lit. Vingt minutes de vous sur le canap\xe9 avec votre propre livre font plus pour leur lecture que tous les imprimables r\xe9unis.',
        ] },
      ] satisfies Section[],
    },
    article3: {
      eyebrow: 'D\xe9veloppement de l’enfant \xb7 8 min de lecture',
      title: 'Les \xe9tapes de lecture selon l’\xe2ge',
      intro: 'Chaque enfant arrive \xe0 la lecture \xe0 son propre rythme. Conna\xeetre les rep\xe8res de chaque \xe9tape vous aide \xe0 l’accompagner exactement l\xe0 o\xf9 il se trouve.',
      sections: [
        { title: 'De 2 \xe0 3 ans\xa0: le monde est une grande exp\xe9rience sonore', body: [
          '\xc0 cet \xe2ge, les enfants n’apprennent pas \xe0 lire – ils apprennent que les mots signifient des choses. Les livres cartonn\xe9s avec de grandes illustrations claires sont id\xe9aux. La r\xe9p\xe9tition est le moteur\xa0: relire le m\xeame livre une douzaine de fois d’afil\xe9e n’est pas de l’ennui, c’est de la fluidit\xe9 en formation. Les livres bilingues fonctionnent \xe0 merveille \xe0 cet \xe2ge car les jeunes cerveaux ne sont pas encore bloqu\xe9s sur un seul syst\xe8me de sons.',
        ] },
        { title: 'De 4 \xe0 5 ans\xa0: la reconnaissance des structures', body: [
          'Vers quatre ans, les enfants commencent \xe0 remarquer que les lettres correspondent \xe0 des sons. Cherchez des livres avec des phrases r\xe9p\xe9titives que l’enfant peut entonner avec vous. Passer le doigt sous les mots en lisant est l’une des choses les plus puissantes que vous puissiez faire \xe0 ce stade.',
        ] },
        { title: 'De 5 \xe0 6 ans\xa0: le d\xe9codage commence, et l’envie de lire seul aussi', body: [
          'C’est l’ann\xe9e o\xf9 beaucoup d’enfants d\xe9cryptent le code. Les sons des voyelles, les mots outils, la prise de conscience que les marques noires sur la page produisent la m\xeame histoire \xe0 chaque fois\xa0: le d\xe9clic se produit. Votre enfant peut se mettre \xe0 lire les panneaux, les bo\xeetes de c\xe9r\xe9ales, tout. Nourrissez cette faim. Gardez un panier de petits livres faciles pr\xe8s de la table du petit-d\xe9jeuner. Le but n’est pas la perfection mais l’\xe9lan. Les erreurs prouvent que la lecture est en train de se produire.',
        ] },
        { title: 'De 6 \xe0 7 ans\xa0: de la lecture au plaisir de lire', body: [
          '\xc0 pr\xe9sent, la plupart des enfants d\xe9codent formellement \xe0 l’\xe9cole. Ce que vous cultivez \xe0 la maison, c’est quelque chose que l’\xe9cole ne peut pas pleinement atteindre\xa0: l’amour d’une histoire pour elle-m\xeame. Des romans \xe0 chapitres courts, des bandes dessin\xe9es, des journaux illustr\xe9s\xa0: tout ce qui pousse un enfant \xe0 veiller apr\xe8s l’heure du coucher avec une lampe de poche. Laissez-les faire. L’habitude que vous construisez maintenant est celle qui les accompagnera au coll\xe8ge, au lyc\xe9e et au-del\xe0. Les histoires bilingues d’Eva Gallo sont ici des livres ponts parfaits\xa0: assez familiers pour rassurer, assez riches pour faire grandir.',
        ] },
        { title: 'Une note sur les d\xe9lais', body: [
          'Ces fen\xeatres sont des rep\xe8res, pas des bulletins de notes. Ce que vous pouvez toujours faire, \xe0 tout \xe2ge, c’est lire avec votre enfant. C’est la seule chose qui ne rate jamais.',
        ] },
      ] satisfies Section[],
    },
    article4: {
      eyebrow: 'Id\xe9es d’activit\xe9s \xb7 6 min de lecture',
      title: '5 activit\xe9s cr\xe9atives \xe0 faire apr\xe8s la lecture',
      intro: 'La derni\xe8re page n’est pas la fin de l’histoire. Voici cinq fa\xe7ons de poursuivre la conversation, faire bouger l’imagination et enrichir le vocabulaire.',
      sections: [
        { title: '1. Jouez-la', body: [
          'Apr\xe8s l’histoire, invitez votre enfant \xe0 incarner l’un des personnages. Prenez-en un autre vous-m\xeame. Les enfants qui incarnent physiquement un personnage retiennent bien mieux le vocabulaire, la s\xe9quence et le th\xe8me.',
        ] },
        { title: '2. Dessinez la partie qui manquait', body: [
          'Demandez\xa0: \xab\xa0Qu’est-ce qui s’est pass\xe9 juste avant le d\xe9but de l’histoire\xa0?\xa0\xbb et invitez votre enfant \xe0 le dessiner. Cela d\xe9veloppe la pens\xe9e narrative.',
        ] },
        { title: '3. Jouez au \xab\xa0mot du jour\xa0\xbb', body: [
          'Choisissez un mot nouveau du livre et d\xe9fiez votre enfant de l’utiliser trois fois avant le d\xeener. Les mots rencontr\xe9s dans les histoires et ensuite utilis\xe9s dans la vie r\xe9elle s’inscrivent dans la m\xe9moire \xe0 long terme \xe0 des taux bien plus \xe9lev\xe9s.',
        ] },
        { title: '4. Cuisinez ou fabriquez quelque chose de l’histoire', body: [
          'Les personnages ont mang\xe9 quelque chose\xa0? Pr\xe9parez-le ensemble. Gardez des ',
          { href: AFFILIATE.storyCubes, text: 'd\xe9s \xe0 histoires' },
          ' dans la cuisine pour que votre enfant puisse les lancer apr\xe8s la lecture et inventer une nouvelle version.',
        ] },
        { title: '5. R\xe9digez une lettre du personnage', body: [
          'Invitez votre enfant \xe0 \xe9crire une lettre comme s’il \xe9tait le personnage principal. Cet exercice d\xe9veloppe la prise de perspective, la voix narrative et la motivation pour l’\xe9criture, tout \xe0 la fois.',
        ] },
      ] satisfies Section[],
    },
    article5: {
      eyebrow: 'Susciter l’int\xe9r\xeat \xb7 7 min de lecture',
      title: 'Faire aimer la lecture aux lecteurs r\xe9ticents',
      intro: 'Certains enfants aiment les livres d’embl\xe9e. D’autres ont besoin d’une plus longue piste d’envol. Si votre enfant fait partie du deuxi\xe8me groupe, vous ne faites rien de mal.',
      sections: [
        { title: 'Commencez l\xe0 o\xf9 l’int\xe9r\xeat existe d\xe9j\xe0', body: [
          'Si votre enfant adore les camions, les dinosaures ou les super-h\xe9ros, il existe un livre pour \xe7a. Le contenu du livre importe bien moins que l’acte de le choisir, de le tenir et d’y revenir. Suivez ce fil vers les livres.',
        ] },
        { title: 'Rendez-le actif, pas passif', body: [
          'Certains enfants r\xe9sistent \xe0 rester assis avec un livre, mais suivent volontiers l’histoire en dessinant ou en construisant. Les livres audio et les pistes audio bilingues comme celles des histoires d’Eva peuvent \xeatre la porte d’entr\xe9e.',
        ] },
        { title: 'Laissez-les choisir, m\xeame si le choix vous surprend', body: [
          'Un enfant qui choisit une BD, un livre de blagues ou un roman graphique choisit de lire. L’engagement est l’apprentissage. Ces comp\xe9tences se transfèrent.',
        ] },
        { title: 'Lisez \xe0 voix haute plus longtemps que vous ne le pensez n\xe9cessaire', body: [
          'Entendre un lecteur fluide mod\xe9liser l’expression et le rythme – surtout dans une deuxi\xe8me langue – est quelque chose qu’un lecteur d\xe9butant ne peut pas encore se donner. La relation de lecture \xe0 voix haute compte aussi \xe9motionnellement.',
        ] },
        { title: 'N’utilisez jamais les livres comme punition', body: [
          'Nous voulons que la lecture vive dans la cat\xe9gorie des choses chaleureuses, tranquilles et d\xe9sir\xe9es. La collection Eva Gallo a \xe9t\xe9 con\xe7ue exactement dans cet esprit\xa0: des histoires qui ressemblent \xe0 une invitation, pas \xe0 une t\xe2che.',
        ] },
      ] satisfies Section[],
    },
    article2: {
      eyebrow: 'Conseils de lecture \xb7 4 min de lecture',
      title: 'Cr\xe9er l’environnement de lecture id\xe9al',
      intro: 'Am\xe9nagez un espace qui donne \xe0 votre enfant l’envie de prendre un livre sans qu’on le lui demande. Il ne s’agit pas de chambres parfaites pour Pinterest. Il s’agit de trois choix r\xe9fl\xe9chis.',
      choices: [
        { title: 'Choix 1 – Un confort qui dit \xab\xa0reste un moment\xa0\xbb', body: [
          'Oubliez les chaises rigides. Les enfants lisent plus longtemps quand ils sont avachis, sur le c\xf4t\xe9 ou la t\xeate en bas sur quelque chose de doux. Un coussin de sol lavable est la pi\xe8ce ma\xeetresse. Notre choix\xa0: ',
          { href: AFFILIATE.floorCushion, text: 'ce pouf-canap\xe9 3-en-1 pour enfants' },
          '. Lavable en machine, assez grand pour que deux enfants s’y entassent sans guerre de coudes.',
        ] },
        { title: 'Choix 2 – Couvertures, pas dos de livres', body: [
          'Les biblioth\xe8ques classiques cachent les couvertures des albums et transforment la lecture en probl\xe8me de recherche. Une \xe9tag\xe8re Montessori frontale montre quatre \xe0 six livres \xe0 la fois. Faites-les tourner chaque semaine. Notre choix\xa0: ',
          { href: AFFILIATE.bookshelf, text: 'cette \xe9tag\xe8re en bois 4 niveaux, livres de face' },
          '.',
        ] },
        { title: 'Choix 3 – Une lumi\xe8re qui dit \xab\xa0lecture\xa0\xbb', body: [
          'L’\xe9clairage est l’\xe9l\xe9ment le plus sous-estim\xe9. Nous utilisons ',
          { href: AFFILIATE.readingLamp, text: 'une lampe chaude \xe0 intensit\xe9 r\xe9glable' },
          ' que nous n’allumons que pour la lecture. Au bout de quelques semaines, le clic de la lampe devient le signal du coucher.',
        ] },
        { title: 'Choix 4 – Les soirs sp\xe9ciaux, transformez le plafond en ciel', body: [
          'Nous gardons celui-ci pour les livres qui m\xe9ritent une c\xe9r\xe9monie. Branchez ',
          { href: AFFILIATE.galaxyProjector, text: 'un projecteur d’\xe9toiles' },
          ', \xe9teignez les lampes, et le plafond devient une galaxie qui d\xe9rive doucement.',
        ] },
      ] satisfies Section[],
      skip: {
        title: 'Trois choses \xe0 \xe9viter',
        items: [
          { lead: 'Un th\xe8me.', rest: 'Marin, jungle, princesse – les enfants en sortent plus vite que la peinture ne s\xe8che.' },
          { lead: 'Un \xe9cran en vue.', rest: 'M\xeame un iPad \xe9teint sur une commode est un concurrent. D\xe9placez-le.' },
          { lead: 'De la musique avec paroles.', rest: 'Instrumental uniquement. Les paroles se battent avec l’histoire pour le m\xeame canal de traitement.' },
        ],
      } satisfies SkipList,
    },
    article6: {
      eyebrow: 'D\xe9veloppement de l’enfant \xb7 6 min de lecture',
      title: 'Pourquoi la lecture bilingue est importante',
      intro: 'Lire \xe0 votre enfant en deux langues est l’une des choses les plus puissantes que vous puissiez faire pour son cerveau, sa confiance et son sens de qui il est dans le monde.',
      sections: [
        { title: 'Ce que dit la recherche', body: [
          'Les enfants \xe9lev\xe9s dans des environnements bilingues d\xe9veloppent des fonctions ex\xe9cutives plus solides\xa0: attention, pens\xe9e flexible et contr\xf4le des impulsions. Lire en deux langues ajoute une couche\xa0: les enfants qui entendent r\xe9guli\xe8rement deux langues dans la m\xeame histoire comprennent qu’une id\xe9e peut exister sous plusieurs formes. Ce n’est pas de la confusion\xa0; c’est de la flexibilit\xe9 cognitive.',
        ] },
        { title: 'Quand commencer', body: [
          'La fen\xeatre pour l’acquisition des phon\xe8mes commence \xe0 se fermer vers sept ans. Vous n’avez pas besoin d’\xeatre bilingue courant pour commencer. Un livre bilingue lu dans les deux langues, page par page, suffit.',
        ] },
        { title: 'M\xe9langer les langues est une comp\xe9tence, pas une erreur', body: [
          'Si votre enfant m\xe9lange les langues, c’est le signe d’un traitement linguistique sophistiqu\xe9, pas de confusion. Ne corrigez jamais vers le monolinguisme.',
        ] },
        { title: 'La langue h\xe9rit\xe9e et l’identit\xe9 familiale', body: [
          'Pour beaucoup de familles, une langue h\xe9rit\xe9e n’est pas seulement de la communication – c’est un fil vers les grands-parents, la nourriture, la musique, un lieu. Quand Eva \xe9crit une histoire bilingue, elle pense \xe0 la grand-m\xe8re qui lit en espagnol pendant que son petit-enfant suit en anglais.',
        ] },
        { title: 'Un premier pas pratique', body: [
          'Choisissez un livre bilingue et engagez-vous \xe0 le lire dans les deux langues au moins une fois par semaine pendant un mois. Commencez avec la collection d’Eva – chaque histoire est con\xe7ue pour que les deux langues se sentent \xe9galement chez elles sur la page.',
        ] },
      ] satisfies Section[],
    },
  },
} satisfies Record<Language, Record<string, ArticleBody>>;

type ArticleKey = keyof typeof BODIES.en;

/** Registry slug (src/data/resources.ts) -> body key. Every article resource must appear here. */
const KEY_BY_SLUG: Record<string, ArticleKey> = {
  'making-reading-magical': 'article1',
  'perfect-reading-environment': 'article2',
  'age-appropriate-reading': 'article3',
  'follow-up-activities': 'article4',
  'reluctant-readers': 'article5',
  'bilingual-reading': 'article6',
};

export const ARTICLE_BODY_SLUGS: readonly string[] = Object.keys(KEY_BY_SLUG);

/** The guide body for a registry slug in the given language (English fallback); undefined for an unknown slug. */
export function articleBody(slug: string, language: Language): ArticleBody | undefined {
  const key = KEY_BY_SLUG[slug];
  if (!key) return undefined;
  return (BODIES[language] ?? BODIES.en)[key];
}

/** True when any paragraph of the body carries an affiliate link (drives the FTC disclosure). */
export function hasAffiliateLinks(body: ArticleBody): boolean {
  return [...(body.sections ?? []), ...(body.choices ?? [])].some((s) => s.body.some((p) => typeof p !== 'string'));
}
