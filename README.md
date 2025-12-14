# 🎮 Kids Speech & Comprehension Helper

An interactive web app with 4 mini-games designed to help children ages 4-8 improve their speech and reading comprehension skills.

![Auth Screen](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Auth-green) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## ✨ Features

| Feature                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| 🎤 **Word Sound Match** | Speech recognition for pronunciation practice     |
| 📖 **Picture Story**    | Reading comprehension through illustrated stories |
| 🎵 **Rhyme Time**       | Phonics game to match rhyming words               |
| 👂 **Listen & Choose**  | Listening comprehension with text-to-speech       |
| 🏆 **Leaderboard**      | Global rankings by stars earned                   |
| 📊 **Stats Modal**      | Track accuracy and achievements                   |
| 🔊 **Sound Effects**    | Audio feedback for correct/wrong answers          |
| ☁️ **Cloud Sync**       | Progress saved across devices via Supabase        |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### Installation

```bash
# Clone the repo
git clone https://github.com/Crimson-Abyss/Speech-and-Comprehension-Helper.git
cd Speech-and-Comprehension-Helper

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Database Setup

1. Create a new Supabase project
2. Go to **SQL Editor** → **New Query**
3. Copy/paste the contents of `supabase/schema.sql`
4. Run the query

### Environment Variables

Create `.env.local` with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in Chrome (best speech recognition support).

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State**: Zustand (with localStorage persistence)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **APIs**: Web Speech API, Web Audio API

## 📁 Project Structure

```
src/
├── components/     # UI components (HomeScreen, AuthScreen, etc.)
├── contexts/       # React contexts (AuthContext)
├── games/          # Game components (WordSoundMatch, etc.)
├── hooks/          # Custom hooks (useSound, useDatabase)
├── lib/            # Supabase client
├── store/          # Zustand state management
└── data/           # Game data (words, stories, rhymes)
```

## 🚢 Deploy to Vercel

1. Push to GitHub (already done!)
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select this repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## 📝 License

MIT

---

Made with ❤️ for kids learning to read and speak
