import { useState, useEffect } from 'react';
import './App.css';
import Player from './components/Player';
import Search from './components/Search';
import Playlists from './components/Playlists';
import { getCurrentUser } from './services/spotifyApi';

export interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  duration_ms: number;
  preview_url: string;
  external_urls: { spotify: string };
}

export interface User {
  id: string;
  display_name: string;
  external_urls: { spotify: string };
  images?: { url: string }[];
}

function App() {
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'playlists' | 'player'>('search');

  useEffect(() => {
    // Get token from URL if redirected from Spotify
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    const savedToken = localStorage.getItem('spotify_token');
    if (savedToken) {
      setToken(savedToken);
    }

    if (code && !token) {
      // In a real app, exchange code for access token on backend
      // For now, just extract from redirect
      localStorage.setItem('spotify_token', code);
      setToken(code);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getCurrentUser(token)
        .then(data => setUser(data))
        .catch(err => console.error('Failed to get user:', err));
    }
  }, [token]);

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setCurrentTrack(null);
    localStorage.removeItem('spotify_token');
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-content">
          <h1>🎵 Masti Music</h1>
          <p>Your Spotify music player for all devices</p>
          <a href={`https://accounts.spotify.com/authorize?client_id=${import.meta.env.VITE_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173')}&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-read-public%20user-library-read`} className="login-btn">
            Login with Spotify
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎵 Masti Music</h1>
        {user && <div className="user-info">{user.display_name}</div>}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="app-content">
        <nav className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔍 Search
          </button>
          <button 
            className={`tab-btn ${activeTab === 'playlists' ? 'active' : ''}`}
            onClick={() => setActiveTab('playlists')}
          >
            📋 Playlists
          </button>
          <button 
            className={`tab-btn ${activeTab === 'player' ? 'active' : ''}`}
            onClick={() => setActiveTab('player')}
          >
            ▶️ Player
          </button>
        </nav>

        <main className="main-content">
          {activeTab === 'search' && (
            <Search token={token} onTrackSelect={track => {
              setCurrentTrack(track);
              setActiveTab('player');
            }} />
          )}
          {activeTab === 'playlists' && (
            <Playlists token={token} onTrackSelect={track => {
              setCurrentTrack(track);
              setActiveTab('player');
            }} />
          )}
          {activeTab === 'player' && (
            <Player 
              track={currentTrack} 
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
