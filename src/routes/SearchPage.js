import axios from '../api/axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import "../styles/SearchPage.css"
import useDebounce from 'hook/useDebounce';

function SearchPage({vote_average}) {
  const [searchResults, setSearchResults] = useState([]); // 영화 배열 가져옴
  const navigate = useNavigate();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  console.log('useLocation()->',useLocation())

  let query = useQuery(); // 물음표 뒤 params 값 저장 됨 ex)?q=toy story

  const searchTerm = query.get("q"); // searchTerm 검색어 저장 //
  const debounceSearchTerm = useDebounce(searchTerm,500)
  
  console.log('searchTerm->',searchTerm) // toy story
  console.log('debounceSearchTerm->',debounceSearchTerm)

  useEffect(()=>{
    if(debounceSearchTerm) { // null or 공백이 아닌 경우
      fetchSearchMovie(debounceSearchTerm);
    }
  },[debounceSearchTerm]) // 검색어가 바뀔 때 마다

  const fetchSearchMovie = async(searchTerm) =>{
    try {
      // https://api.themoviedb.org/3/search/movie?&query=Jack+Reacher
      const request = await axios.get(`/search/movie?include_adult=false&query=${searchTerm}`);
      setSearchResults(request.data.results);
    } catch (error) {
      console.log(error);
    }
  }

  const renderSearchResults = () => {
    return searchResults.length > 0 ? (
      <section className='search-container'>
        {searchResults.map(movie => {
          if(movie.backdrop_path !== null && movie.media_type !== "person"){
            const movieImageUrl = "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;
            return(
              <div className='movie'>
                <div className='movie__column-poster' onClick={() => navigate(`/${movie.id}`)}>
                  <img src={movieImageUrl} alt={movie.title} className='movie__poster'/>
                  <div className='search__content'>
                    <h2 className='movie__title'>{movie.title || movie.name}</h2>
                    <p className='modal__details_number'>평점{movie.vote_average}</p>
                    <p className='movie__infom'>{movie.release_date ? movie.release_date : movie.first_air_date}</p>
                  </div>
                </div>
              </div>
              )
          }
        })}
      </section>
    ) : (
      <section className='no-results'>
        <div className='no-results__text'>
          <p>
            찾고자하는 검색어 "{searchTerm}"에 맞는 영화가 없습니다.
          </p>
        </div>
        
      </section>
    );
  }
  return renderSearchResults();
}

export default SearchPage