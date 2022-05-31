import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { userContext } from '../../App';
import MovieCard from '../../Components/MovieCard/MovieCard';
import Navbar from '../../Components/Navbar/Navbar';

const List = () => {

    const {state, dispatch} = useContext(userContext);
    const [loading, setLoading] = useState(false)

    const [searchParams] = useSearchParams();
    const movieListName = searchParams.get('q')

    const [movieItemInList, setMovieItemInList] = useState({movie: []})

    //getmoviebylist
    useEffect(()=> {

        const fetchMovieHelper = (...args) => {
            console.log(args)

            const finalMovieList = []

            args.map(async(movieId) => {
                const {data} = await axios.post(`https://www.omdbapi.com/?i=${movieId}&apikey=fd5558af`)
                console.log(data)

                finalMovieList.push(data)

                // console.log(movieItemInList.movie)

                console.log(finalMovieList)

       
                setMovieItemInList({movie: [...finalMovieList]})
                setLoading(false)
                // console.log(movieItemInList.movie)
      
            })

           

            // setMovieItemInList({movie: finalMovieList})

            // console.log(movieItemInList.movie)

            

            
            
        }
        const fetchMovieInList =  async() => {
            setLoading(true)
            const config = {
                headers: {
                    'Content-Type' : ' application/json',
                    'Authorization' : `Bearer ${state.token}`
                }
              }
        
              const {data} = await axios.post('https://movie-app-pro.herokuapp.com/api/list/getmoviebylist',{movieListName},config);

              

              const movieItem = [...data.movieItem];
              fetchMovieHelper(...movieItem);
              
              
              
        }
        fetchMovieInList()
    }, [])
  return (
    <>
         <Navbar/>
         <div className='home-container-wrapper'>
          <div className='home-container'>
              <h1>{`Movie Added In '${movieListName}'`}</h1>
              
              <div style={{display: "flex", flexWrap: "wrap"}}>

                  
                    {
                    movieItemInList &&  movieItemInList.movie.map((movie) => <MovieCard movieItem={movie}/>)

                    }
            </div>
          </div>
          </div>
    </>
  )
}

export default List