import { useState, useEffect } from 'react';
import { getUserPlaylists, getPlaylistTracks } from '../services/spotifyApi';
import { Track } from '../App';
import './Playlists.css';

interface PlaylistData {
  id: string;
  name: string;
  images?: { url: string }[];
  tracks: { total: number };
}

interface PlaylistsProps {
  token: string;
  onTrackSelect: (track: Track) => void;
}

function Playlists({ token, onTrackSelect }: PlaylistsProps) {
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUserPlaylists(token)
      .then(data => {
        setPlaylists(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load playlists:', err);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (!selectedPlaylist) return;

    setLoading(true);
    getPlaylistTracks(token, selectedPlaylist.id)
      .then(data => {
        setPlaylistTracks(data.items?.map((item: any) => item.track) || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load playlist tracks:', err);
        setLoading(false);
      });
  }, [selectedPlaylist, token]);

  return (
    <div className="playlists-container">
      {!selectedPlaylist ? (
        <div className="playlists-grid">
          {loading && <p>Loading playlists...</p>}
          {playlists.map(playlist => (
            <div 
              key={playlist.id} 
              className="playlist-card"
              onClick={() => setSelectedPlaylist(playlist)}
            >
              {playlist.images?.[0] && (
                <img src={playlist.images[0].url} alt={playlist.name} className="playlist-image" />
              )}
              <h3>{playlist.name}</h3>
              <p>{playlist.tracks.total} tracks</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="playlist-detail">
          <button className="back-btn" onClick={() => setSelectedPlaylist(null)}>
            ← Back to Playlists
          </button>
          <h2>{selectedPlaylist.name}</h2>
          <div className="playlist-tracks">
            {loading && <p>Loading tracks...</p>}
            {playlistTracks.map(track => (
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
      )}
    </div>
  );
}

export default Playlists;
