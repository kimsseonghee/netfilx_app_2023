import useOnClickOutside from 'hook/useOnClickOutside';
import React, { useEffect, useRef, useState } from 'react';
import 'styles/MovieModal.css';
import PropTypes from 'prop-types';

const API_KEY = process.env.REACT_APP_MOVIE_DB_API_KEY;

function MovieModal({ setModalOpen, id, media_type, backdrop_path, overview, release_date, first_air_date, title, name, vote_average }) {
  const ref = useRef();
  const [images, setImages] = useState([]);
  
  useOnClickOutside(ref,()=>{setModalOpen(false)});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/${media_type}/${id}/images?api_key=${API_KEY}`);
      const data = await response.json();
      setImages(data.backdrops.slice(0, 7)); 
    };

    fetchData();
  }, [id, media_type]);

  MovieModal.propTypes = {
    setModalOpen: PropTypes.func.isRequired,
    backdrop_path: PropTypes.string,
    overview: PropTypes.string,
    release_date: PropTypes.string,
    first_air_date: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    vote_average: PropTypes.number,
  };
  
  return (
    <div className='presentation'>
      <div className='wrapper-modal'>
        <div className='modal' ref={ref}>
          <span
          className="modal-close"
          onClick={() => setModalOpen(false)}
          role="button"
          tabIndex="0"
          aria-label="Close"
          onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setModalOpen(false);
          }
          }}
          >
          X
          </span>

          <img className='modal__poster-img' alt='' src={`https://image.tmdb.org/t/p/original/${backdrop_path}`} />

          <div className="additional-images">
            {images.map((image, index) => (
              <img
                key={index}
                className="additional-image"
                src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                alt={`${title ? title : name} - Additional Image ${index + 1}`}
              />
            ))}
          </div>

          <div className='modal__content'>
            <p className='modal__details'>
              <span className='modal__user_perc'>100% for you</span>{` `}
              {release_date ? release_date : first_air_date}
            </p>
            <h2 className='modal__title'>{title ? title : name}</h2>
            <p className='modal__details'>평점: {vote_average}</p>
            <p className='modal__overview'>{overview}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal