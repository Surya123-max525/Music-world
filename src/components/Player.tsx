import type { Track } from '../App';
import './Player.css';

interface PlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
}

function Player({ track, isPlaying, onPlayPause }: PlayerProps) {
  if (!track) {
    return (
      <div className="player">
        <div className="player-empty">
          <p>Select a track to play</p>
        </div>
      </div>
    );
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="player">
      <div className="player-now-playing">
        {track.album.images[0] && (
          <img src={track.album.images[0].url} alt={track.name} className="album-art" />
        )}
        <div className="track-info">
          <h2>{track.name}</h2>
          <p className="artist">{track.artists.map(a => a.name).join(', ')}</p>
          <p className="duration">{formatDuration(track.duration_ms)}</p>
        </div>
      </div>

      <div className="player-controls">
        <button className="control-btn" onClick={onPlayPause}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        {track.preview_url && (
          <audio 
            src={track.preview_url} 
            autoPlay={isPlaying}
            onPlay={() => !isPlaying && document.querySelector('audio')?.pause()}
          />
        )}
      </div>

      <div className="player-links">
        <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="spotify-link">
          Open in Spotify →
        </a>
      </div>
    </div>
  );
}

export default Player;
