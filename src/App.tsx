import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '@/pages/login/Login';
import Signup from '@/pages/login/Signup';
import Profile from '@/pages/components/Profile';
import UserProfile from './pages/components/Userprofile';
import Layout from './pages/components/Layout';
import { Feed } from './pages/components/Feed';
import ExplorePage from './pages/components/explore';
import Friends from './pages/components/friends';
import Settings from './pages/components/settings';
import SavedPage from './pages/components/Savedpage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/home"
            element={
              <Layout>
                <Feed />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route
            path="/explorepage"
            element={
              <Layout>
                <ExplorePage />
              </Layout>
            }
          />
          <Route
            path="/friends"
            element={
              <Layout>
                <Friends />
              </Layout>
            }
          />
          <Route
            path="/saved"
            element={
              <Layout>
                <SavedPage />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
