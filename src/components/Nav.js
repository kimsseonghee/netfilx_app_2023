import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Nav({ userObj }) {
  const [show, setShow] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [userAvatar, setUserAvatar] = useState(userObj.photoURL);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  useEffect(() => {
    setUserAvatar(userObj.photoURL);
  }, [userObj.photoURL]);

  const onChange = (e) => {
    setSearchValue(e.target.value);
    navigate(`/search?q=${e.target.value}`);
  };

  return (
    <nav className={`nav ${show && 'nav__black'}`}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/170px-Netflix_2015_logo.svg.png"
        alt="Netflix logo"
        className="nav__logo"
        onClick={() => {
          window.location.reload();
        }}
      />

      <input
        type="search"
        placeholder="영화를 검색해주세요"
        className="nav__input"
        onChange={onChange}
        value={searchValue}
      />

      <Link to="/profile">
      <img
          src={userAvatar ? userAvatar : "https://occ-0-4796-988.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41"}
          alt="User logged"
          className="nav__avatar"
        />
      </Link>
    </nav>
  );
}

export default Nav;