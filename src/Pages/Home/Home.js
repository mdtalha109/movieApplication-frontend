import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../../App';
import Navbar from '../../Components/Navbar/Navbar';
import './Home.css'

const Home = () => {

  const [movieKeyword, setMovieKeyword] = useState('')
  const [createdMovieList, setCreatedMovieList] = useState({createdList: []})
  const [loading, setLoading] = useState(false)


    const navigate = useNavigate()
    const {state, dispatch} = useContext(userContext);
    useEffect(()=> {
      
        if(!state){
            navigate('/')
        }

        const fetchMovieList = async() => {
          setLoading(true);
          console.log('fetching created list')
          const config = {
            headers: {
                'Content-Type' : ' application/json',
                'Authorization' : `Bearer ${state.token}`
            }
          }
    
          const {data} = await axios.get('https://movie-app-pro.herokuapp.com/api/list/getlist',config);
          setCreatedMovieList({createdList: data})
          setLoading(false);
        }
    
        fetchMovieList();


    }, [])

    const newListHandler = async() => {
      const newListName= prompt('Enter name of list');
      if(!newListName){
        alert('List name is required');
        return
      }

      const config = {
        headers: {
            'Content-Type' : ' application/json',
            'Authorization' : `Bearer ${state.token}`
        }
      }
      const {data} = await axios.post('https://movie-app-pro.herokuapp.com/api/list/createList', {movieListName:newListName}, config)
      console.log(data.createdList.movieListName)
      setCreatedMovieList({createdList: [...createdMovieList.createdList, data.createdList]})
  }

    const movieSearchHandler = async(e) => {
      e.preventDefault()
      if(!movieKeyword){
        alert('Enter movie name');
        return;
      }

      // const {data} = await axios.get(`https://www.omdbapi.com/?s=${movieKeyword}&apikey=fd5558af`);
      // console.log(data.Search)
      // setMovieList({movieListItems: data.Search})
      navigate(`/search?q=${movieKeyword}`)


    }
  return (
    <>
      <Navbar/>

      <div className='home-container-wrapper'>
          <div className='home-container'>
            <div className='movie-search-bar'>
              <input placeholder='Search your movie' value={movieKeyword} onChange={(e)=> setMovieKeyword(e.target.value)}/>
              <button  onClick={movieSearchHandler}>Search</button>
            </div>

            <div className='created-movie-list'>
            <h2>Created Movie List:</h2>  <button onClick={newListHandler}>Create new List</button>
            <div className='movie-list-container'>
             
             
                {
                  loading ? <p>Wait, Loading List if you have created any</p>:
                  createdMovieList && createdMovieList.createdList.map((item) => 
                  <Link to={`/list?q=${item.movieListName}`}>
                    <div className='movie-list-item'>
                      <h3>{item.movieListName}</h3>
                    </div>
                  </Link>
                   
                  )
                }
              
            </div>
            </div>

            
            
          </div>
      </div>
     


    </>
  )
}

export default Home