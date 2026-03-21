'use client';

import { Playlist } from '@/lib/playlists';

interface PlaylistCardProps {
  playlist: Playlist;
  compact?: boolean;
}

export default function PlaylistCard({ playlist, compact = false }: PlaylistCardProps) {
  const openSpotify = () => {
    window.open(playlist.spotifySearchUrl, '_blank');
  };

  if (compact) {
    return (
      <div className="neu-flat p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{playlist.emoji}</span>
            <div>
              <h3 className="text-sm font-bold text-gray-700">{playlist.name}</h3>
              <p className="text-xs text-gray-500">{playlist.description}</p>
            </div>
          </div>
          <button
            onClick={openSpotify}
            className="neu-btn-accent text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Play
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="neu-flat p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{playlist.emoji}</span>
            <h3 className="text-lg font-bold text-gray-700">{playlist.name}</h3>
          </div>
          <p className="text-sm text-gray-500">{playlist.description}</p>
        </div>
        <button
          onClick={openSpotify}
          className="neu-btn-accent text-sm py-2 px-4 flex items-center gap-2 shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Open Spotify
        </button>
      </div>

      <div className="space-y-1.5">
        {playlist.tracks.map((track, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#d8dce4] transition-colors"
          >
            <span className="text-xs text-gray-400 w-5 text-right font-mono">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{track.title}</p>
              <p className="text-xs text-gray-500 truncate">{track.artist}</p>
            </div>
            <span className="neu-badge text-[10px]">{track.genre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
