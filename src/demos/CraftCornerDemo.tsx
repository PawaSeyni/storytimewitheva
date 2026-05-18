import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, Lightbulb } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Step = { title: string; desc: string };
type Craft = {
  emoji: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  materials: string[];
  steps: Step[];
  tips: string[];
  ideas: string[];
  safetyRules?: string[];
};

const CRAFTS: Record<string, Craft> = {
  mask: {
    emoji: '🎭',
    title: 'Character Masks',
    description: 'Make masks of your favorite story characters',
    difficulty: 'easy',
    materials: [
      'Paper plates or cardstock',
      'Markers or crayons',
      'Scissors',
      'Glue or tape',
      'Elastic string or stick',
      'Decorations (glitter, stickers)',
    ],
    steps: [
      { title: 'Choose Your Character', desc: 'Pick a character from your favorite story. Animals (fox, bear, lion), fantasy creatures (dragon, fairy), or people (princess, knight, pirate).' },
      { title: 'Create the Base', desc: 'Use a paper plate as your mask base. Hold it up to your face and mark where your eyes should go. Ask an adult to help cut out the eye holes.' },
      { title: 'Add Features', desc: 'Draw or glue on features like ears, nose, whiskers, or horns. Use construction paper for different colored parts.' },
      { title: 'Color and Decorate', desc: 'Color with markers, paint, or crayons. Add details like spots, stripes, or sparkles. Use glitter glue for magical characters.' },
      { title: 'Attach the Holder', desc: 'Poke holes on each side of the mask and tie elastic string through them, or tape a popsicle stick to one side as a handle.' },
    ],
    tips: [
      'Make it reversible! Decorate both sides for two characters',
      'Add feathers, yarn, or fabric scraps for texture',
      'Use aluminum foil for shiny knight or robot masks',
      'Make a whole set for story time performances',
    ],
    ideas: ['🦊', '🦁', '🐉', '🦉', '🐻', '🐱'],
  },
  puppet: {
    emoji: '🧦',
    title: 'Story Puppets',
    description: 'Create puppets to act out stories',
    difficulty: 'easy',
    materials: ['Paper bags or socks', 'Construction paper', 'Googly eyes', 'Markers', 'Glue', 'Yarn or fabric scraps'],
    steps: [
      { title: 'Choose Your Base', desc: 'Pick a paper lunch bag or clean sock. Paper bags work great for animal mouths that open and close. Socks are perfect for long creatures like snakes or dragons!' },
      { title: 'Add the Face', desc: 'For paper bags: the fold at the bottom becomes the mouth. For socks: the toe becomes the mouth.' },
      { title: 'Create Features', desc: 'Cut ears, horns, or wings from construction paper and glue them on. Add yarn for hair or a mane.' },
      { title: 'Add Details', desc: 'Draw or glue on spots, stripes, scales, or feathers. Add whiskers with pipe cleaners. Use buttons for details.' },
      { title: 'Practice and Perform', desc: 'Put your hand inside and practice moving the mouth. Make different voices. Put on a puppet show to retell your favorite story!' },
    ],
    tips: [
      'Make multiple characters for a full cast',
      'Create a simple stage from a cardboard box',
      'Record your puppet show to watch later',
      'Invite friends to make puppets and perform together',
    ],
    ideas: ['🐶', '🐸', '👹', '👸', '🤖', '🦕'],
  },
  diorama: {
    emoji: '📦',
    title: 'Story Diorama',
    description: 'Build a 3D scene from your book',
    difficulty: 'medium',
    materials: ['Shoebox', 'Construction paper', 'Small toys or clay', 'Scissors and glue', 'Markers or paint', 'Nature items (twigs, pebbles)'],
    steps: [
      { title: 'Pick Your Scene', desc: 'Choose your favorite scene from a book. Is it in a forest, castle, underwater, or outer space? Think about what makes that place special.' },
      { title: 'Prepare the Box', desc: 'Turn your shoebox on its side so you can see inside. This is your stage! You can cut a window in the lid or leave it open.' },
      { title: 'Create the Background', desc: 'Draw or paint the back wall. Add sky, trees, buildings, or whatever fits your scene.' },
      { title: 'Add the Ground', desc: 'Cover the bottom with paper, sand, cotton (for snow), or grass. Add rocks, sticks, or other natural items.' },
      { title: 'Place Characters and Objects', desc: 'Add characters made from clay, paper cutouts, or small toys. Include important objects from the story.' },
    ],
    tips: [
      'Add cotton clouds hanging from the top',
      'Use aluminum foil for water or ice',
      'Poke holes in the top for "stars" with light shining through',
      'Make it interactive — move characters around to retell the story',
    ],
    ideas: [],
  },
  crown: {
    emoji: '👑',
    title: 'Royal Crown',
    description: 'Make a crown for kings and queens',
    difficulty: 'easy',
    materials: ['Yellow or gold cardstock', 'Scissors', 'Glue or tape', 'Gems, sequins, or glitter', 'Markers', 'Stapler (optional)'],
    steps: [
      { title: 'Cut the Strip', desc: 'Cut a long strip of cardstock about 3 inches tall. Make it long enough to fit around your head (about 22–24 inches).' },
      { title: 'Create the Points', desc: "Along the top edge, cut zigzag points to make the crown's peaks. Make them as tall or short as you like." },
      { title: 'Decorate', desc: 'Glue on plastic gems, sequins, buttons, or draw jewels with markers. Add glitter glue for extra sparkle.' },
      { title: 'Size and Attach', desc: "Wrap the crown around your head to check the fit. Overlap the ends and staple or tape them together. Now you're royalty!" },
    ],
    tips: [
      'Use different colors for different characters (silver for queens, gold for kings)',
      'Add feathers or flowers for a fancy look',
      'Make matching crowns for story time friends',
      'Layer different colored strips for a multi-tiered crown',
    ],
    ideas: [],
  },
  wand: {
    emoji: '🪄',
    title: 'Magic Wand',
    description: 'Craft a magical wand for wizards',
    difficulty: 'easy',
    materials: ['Wooden dowel or pencil', 'Cardstock or foam', 'Ribbon or streamers', 'Glue gun (with adult help)', 'Glitter and paint', 'Star template'],
    steps: [
      { title: 'Prepare the Stick', desc: 'Use a wooden dowel, chopstick, or sturdy cardboard tube. Paint it in magical colors like gold, silver, purple, or rainbow!' },
      { title: 'Create the Star', desc: 'Cut two star shapes from cardstock or foam (front and back). Decorate them with glitter, gems, or markers.' },
      { title: 'Attach the Star', desc: 'With adult help using a glue gun, sandwich the top of your stick between the two star shapes. Hold until secure.' },
      { title: 'Add Ribbons', desc: "Tie colorful ribbons or streamers just below the star. Use 5–6 ribbons about 12 inches long. They'll flutter when you wave your wand!" },
      { title: 'Final Touches', desc: 'Wrap the handle with ribbon or yarn for a better grip. Add extra glitter, stickers, or paint details. Now cast your spells!' },
    ],
    tips: [
      'Make different shapes — hearts, moons, or flowers instead of stars',
      'Add bells to the ribbons for sound effects',
      'Use glow-in-the-dark paint for nighttime magic',
      'Create a matching spell book with construction paper',
    ],
    ideas: [],
  },
  cape: {
    emoji: '🦸',
    title: 'Hero Cape',
    description: 'Design a superhero or wizard cape',
    difficulty: 'medium',
    materials: ['Large piece of fabric or old pillowcase', 'Ribbon for ties', 'Fabric markers or paint', 'Iron-on patches (optional)', 'Scissors', 'Safety pins'],
    steps: [
      { title: 'Choose Your Fabric', desc: 'Use a pillowcase, old t-shirt, or piece of fabric. Red for superheroes, purple for wizards, black for mysterious characters.' },
      { title: 'Cut and Shape', desc: 'If using a pillowcase, cut open the closed end. Round the bottom corners for a classic cape shape, or cut a zigzag edge for drama!' },
      { title: 'Add Tie Strings', desc: 'Attach two pieces of ribbon to the top corners (adult help may be needed). Make them long enough to tie comfortably around your neck.' },
      { title: 'Decorate Your Cape', desc: 'Use fabric markers to draw your logo, initial, or favorite symbol. Add iron-on patches with adult help.' },
      { title: 'Safety Check', desc: "Make sure the cape isn't too long — it should end above your knees so you don't trip. Use breakaway ties or velcro that come apart easily." },
    ],
    tips: [
      'Make it reversible — decorate both sides!',
      'Add sequins or glitter for a sparkly wizard cape',
      'Use glow-in-the-dark paint for night heroes',
      'Create a collar using felt for extra style',
    ],
    safetyRules: [
      'Never wear capes near stairs or while climbing',
      'Remove capes before playing on playground equipment',
      'Make sure ties break away easily — never use permanent attachments',
      'Always have adult supervision when wearing capes',
    ],
    ideas: [],
  },
};

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'bg-green-200 text-green-800',
  medium: 'bg-yellow-200 text-yellow-800',
  hard: 'bg-orange-200 text-orange-800',
};

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export default function CraftCornerDemo() {
  const [selectedCraft, setSelectedCraft] = useState<string | null>(null);
  const craft = selectedCraft ? CRAFTS[selectedCraft] : null;

  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">Eva's Craft Corner</h3>
        <p className="text-gray-700 mb-4">Create amazing crafts to bring your favorite stories to life!</p>
        <div className="text-5xl mb-4">✂️🎨</div>
      </div>

      <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl p-6 mb-6">
        <h4 className="text-2xl font-bold mb-3 text-center">✨ How to Play ✨</h4>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          <li>Choose a craft project from the gallery below</li>
          <li>Read the materials list and gather your supplies</li>
          <li>Follow the step-by-step instructions carefully</li>
          <li>Always ask an adult for help with scissors and glue</li>
          <li>Have fun creating and use your imagination!</li>
        </ol>
      </div>

      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-red-800 block mb-1">⚠️ Safety First!</strong>
            <p className="text-red-700">
              Always ask an adult for help with scissors, glue, and other craft tools. Never use sharp objects without supervision!
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(CRAFTS).map(([key, c]) => (
          <Card
            key={key}
            onClick={() => setSelectedCraft(key)}
            className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-orange-300 p-6 cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="text-6xl mb-4 text-center">{c.emoji}</div>
            <h4 className="text-xl font-bold text-gray-800 mb-2 text-center">{c.title}</h4>
            <p className="text-gray-700 text-center mb-4">{c.description}</p>
            <div className="text-center">
              <span className={`inline-block px-4 py-2 rounded-full font-bold ${DIFFICULTY_COLOR[c.difficulty]}`}>
                {DIFFICULTY_LABEL[c.difficulty]}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {craft && (
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-purple-300 overflow-hidden">
          <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white p-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedCraft(null)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="text-6xl mb-4 text-center">{craft.emoji}</div>
            <h3 className="text-3xl font-bold text-center">{craft.title}</h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white rounded-2xl p-6">
              <h4 className="text-2xl font-bold mb-4">🎨 Materials Needed:</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {craft.materials.map((item, idx) => (
                  <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">📋 Step-by-Step Instructions:</h4>
              <div className="space-y-4">
                {craft.steps.map((step, idx) => (
                  <div key={idx} className="bg-gray-50 border-l-4 border-purple-400 rounded-r-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-pink-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h5 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h5>
                        <p className="text-gray-700 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded-r-xl p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg text-gray-800 mb-3">Pro Tips:</h4>
                  <ul className="space-y-2">
                    {craft.tips.map((tip, idx) => (
                      <li key={idx} className="text-gray-700">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {craft.ideas.length > 0 && (
              <div className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white rounded-2xl p-6">
                <h4 className="text-2xl font-bold mb-4 text-center">Ideas:</h4>
                <div className="grid grid-cols-6 gap-4">
                  {craft.ideas.map((emoji, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 text-5xl text-center hover:scale-110 transition-transform cursor-pointer"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {craft.safetyRules && (
              <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg text-red-800 mb-3">Safety Rules:</h4>
                    <ul className="space-y-2">
                      {craft.safetyRules.map((rule, idx) => (
                        <li key={idx} className="text-red-700">
                          • {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
