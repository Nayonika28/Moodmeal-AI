const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const moodDatabase = {
  sad: {
    keywords: ["sad", "down", "unhappy", "cry"],
    icon: "🌧️",
    text: "Seems like you're feeling a bit down.",
    food: { title: ["Ice Cream", "Hot Chocolate", "Warm Brownie"], action: "Order Comfort Food" },
    movie: { title: [
      "The Fault in Our Stars (EN) | 96 (TA) | Miracle in Cell No. 7 (KO)",
      "Titanic (EN) | Moonu (TA) | Hope (KO)"
    ], action: "Watch Movie" },
    music: { title: ["Soft Music", "Acoustic Ballads"], action: "Listen on Spotify" }
  },
  depressed: {
    keywords: ["depressed", "dark", "hopeless", "despair"],
    icon: "🌑",
    text: "I hear you. Take it one step at a time.",
    food: { title: ["Dark Chocolate & Tea", "Warm Oatmeal"], action: "Get Comfort Snacks" },
    movie: { title: [
      "Inside Out (EN) | Dear Zindagi (TA) | My Mister (KO)",
      "Good Will Hunting (EN) | Peranbu (TA) | Silenced (KO)"
    ], action: "Watch Healing Movie" },
    music: { title: ["Healing Instrumentals", "Slow Ambient Music"], action: "Listen on Spotify" }
  },
  low: {
    keywords: ["low", "empty", "dull", "meh"],
    icon: "🌥️",
    text: "Feeling a bit low? Let's lift those spirits.",
    food: { title: ["Comfort Soup", "Grilled Cheese", "Fries"], action: "Order Comfort Food" },
    movie: { title: [
      "Amelie (EN) | Charlie (TA) | Reply 1988 (KO)",
      "The Truman Show (EN) | Kaaka Muttai (TA) | Castaway on the Moon (KO)"
    ], action: "Watch Feel-Good Movie" },
    music: { title: ["Acoustic Pop", "Light Indie"], action: "Listen on Spotify" }
  },
  lonely: {
    keywords: ["lonely", "alone", "isolated", "miss", "nobody"],
    icon: "🌌",
    text: "You're not alone. We're here for you.",
    food: { title: ["Warm Noodles", "Spicy Ramen"], action: "Order Noodles" },
    movie: { title: [
      "Her (EN) | Sillu Karuppatti (TA) | Castaway on the Moon (KO)",
      "Lost in Translation (EN) | Kadhalum Kadandhu Pogum (TA) | House of Hummingbird (KO)"
    ], action: "Watch Movie" },
    music: { title: ["Comforting Indie Beats", "Vocal Jazz"], action: "Listen on Spotify" }
  },
  tired: {
    keywords: ["tired", "exhausted", "sleepy", "fatigue", "drained"],
    icon: "🥱",
    text: "You're exhausted. You deserve some rest.",
    food: { title: ["Light Salad", "Fruit Bowl"], action: "Order Light Meal" },
    movie: { title: [
      "The Intern (EN) | Bangalore Days (TA) | Hospital Playlist (KO)",
      "Chef (EN) | Oh My Kadavule (TA) | Little Forest (KO)"
    ], action: "Watch Light Movie" },
    music: { title: ["Lo-Fi Chillhop", "Nature Sounds"], action: "Listen on Spotify" }
  },
  stressed: {
    keywords: ["stressed", "anxious", "work", "busy", "hard", "tense"],
    icon: "🌩️",
    text: "You seem stressed. Take a deep breath.",
    food: { title: ["Healthy Food", "Chamomile Tea"], action: "Get Snacks" },
    movie: { title: [
      "Paddington 2 (EN) | Oh My Kadavule (TA) | Little Forest (KO)",
      "Spirited Away (EN) | Mandela (TA) | Weightlifting Fairy Kim Bok-joo (KO)"
    ], action: "Watch Movie" },
    music: { title: ["Instrumental Music", "Classical Music"], action: "Play Relaxing Audio" }
  },
  overwhelmed: {
    keywords: ["overwhelmed", "overload", "too much", "pressure"],
    icon: "🌪️",
    text: "It's okay to feel overwhelmed. Pause for a moment.",
    food: { title: ["Smoothie Bowl", "Acai Bowl"], action: "Order Smoothie" },
    movie: { title: [
      "The Secret Life of Walter Mitty (EN) | Kanda Naal Mudhal (TA) | Little Forest (KO)",
      "Into the Wild (EN) | Pariyerum Perumal (TA) | Our Beloved Summer (KO)"
    ], action: "Watch Escape Movie" },
    music: { title: ["Ambient Soundscapes", "White Noise"], action: "Listen on Spotify" }
  },
  happy: {
    keywords: ["happy", "great", "awesome", "fantastic", "good", "joy", "love"],
    icon: "☀️",
    text: "You're radiating positive energy!",
    food: { title: ["Pizza", "Burger & Fries", "Tacos"], action: "Order Food" },
    movie: { title: [
      "Superbad (EN) | Panchatanthiram (TA) | Extreme Job (KO)",
      "The Hangover (EN) | Boss Engira Bhaskaran (TA) | Midnight Runners (KO)"
    ], action: "Watch Comedy" },
    music: { title: ["Pop Music", "Upbeat Hits"], action: "Play on Spotify" }
  },
  excited: {
    keywords: ["excited", "thrilled", "hype", "amazing"],
    icon: "✨",
    text: "Your excitement is contagious!",
    food: { title: ["Sushi", "Spicy Wings"], action: "Order Fun Food" },
    movie: { title: [
      "Everything Everywhere All at Once (EN) | Ghilli (TA) | The Host (KO)",
      "Avengers: Endgame (EN) | Mankatha (TA) | Train to Busan (KO)"
    ], action: "Watch Epic Movie" },
    music: { title: ["Upbeat Dance", "Party Anthems"], action: "Play on Spotify" }
  },
  motivated: {
    keywords: ["motivated", "ready", "pumped", "determined", "focus"],
    icon: "🔥",
    text: "You are on fire right now!",
    food: { title: ["Protein Bowl", "Steak", "Energy Drink"], action: "Power Up" },
    movie: { title: [
      "Mad Max (EN) | Vikram (TA) | The Outlaws (KO)",
      "Rocky (EN) | Soorarai Pottru (TA) | Itaewon Class (KO)"
    ], action: "Watch Action Movie" },
    music: { title: ["High Tempo EDM", "Workout Mix"], action: "Play Mix" }
  },
  default: {
    icon: "🤔",
    text: "Just a regular day? Let's make it better.",
    food: { title: ["Your Favorite Burger", "A Clean Salad"], action: "Treat Yourself" },
    movie: { title: [
      "Knives Out (EN) | Ratsasan (TA) | Parasite (KO)",
      "Inception (EN) | Thani Oruvan (TA) | Oldboy (KO)"
    ], action: "Find a Movie" },
    music: { title: ["Today's Top Hits", "Random Mix"], action: "Play Hits" }
  }
};

const detectMood = (text) => {
  const lowerText = text.toLowerCase();
  
  for (const [mood, data] of Object.entries(moodDatabase)) {
    if (mood === 'default') continue;
    
    for (const keyword of data.keywords) {
      if (lowerText.includes(keyword)) {
        return data; // Return the first matching mood
      }
    }
  }
  
  return moodDatabase.default;
};

app.post('/api/analyze', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text area is empty" });
  }

  // Simulate network delay
  setTimeout(() => {
    const rawResult = detectMood(text);
    const result = JSON.parse(JSON.stringify(rawResult));
    
    // Randomize arrays to single strings
    const getRandom = (val) => Array.isArray(val) ? val[Math.floor(Math.random() * val.length)] : val;
    if (result.food) result.food.title = getRandom(result.food.title);
    if (result.music) result.music.title = getRandom(result.music.title);
    if (result.movie) result.movie.title = getRandom(result.movie.title);

    res.json(result);
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
