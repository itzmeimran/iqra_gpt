import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { ChatPage } from '../pages/ChatPage';

export const AppRouter = () => (
  <Routes>
    <Route element={<GuestRoute />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route path="/chat" element={<ChatPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/chat" replace />} />
  </Routes>
);
