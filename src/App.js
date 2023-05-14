import { Outlet, Route, Routes } from 'react-router-dom';
import Footer from "components/Footer";
import Nav from "components/Nav";
import "styles/Home.css";
import "styles/Nav.css";
import MainPage from 'routes/MainPage';
import DetailPage from 'routes/DetailPage';
import SearchPage from 'routes/SearchPage';
import ProfilePage from 'routes/ProfilePage';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Auth from 'routes/Auth';
import './fbase';

const Layout = ({ userObj }) => {
  return (
    <div>
      <Nav userObj={userObj} />
      <Outlet />
      <Footer />
    </div>
  )
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        setUserObj(user);
      } else {
        setAuthenticated(false);
        setUserObj(null);
      }
    });
  }, []);

  return (
    <div className="app">
      {!authenticated ? (
        <Auth />
      ) : (
        <Routes>
          <Route path="/" element={<Layout userObj={userObj} />}>
            <Route index element={<MainPage />} />
            <Route path=":movieId" element={<DetailPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="profile" element={<ProfilePage userObj={userObj} setUserObj={setUserObj} />} />
          </Route>
        </Routes>
      )}
    </div>
  );
}

export default App;

