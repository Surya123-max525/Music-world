import { useState, useEffect } from 'react';
import { searchTracks } from '../services/spotifyApi';
import { Track } from '../App';
import './Search.css';

interface SearchProps {
  token: string;
  onTrackSelect: (track: Track) => void;
}

function Search({ token, onTrackSelect }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      searchTracks(token, query)
        .then(data => {
          setResults(data.tracks?.items || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Search error:', err);
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [query, token]);

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search for songs, artists..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="search-input"
        />
        {loading && <div className="loading">Searching...</div>}
      </div>

      <div className="search-results">
        {results.length === 0 && query && !loading && (
          <p className="no-results">No tracks found</p>
        )}
        {results.map(track => (
          <div key={track.id} className="track-item" onClick={() => onTrackSelect(track)}>
            {track.album.images[0] && (
              <img src={track.album.images[0].url} alt={track.name} className="track-thumbnail" />
            )}
            <div className="track-details">
              <h3>{track.name}</h3>
              <p className="track-artist">{track.artists.map(a => a.name).join(', ')}</p>
            </div>
            <span className="play-icon">▶</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
