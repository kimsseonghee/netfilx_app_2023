import axios from 'api/axios';
import React, { useEffect, useState } from 'react'
import "styles/Row.css"
import MovieModal from './MovieModal';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


function Row({isLargeRow, title, id, fetchUrl}) {
  const [movies, setMovies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [movieSelected, setMovieSelected] = useState({});

  useEffect(()=>{
    fetchMovieDate();
  },[fetchUrl])

  // const handleClick = (movie) => {
  //   console.log('movie->',movie)
  //   setModalOpen(true);
  //   setMovieSelected(movie)
  // }

  const fetchMovieDate = async () => {
    const request = await axios.get(fetchUrl);
    console.log('request->',request)
    setMovies(request.data.results);
  }

  const getMediaType = (movie) => {
    if (id === 'NO') {
      return 'tv';
    } else {
      return movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
    }
  };
  

  const handleClick = (movie) => {
    console.log('movie->', movie);
    setModalOpen(true);
    setMovieSelected({
      ...movie,
      media_type: getMediaType(movie),
    });
  };

  return (
    <section className='row' key={id}>
      <h2>{title}</h2>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation //arow btn 사용 유무
        pagination={{ clickable: true }} // 페이지 btn 보이게 할지
        loop={true}
        breakpoints={{
          1378:{
            slidesPerView:6, // 한 번에 보이는 슬라이드 갯수
            slidesPerGroup:6, // 몇 개씩 슬라이드 할지
          },
          998:{
            slidesPerView:5,
            slidesPerGroup:5,            
          },
          625:{
            slidesPerView:4,
            slidesPerGroup:4,            
          },
          0:{
            slidesPerView:3,
            slidesPerGroup:3,            
          },
        }}
      >
      {/* <div className='slider'>
        <div className='slider__arrow left'>
          <span className='arrow'
           onClick={()=>{document.getElementById(id).scrollLeft -= (window.innerWidth - 80)}}>
            {"<"}
          </span>
        </div> */}
        <div id={id} className='row__posters'>
          {movies.map((movie) => (
            <SwiperSlide>
              <img
                key={movie.id}
                onClick={() => handleClick(movie)}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                loading='lazy'
                alt={movie.name || movie.name || movie.original_name}
                />
            </SwiperSlide>
          ))}
        </div>
        {/* <div className='slider__arrow right'>
          <span className='arrow' 
            onClick={()=>{document.getElementById(id).scrollLeft += (window.innerWidth - 80)}}>
            {">"}
          </span>
        </div>        
      </div> */}
      </Swiper>
      {modalOpen && (
        <MovieModal {...movieSelected} setModalOpen={setModalOpen}/>
      )}
    </section>
  )
}

export default Row