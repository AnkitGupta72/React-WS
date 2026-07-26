import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AppNavbar } from './components/AppNavbar';
import { UserProvider } from './context/UserContext';
import { HomePage } from './pages/HomePage';
import { ListPage } from './pages/ListPage';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/todo" element={<ListPage kind="todo" />} />
          <Route path="/travel" element={<ListPage kind="travel" />} />
          <Route path="/shopping" element={<ListPage kind="shopping" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
