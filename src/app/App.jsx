import { useState } from 'react';
import { LandingPage } from './components/LandingPage.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { Dashboard } from './components/Dashboard.jsx';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (username, role) => {
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
