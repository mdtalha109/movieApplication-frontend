import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { userContext } from '../../App';
import MovieCard from '../../Components/MovieCard/MovieCard';
import Navbar from '../../Components/Navbar/Navbar';
import './Search.css'

const Search = () => {

    
  const [movieList, setMovieList] = useState({movieListItems: []})
  const [createdMovieList, setCreatedMovieList] = useState({createdList: []})
  const {state, dispatch} = useContext(userContext);

    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get('q')
    useEffect(()=> {

        const fetchSearchedMovies = async() => {
            const {data} = await axios.get(`https://www.omdbapi.com/?s=${searchKeyword}&apikey=fd5558af`);
            console.log(data.Search)
            setMovieList({movieListItems: data.Search})
        }
        fetchSearchedMovies()

        const fetchMovieList = async() => {
          console.log('fetching created list')
          const config = {
            headers: {
                'Content-Type' : ' application/json',
                'Authorization' : `Bearer ${state.token}`
            }
          }
    
          const {data} = await axios.get('https://movie-app-pro.herokuapp.com/api/list/getlist',config);
          console.log(data)
          setCreatedMovieList({createdList: data})
        }
    
        fetchMovieList();

       
    }, [])

    
  return (
      <>
        <Navbar/>
        <div className='home-container-wrapper'>
          <div className='home-container'>
            <h1>Search Result for {searchKeyword}</h1>

            {createdMovieList && createdMovieList.createdList.map((item)=> {
              <p>{item.movieListName}</p>
            })}

            <div style={{display: "flex", flexWrap: "wrap"}}>
            {
              movieList.movieListItems && movieList.movieListItems.map((movie)=> <MovieCard movieItem={movie} movieList ={createdMovieList.createdList}/>)
            }
            </div>
     
           
          </div>
      </div>
      </>
   
  )
}

export default Search