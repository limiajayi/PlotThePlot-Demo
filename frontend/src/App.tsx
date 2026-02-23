import ProfilePage from "./components/pages/ProfilePage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import AuthProvider from "./context/AuthProvider";
import LoginPage from "./components/pages/LoginPage";
import SignUpPage from "./components/pages/SignUpPage";
import ProtectedRoute from "./components/pages/ProtectedRoute";

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to={`/users/${user.id}/profile`} replace />;
  return <>{children}</>;
}

const App = () => {
  return (
      <div>
        <BrowserRouter>
          <AuthProvider>
            <Routes>

              {/* Public routes - redirect to profile if already logged in */}
              <Route 
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />

              <Route 
                path="/signup"
                element={
                  <PublicOnlyRoute>
                    <SignUpPage />
                  </PublicOnlyRoute>
                }
              />

              {/* Protected routes - redirect to login if not authenticated */}
              <Route 
              path="/users/:userId/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
              
              />

              {/* Catch-all: send unknown routes to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
              
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
  )
}

export default App