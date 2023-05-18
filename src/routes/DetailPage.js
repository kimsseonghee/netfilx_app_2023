import axios from 'api/axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

function DetailPage() {
  const [movie, setMovie] = useState({});
  const [genres, setGenres] = useState([]);
  const [video, setVideo] = useState(null);

  let {movieId} = useParams();

  console.log("movieId->",movieId)

  useEffect(() => {
    fetchData();
  }, [movieId]);

  const fetchData = async () => {
    try {
      const [movieRequest, videoRequest] = await Promise.all([axios.get(`/movie/${movieId}`),axios.get(`/movie/${movieId}/videos?language=ko-KR`)]);
      setMovie(movieRequest.data);
      setGenres(movieRequest.data.genres);
      setVideo(videoRequest.data.results[0]);
    } catch (error) {
      console.log(error);
    }
  };

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  
  if (!movie) return <div>...loading</div>;

  return (
    <Container>
      <Backdrop
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
        }}
      >
        <MovieInfo>
          <Title>{movie.title || movie.name || movie.original_name}</Title>
          <Detail>
            <div>
              <Label className='blind'>Release Date:</Label>
              <Value>{movie.release_date}</Value>
            </div>
            <div>
              <Label className='blind'>Runtime:</Label>
              <Value>{`${movie.runtime} 분`}</Value>
            </div>
            <div>
              <Label className='blind'>Genres:</Label>
              <Genres>
                {genres.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </Genres>
            </div>
          </Detail>
          <Overview>{truncate(movie.overview,200)}</Overview>
        </MovieInfo>
        {video && video.site === 'YouTube' && (
          <VideoContainer>
            <iframe
              src={`https://www.youtube.com/embed/${video.key}`}
              title={`${movie.title} Trailer`}
              allowFullScreen
            />
          </VideoContainer>
        )}
      </Backdrop>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  min-height: 100vh;
`;

const Backdrop = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;


const MovieInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 20px;
  color: #fff;
  background: linear-gradient(to top, transparent, rgba(0, 0, 0, 0.8));
  width: 100%;
  @media (min-width: 768px) {
    padding: 40px;
  }
  @media (min-width: 992px) {
    padding: 60px;
  }
  @media (min-width: 1200px) {
    padding: 80px;
  }
`;

const Title = styled.h3`
  font-size: 3rem;
  margin: 0 0 60px;
`;

const Detail = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Label = styled.li`
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: -20px;
`;

const Value = styled.li`
  font-size: 1.2rem;
  padding: 10px;
`;

const Genres = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin-left: 5px;
  padding: 0;
  list-style: none;
`;

const Overview = styled.p`
  font-size: 1.2rem;
`;

const VideoContainer = styled.div`
  position: absolute;
  bottom: 150px;
  right: 40px;
  margin-right: 20px;
  @media (max-width: 768px) {
    display: none;
  }
`;

export default DetailPage