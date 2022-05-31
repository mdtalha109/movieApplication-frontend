import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { userContext } from '../../App';
import './MovieCard.css'

const MovieCard = ({movieItem, movieList}) => {

  const {state, dispatch} = useContext(userContext);

  const AddToListHandler = async(movieId, listName) => {
    const config = {
      headers: {
          'Content-Type' : ' application/json',
          'Authorization' : `Bearer ${state.token}`
      }
    }

    const {data} = await axios.post('https://movie-app-pro.herokuapp.com/api/list/addmovieToList',{movieId,listName },config);
    console.log(data)
  }

  return (
    <>
         <div className='movie-card'>
            <div className='img-container'>
                <img src={movieItem.Poster}/>
            </div>
            <div className='movie-Title'>
                {movieItem.Title}
            </div>

            {
              movieList && <>
              <label for="cars">Add to List</label>
                <select name="cars" id="cars" onChange={(e)=> AddToListHandler(movieItem.imdbID, e.target.value)}>
                <option value='select List'>Select List</option>
                {
                  movieList && movieList.map((item) => 
                    <option value={item.movieListName}>{item.movieListName}</option>
                  )
                }
               
                
            </select></>
            }

            
            
            
        </div>
    </>
   
  )
}

export default MovieCard