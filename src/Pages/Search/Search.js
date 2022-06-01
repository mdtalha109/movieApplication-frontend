import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { userContext } from '../../App';
import MovieCard from '../../Components/MovieCard/MovieCard';
import Loader from '../../Components/Loader/Loader';
import Navbar from '../../Components/Navbar/Navbar';
import './Search.css'

const Search = () => {

    
  const [movieList, setMovieList] = useState({movieListItems: []})
  const [createdMovieList, setCreatedMovieList] = useState({createdList: []})
  const [loading, setLoading]= useState(false)
  const {state, dispatch} = useContext(userContext);

    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get('q')
    useEffect(()=> {

        const fetchSearchedMovies = async() => {

          setLoading(true);
            const {data} = await axios.get(`https://www.omdbapi.com/?s=${searchKeyword}&apikey=fd5558af`);
            console.log(data.Search)
            setLoading(false);
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
    
          const {data} = await axios.get('https://movie-app-pro.herokuapp.com/api/list/getlist/public',config);
          console.log(data)
          setCreatedMovieList({createdList: data})
        }
    
        fetchMovieList();

       
    }, [])

    
  return (
      <>
        <Navbar/>
        <div className='home-container-wrappers'>
          <div className='home-containers'>
            <div className='search-page-result' style={{width: "90vw", display:"flex", flexDirection:"column"}}>
            <h1 className='text-center'>Search Result for '{searchKeyword}'</h1>

            {
              loading ? <div style={{width: "100%", display:"flex", justifyContent: "center"}}><Loader/></div> : ''
            }

            {/* {createdMovieList && createdMovieList.createdList.map((item)=> {
              <p>{item.movieListName}</p>
            })} */}

            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center",width:"100vw"}}>
            {
              
              movieList.movieListItems && movieList.movieListItems.map((movie)=> <MovieCard movieItem={movie} movieList ={createdMovieList.createdList}/>)
            }
            {
              !loading && !movieList.movieListItems && <h1>Not found</h1>
            }
            </div>

            
              
            
     
            </div>
          </div>
      </div>
      </>
   
  )
}

export default Search