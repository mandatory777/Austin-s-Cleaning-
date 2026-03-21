export type MoodCategory = 'energized' | 'calm' | 'motivated' | 'sad' | 'stressed' | 'happy' | 'focused';

export interface PlaylistTrack {
  title: string;
  artist: string;
  genre: string;
}

export interface Playlist {
  name: string;
  mood: MoodCategory;
  emoji: string;
  description: string;
  tracks: PlaylistTrack[];
  spotifySearchUrl: string;
}

const PLAYLISTS: Record<MoodCategory, Playlist> = {
  energized: {
    name: 'High Voltage',
    mood: 'energized',
    emoji: '\u26A1',
    description: 'Keep that energy going with upbeat bangers',
    tracks: [
      { title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Pop' },
      { title: 'Levitating', artist: 'Dua Lipa', genre: 'Pop' },
      { title: 'Uptown Funk', artist: 'Bruno Mars', genre: 'Funk' },
      { title: 'Don\'t Stop Me Now', artist: 'Queen', genre: 'Rock' },
      { title: 'Shake It Off', artist: 'Taylor Swift', genre: 'Pop' },
      { title: 'Good as Hell', artist: 'Lizzo', genre: 'Pop' },
      { title: 'Physical', artist: 'Dua Lipa', genre: 'Pop' },
      { title: 'Dynamite', artist: 'BTS', genre: 'K-Pop' },
      { title: 'Stronger', artist: 'Kanye West', genre: 'Hip-Hop' },
      { title: 'Can\'t Hold Us', artist: 'Macklemore', genre: 'Hip-Hop' },
    ],
    spotifySearchUrl: 'https://open.spotify.com/search/workout%20energy%20playlist',
  },
  calm: {
    name: 'Soft Landing',
    mood: 'calm',
    emoji: '\u{1F33F}',
    description: 'Wind down with soothing melodies',
    tracks: [
      { title: 'Weightless', artist: 'Marconi Union', genre: 'Ambient' },
      { title: 'Claire de Lune', artist: 'Debussy', genre: 'Classical' },
      { title: 'Sunset Lover', artist: 'Petit Biscuit', genre: 'Electronic' },
      { title: 'River Flows In You', artist: 'Yiruma', genre: 'Classical' },
      { title: 'Holocene', artist: 'Bon Iver', genre: 'Indie Folk' },
      { title: 'Bloom', artist: 'The Paper Kites', genre: 'Indie' },
      { title: 'Everything\'s Not Lost', artist: 'Coldplay', genre: 'Alternative' },
      { title: 'Breathe Me', artist: 'Sia', genre: 'Pop' },
      { title: 'Saturn', artist: 'Sleeping at Last', genre: 'Indie' },
      { title: 'Ocean Eyes', artist: 'Billie Eilish', genre: 'Pop' },
    ],
    spotifySearchUrl: 'https://open.spotify.com/search/calm%20relaxing%20playlist',
  },
  motivated: {
    name: 'Beast Mode',
    mood: 'motivated',
    emoji: '\u{1F525}',
    description: 'Fuel your workout with these power tracks',
    tracks: [
      { title: 'Lose Yourself', artist: 'Eminem', genre: 'Hip-Hop' },
      { title: 'Eye of the Tiger', artist: 'Survivor', genre: 'Rock' },
      { title: 'Stronger', artist: 'Kelly Clarkson', genre: 'Pop' },
      { title: 'Power', artist: 'Kanye West', genre: 'Hip-Hop' },
      { title: 'Till I Collapse', artist: 'Eminem', genre: 'Hip-Hop' },
      { title: 'Thunderstruck', artist: 'AC/DC', genre: 'Rock' },
      { title: 'Remember The Name', artist: 'Fort Minor', genre: 'Hip-Hop' },
      { title: 'Centuries', artist: 'Fall Out Boy', genre: 'Rock' },
      { title: 'Run This Town', artist: 'JAY-Z ft. Rihanna', genre: 'Hip-Hop' },
      { title: 'Warriors', artist: 'Imagine Dragons', genre: 'Rock' },
    ],
    spotifySearchUrl: 'https://open.spotify.com/search/workout%20motivation%20playlist',
  },
  sad: {
    name: 'Comfort Blanket',
    mood: 'sad',
    emoji: '\u{1F49C}',
    description: 'It\'s okay to feel. Let the music hold you',
    tracks: [
      { title: 'Someone Like You', artist: 'Adele', genre: 'Pop' },
      { title: 'Fix You', artist: 'Coldplay', genre: 'Alternative' },
      { title: 'Skinny Love', artist: 'Bon Iver', genre: 'Indie Folk' },
      { title: 'The Night We Met', artist: 'Lord Huron', genre: 'Indie' },
      { title: 'Liability', artist: 'Lorde', genre: 'Pop' },
      { title: 'All Too Well', artist: 'Taylor Swift', genre: 'Pop' },
      { title: 'Let It Be', artist: 'The Beatles', genre: 'Rock' },
      { title: 'Everybody Hurts', artist: 'R.E.M.', genre: 'Rock' },
      { title: 'When the Party\'s Over', artist: 'Billie Eilish', genre: 'Pop' },
      { title: 'Lonely', artist: 'Justin Bieber', genre: 'Pop' },
    ],
    spotifySearchUrl: 'https://open.spotify.com/search/comfort%20sad%20playlist',
  },
  stressed: {
    name: 'Stress Relief',
    mood: 'stressed',
    emoji: '\u{1F9D8}',
    description: 'Breathe deep. These sounds will help you decompress',
    tracks: [
      { title: 'Watermark', artist: 'Enya', genre: 'New Age' },
      { title: 'Gymnop\u00e9die No.1', artist: 'Erik Satie', genre: 'Classical' },
      { title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', genre: 'Classical' },
      { title: 'Orinoco Flow', artist: 'Enya', genre: 'New Age' },
      { title: 'Strawberry Swing', artist: 'Coldplay', genre: 'Alternative' },
      { title: 'Electric Feel', artist: 'MGMT', genre: 'Indie' },
      { title: 'Better Days', artist: 'OneRepublic', genre: 'Pop' },
      { title: 'Three Little Birds', artist: 'Bob Marley', genre: 'Reggae' },
      { title: 'Here Comes the Sun', artist: 'The Beatles', genre: 'Rock' },
      { title: 'Put Your Records On', artist: 'Corinne Bailey Rae', genre: 'Soul' },
    ],
    spotifySearchUrl: 'https://open.spotify.com/search/stress%20relief%20playlist',
  },
  happy: {
    name: 'Sunshine Mix',
    mood: 'happy',
    emoji: '\u2600\uFE0F',
    description: 'Match your good vibes with feel-good music',
    tracks: [
      { title: 'Happy', artist: 'Pharrell Williams', genre: 'Pop' },
      { title: 'Walking on Sunshine', artist: 'Katrina & The Waves', genre: 'Pop' },
      { title: 'Good Feeling', artist: 'Flo Rida', genre: 'Pop' },
      { title: 'Best Day of My Life', artist: 'American Authors', genre: 'Indie' },
      { title: 'I Gotta Feeling', artist: 'Black Eyed Peas', genre: 'Pop' },
      { title: 'On Top of the World', artist: 'Imagine Dragons', genre: 'Rock' },
      { title: 'Lovely Day', artist: 'Bill Withers', genre: 'Soul' },
      { title: 'Sunday Best', artist: 'Surfaces', genre: 'Indie Pop' },
      { title: 'Good Life', artist: 'OneRepublic', genre: 'Pop' },
      { title: 'Dancing Queen', artist: 'ABBA', genre: 'Pop' },
    ],
    spotifySearchUrl: 'https://open.spotify.com/search/happy%20feel%20good%20playlist',
  },
  focused: {
    name: 'Deep Focus',
    mood: 'focused',
    emoji: '\u{1F3AF}',
    description: 'Lock in with concentration-boosting sounds',
    tracks: [
      { title: 'Experience', artist: 'Ludovico Einaudi', genre: 'Classical' },
      { title: 'Time', artist: 'Hans Zimmer', genre: 'Soundtrack' },
      { title: 'Intro', artist: 'The xx', genre: 'Indie' },
      { title: 'Clair de Lune', artist: 'Flight Facilities', genre: 'Electronic' },
      { title: 'Midnight City', artist: 'M83', genre: 'Electronic' },
      { title: 'Strobe', artist: 'Deadmau5', genre: 'Electronic' },
      { title: 'Arrival of the Birds', artist: 'The Cinematic Orchestra', genre: 'Soundtrack' },
      { title: 'Comptine d\'un autre \u00e9t\u00e9', artist: 'Yann Tiersen', genre: 'Classical' },
      { title: 'Daylight', artist: 'Joji', genre: 'R&B' },
      { title: 'Flume', artist: 'Bon Iver', genre: 'Indie Folk' },
    ],
    spotifySearchUrl: 'https://open.spotify.com/search/deep%20focus%20playlist',
  },
};

/**
 * Map journal mood ratings to mood categories.
 * energy (1=low, 2=okay, 3=great), mood (1=poor, 2=okay, 3=great)
 */
export function getPlaylistForMood(
  energy: 1 | 2 | 3,
  mood: 1 | 2 | 3
): Playlist {
  if (energy === 3 && mood === 3) return PLAYLISTS.energized;
  if (energy === 3 && mood === 2) return PLAYLISTS.motivated;
  if (energy === 2 && mood === 3) return PLAYLISTS.happy;
  if (energy === 2 && mood === 2) return PLAYLISTS.focused;
  if (energy === 1 && mood === 1) return PLAYLISTS.sad;
  if (energy === 1 && mood === 2) return PLAYLISTS.stressed;
  if (energy === 1 && mood === 3) return PLAYLISTS.calm;
  if (energy === 2 && mood === 1) return PLAYLISTS.stressed;
  if (energy === 3 && mood === 1) return PLAYLISTS.motivated;
  return PLAYLISTS.calm;
}

export function getPlaylistByMoodCategory(mood: MoodCategory): Playlist {
  return PLAYLISTS[mood];
}

export function getAllMoodCategories(): MoodCategory[] {
  return Object.keys(PLAYLISTS) as MoodCategory[];
}

export function getPlaylistForWorkout(intensity: 'light' | 'moderate' | 'hard'): Playlist {
  if (intensity === 'hard') return PLAYLISTS.motivated;
  if (intensity === 'moderate') return PLAYLISTS.energized;
  return PLAYLISTS.focused;
}

export function getPlaylistForRecovery(score: number): Playlist {
  if (score >= 80) return PLAYLISTS.energized;
  if (score >= 60) return PLAYLISTS.happy;
  if (score >= 40) return PLAYLISTS.calm;
  return PLAYLISTS.stressed;
}
