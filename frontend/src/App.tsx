import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PrivateRoute } from './guards/PrivateRoute';
import { AdminRoute } from './guards/AdminRoute';
import { HomePage } from './pages/HomePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { EditPostPage } from './pages/EditPostPage';
import { AdminPage } from './pages/AdminPage';
import { MyPostsPage } from './pages/MyPostsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/create" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
            <Route path="/posts/:id/edit" element={<PrivateRoute><EditPostPage /></PrivateRoute>} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-posts" element={<PrivateRoute><MyPostsPage /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
