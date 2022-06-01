import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../../App';
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../Components/Loader/Loader';
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
      toast.success('List created successfully', {
        autoClose: 2000,
      });
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
                  loading ? <div style={{marginTop:"20px"}}><p>Loading your List</p><Loader/></div>:
                  createdMovieList && createdMovieList.createdList.map((item) => 
                  <Link to={`/list?q=${item.movieListName}`}>
                    <div className='movie-list-item'>
                      <h3>{item.movieListName}<PhoneIcon /></h3>
                    </div>
                  </Link>
                   
                  )
                }
              
            </div>
            </div> 
          </div>
      </div>
      <ToastContainer/>
    </>
  )
}

export default Home