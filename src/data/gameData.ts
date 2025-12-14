// Word categories for games
export interface Word {
  word: string;
  emoji: string;
  category: string;
  rhymes?: string[];
}

export const words: Word[] = [
  // Animals
  { word: 'cat', emoji: '🐱', category: 'animals', rhymes: ['hat', 'bat', 'mat'] },
  { word: 'dog', emoji: '🐕', category: 'animals', rhymes: ['frog', 'log', 'fog'] },
  { word: 'bird', emoji: '🐦', category: 'animals', rhymes: ['word', 'heard'] },
  { word: 'fish', emoji: '🐟', category: 'animals', rhymes: ['dish', 'wish'] },
  { word: 'bee', emoji: '🐝', category: 'animals', rhymes: ['tree', 'see', 'key'] },
  { word: 'frog', emoji: '🐸', category: 'animals', rhymes: ['dog', 'log', 'fog'] },
  { word: 'duck', emoji: '🦆', category: 'animals', rhymes: ['truck', 'luck'] },
  { word: 'bear', emoji: '🐻', category: 'animals', rhymes: ['hair', 'chair', 'fair'] },
  { word: 'lion', emoji: '🦁', category: 'animals' },
  { word: 'elephant', emoji: '🐘', category: 'animals' },
  
  // Colors
  { word: 'red', emoji: '🔴', category: 'colors', rhymes: ['bed', 'head', 'said'] },
  { word: 'blue', emoji: '🔵', category: 'colors', rhymes: ['shoe', 'new', 'two'] },
  { word: 'green', emoji: '🟢', category: 'colors', rhymes: ['bean', 'clean', 'mean'] },
  { word: 'yellow', emoji: '🟡', category: 'colors' },
  { word: 'pink', emoji: '🩷', category: 'colors', rhymes: ['think', 'drink', 'sink'] },
  
  // Food
  { word: 'apple', emoji: '🍎', category: 'food' },
  { word: 'banana', emoji: '🍌', category: 'food' },
  { word: 'cake', emoji: '🎂', category: 'food', rhymes: ['bake', 'lake', 'make'] },
  { word: 'cookie', emoji: '🍪', category: 'food' },
  { word: 'pizza', emoji: '🍕', category: 'food' },
  { word: 'ice cream', emoji: '🍦', category: 'food' },
  
  // Objects
  { word: 'ball', emoji: '⚽', category: 'objects', rhymes: ['tall', 'wall', 'call'] },
  { word: 'book', emoji: '📚', category: 'objects', rhymes: ['look', 'cook', 'hook'] },
  { word: 'star', emoji: '⭐', category: 'objects', rhymes: ['car', 'far', 'jar'] },
  { word: 'sun', emoji: '☀️', category: 'objects', rhymes: ['fun', 'run', 'one'] },
  { word: 'moon', emoji: '🌙', category: 'objects', rhymes: ['soon', 'spoon', 'tune'] },
  { word: 'house', emoji: '🏠', category: 'objects', rhymes: ['mouse'] },
  { word: 'tree', emoji: '🌳', category: 'objects', rhymes: ['bee', 'see', 'key'] },
  { word: 'car', emoji: '🚗', category: 'objects', rhymes: ['star', 'far', 'jar'] },
  
  // Actions
  { word: 'run', emoji: '🏃', category: 'actions', rhymes: ['sun', 'fun', 'one'] },
  { word: 'jump', emoji: '🦘', category: 'actions', rhymes: ['bump', 'pump'] },
  { word: 'sing', emoji: '🎤', category: 'actions', rhymes: ['ring', 'king', 'thing'] },
  { word: 'sleep', emoji: '😴', category: 'actions', rhymes: ['deep', 'keep', 'sheep'] },
];

// Stories for comprehension game
export interface Story {
  id: string;
  title: string;
  emoji: string;
  paragraphs: string[];
  questions: {
    question: string;
    options: { text: string; emoji: string }[];
    correctIndex: number;
  }[];
}

export const stories: Story[] = [
  {
    id: 'sunny-day',
    title: 'A Sunny Day',
    emoji: '☀️',
    paragraphs: [
      "It was a beautiful sunny day. 🌞",
      "Tom and his dog Max went to the park. 🐕",
      "They played with a red ball. ⚽",
      "Max loved to catch the ball! 🎉",
      "After playing, they ate ice cream. 🍦"
    ],
    questions: [
      {
        question: "What was the weather like?",
        options: [
          { text: "Rainy", emoji: "🌧️" },
          { text: "Sunny", emoji: "☀️" },
          { text: "Snowy", emoji: "❄️" }
        ],
        correctIndex: 1
      },
      {
        question: "What is the dog's name?",
        options: [
          { text: "Max", emoji: "🐕" },
          { text: "Buddy", emoji: "🐶" },
          { text: "Rex", emoji: "🦮" }
        ],
        correctIndex: 0
      },
      {
        question: "What color was the ball?",
        options: [
          { text: "Blue", emoji: "🔵" },
          { text: "Green", emoji: "🟢" },
          { text: "Red", emoji: "🔴" }
        ],
        correctIndex: 2
      }
    ]
  },
  {
    id: 'hungry-cat',
    title: 'The Hungry Cat',
    emoji: '🐱',
    paragraphs: [
      "Luna the cat was very hungry. 🐱",
      "She looked everywhere for food. 👀",
      "Luna found a big fish! 🐟",
      "She ate the fish and was happy. 😸",
      "Then Luna took a long nap. 😴"
    ],
    questions: [
      {
        question: "What is the cat's name?",
        options: [
          { text: "Whiskers", emoji: "🐱" },
          { text: "Luna", emoji: "🌙" },
          { text: "Mittens", emoji: "🧤" }
        ],
        correctIndex: 1
      },
      {
        question: "What did Luna find?",
        options: [
          { text: "A mouse", emoji: "🐭" },
          { text: "A bird", emoji: "🐦" },
          { text: "A fish", emoji: "🐟" }
        ],
        correctIndex: 2
      },
      {
        question: "What did Luna do after eating?",
        options: [
          { text: "Played", emoji: "🎮" },
          { text: "Took a nap", emoji: "😴" },
          { text: "Ran away", emoji: "🏃" }
        ],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'birthday-party',
    title: 'The Birthday Party',
    emoji: '🎂',
    paragraphs: [
      "Today is Emma's birthday! 🎉",
      "She is turning five years old. 🖐️",
      "Her friends brought colorful balloons. 🎈",
      "They ate a big chocolate cake. 🎂",
      "Emma got a new teddy bear! 🧸"
    ],
    questions: [
      {
        question: "How old is Emma turning?",
        options: [
          { text: "Four", emoji: "4️⃣" },
          { text: "Five", emoji: "5️⃣" },
          { text: "Six", emoji: "6️⃣" }
        ],
        correctIndex: 1
      },
      {
        question: "What did her friends bring?",
        options: [
          { text: "Flowers", emoji: "🌸" },
          { text: "Balloons", emoji: "🎈" },
          { text: "Books", emoji: "📚" }
        ],
        correctIndex: 1
      },
      {
        question: "What gift did Emma get?",
        options: [
          { text: "A doll", emoji: "🪆" },
          { text: "A teddy bear", emoji: "🧸" },
          { text: "A bike", emoji: "🚲" }
        ],
        correctIndex: 1
      }
    ]
  }
];

// Rhyme sets for rhyme game
export interface RhymeSet {
  targetWord: string;
  targetEmoji: string;
  options: { word: string; emoji: string; isRhyme: boolean }[];
}

export const rhymeSets: RhymeSet[] = [
  {
    targetWord: 'cat',
    targetEmoji: '🐱',
    options: [
      { word: 'hat', emoji: '🎩', isRhyme: true },
      { word: 'dog', emoji: '🐕', isRhyme: false },
      { word: 'bat', emoji: '🦇', isRhyme: true },
      { word: 'fish', emoji: '🐟', isRhyme: false }
    ]
  },
  {
    targetWord: 'bee',
    targetEmoji: '🐝',
    options: [
      { word: 'tree', emoji: '🌳', isRhyme: true },
      { word: 'ball', emoji: '⚽', isRhyme: false },
      { word: 'key', emoji: '🔑', isRhyme: true },
      { word: 'car', emoji: '🚗', isRhyme: false }
    ]
  },
  {
    targetWord: 'sun',
    targetEmoji: '☀️',
    options: [
      { word: 'run', emoji: '🏃', isRhyme: true },
      { word: 'moon', emoji: '🌙', isRhyme: false },
      { word: 'fun', emoji: '🎉', isRhyme: true },
      { word: 'star', emoji: '⭐', isRhyme: false }
    ]
  },
  {
    targetWord: 'cake',
    targetEmoji: '🎂',
    options: [
      { word: 'lake', emoji: '🏞️', isRhyme: true },
      { word: 'cookie', emoji: '🍪', isRhyme: false },
      { word: 'bake', emoji: '👨‍🍳', isRhyme: true },
      { word: 'pie', emoji: '🥧', isRhyme: false }
    ]
  },
  {
    targetWord: 'star',
    targetEmoji: '⭐',
    options: [
      { word: 'car', emoji: '🚗', isRhyme: true },
      { word: 'moon', emoji: '🌙', isRhyme: false },
      { word: 'jar', emoji: '🫙', isRhyme: true },
      { word: 'sun', emoji: '☀️', isRhyme: false }
    ]
  },
  {
    targetWord: 'ball',
    targetEmoji: '⚽',
    options: [
      { word: 'wall', emoji: '🧱', isRhyme: true },
      { word: 'bat', emoji: '🏏', isRhyme: false },
      { word: 'tall', emoji: '📏', isRhyme: true },
      { word: 'kick', emoji: '🦵', isRhyme: false }
    ]
  },
  {
    targetWord: 'house',
    targetEmoji: '🏠',
    options: [
      { word: 'mouse', emoji: '🐭', isRhyme: true },
      { word: 'door', emoji: '🚪', isRhyme: false },
      { word: 'cat', emoji: '🐱', isRhyme: false },
      { word: 'window', emoji: '🪟', isRhyme: false }
    ]
  },
  {
    targetWord: 'ring',
    targetEmoji: '💍',
    options: [
      { word: 'sing', emoji: '🎤', isRhyme: true },
      { word: 'bell', emoji: '🔔', isRhyme: false },
      { word: 'king', emoji: '👑', isRhyme: true },
      { word: 'crown', emoji: '👸', isRhyme: false }
    ]
  }
];

// Avatar options for player profile
export const avatars = ['🦁', '🐰', '🐼', '🦊', '🐸', '🦋', '🐝', '🦄', '🐯', '🐨', '🐻', '🐶'];
