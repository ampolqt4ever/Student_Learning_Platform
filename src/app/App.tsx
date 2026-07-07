import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

type Screen = 'landing' | 'login' | 'dashboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [currentUser, setCurrentUser] = useState<{ username: string; role: 'admin' | 'student' } | null>(null);

  const handleLogin = (username: string, role: 'admin' | 'student') => {
    setCurrentUser({ username, role });
    setScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('landing');
  };

  if (screen === 'landing') {
    return (
      <LandingPage
        onLogin={() => setScreen('login')}
        onRegister={() => setScreen('login')}
      />
    );
  }

  if (screen === 'login' || !currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBack={() => setScreen('landing')}
      />
    );
  }

  return (
    <Dashboard
      username={currentUser.username}
      role={currentUser.role}
      onLogout={handleLogout}
    />
  );
}
