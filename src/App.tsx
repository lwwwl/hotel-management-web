import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';
import TaskPage from './pages/TaskPage';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { UserProvider } from './contexts/UserContext';
import './App.css';

function App() {
  return (
    <UserProvider>
      <WebSocketProvider>
        <Router basename="/employee">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/chat" replace />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/task" element={<TaskPage />} />
            </Route>
          </Routes>
        </Router>
      </WebSocketProvider>
    </UserProvider>
  );
}

export default App;
