import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './contexts/PlayerContext.jsx';
import { ToastProvider } from './components/ToastHost.jsx';
import { LocalModeBanner } from './components/LocalModeBanner.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { CreateRoomPage } from './pages/CreateRoomPage.jsx';
import { JoinRoomPage } from './pages/JoinRoomPage.jsx';
import { LobbyPage } from './pages/LobbyPage.jsx';
import { GamePage } from './pages/GamePage.jsx';
import { ResultPage } from './pages/ResultPage.jsx';
import { SoloGamePage } from './pages/SoloGamePage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <ToastProvider>
          <LocalModeBanner />
          <div className={''}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateRoomPage />} />
              <Route path="/join" element={<JoinRoomPage />} />
              <Route path="/room/:code" element={<LobbyPage />} />
              <Route path="/room/:code/play" element={<GamePage />} />
              <Route path="/room/:code/result" element={<ResultPage />} />
              <Route path="/solo" element={<SoloGamePage />} />
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center bg-slate-900 text-amber-100">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🧩</div>
                      <div>ไม่พบหน้านี้</div>
                      <a href="/" className="text-amber-300 underline mt-3 inline-block">
                        กลับหน้าแรก
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        </ToastProvider>
      </PlayerProvider>
    </BrowserRouter>
  );
}