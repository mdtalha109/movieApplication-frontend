import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../../App';
import { DeleteIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../Components/Loader/Loader';
import Navbar from '../../Components/Navbar/Navbar';
import './Home.css'

const Home = () => {

  const [movieKeyword, setMovieKeyword] = useState('')
  const [createdMovieList, setCreatedMovieList] = useState({createdList: []})
  const [createdMovieListPublic, setCreatedMovieListPublic] = useState({createdListPublic: []})
  const [loadingPrivate, setLoadingPrivate] = useState(false)
  const [loadingPublic, setLoadingPublic] = useState(false)


    const navigate = useNavigate()
    const {state, dispatch} = useContext(userContext);
    useEffect(()=> {
      
      
        if(!state){
            navigate('/')
        }
        console.log(state)


        const fetchMovieListPublic = async() => {
          setLoadingPublic(true);
          console.log('fetching created list')
          const config = {
            headers: {
                'Content-Type' : ' application/json',
                'Authorization' : `Bearer ${state.token}`
            }
          }
    
          const {data} = await axios.get('https://movie-app-pro.herokuapp.com/api/list/getlist/public',config);
          console.log(data)
          
          setCreatedMovieListPublic({createdListPublic: data})
          setLoadingPublic(false);
        }
    

        const fetchMovieListPrivate = async() => {
          setLoadingPrivate(true);
          console.log('fetching created list')
          const config = {
            headers: {
                'Content-Type' : ' application/json',
                'Authorization' : `Bearer ${state.token}`
            }
          }
    
          const {data} = await axios.get('https://movie-app-pro.herokuapp.com/api/list/getlist/private',config);
          console.log(data)
          
          setCreatedMovieList({createdList: data})
          fetchMovieListPublic();
          setLoadingPrivate(false);
        }
    
        fetchMovieListPrivate();




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

      toast('Wait, Creating List', {
        autoClose: 1000,
      });
      const {data} = await axios.post('https://movie-app-pro.herokuapp.com/api/list/createList', {movieListName:newListName}, config)
      console.log(data.createdList.movieListName)
      setCreatedMovieList({createdList: [...createdMovieList.createdList, data.createdList]})
      setCreatedMovieListPublic({createdListPublic: [...createdMovieListPublic.createdListPublic, data.createdList]})
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

    const deleteListHandler = async(e, movieListName) => {
        
        e.preventDefault()
        const config = {
          headers: {
              'Content-Type' : ' application/json',
              'Authorization' : `Bearer ${state.token}`
          }
        }

        const updatedList = createdMovieList.createdList.filter((item)=>{
          if(item.movieListName == movieListName){
            return;
          }
          else return item;
        } )
        setCreatedMovieList({createdList: updatedList})

        const updatedListPublic = createdMovieListPublic.createdListPublic.filter((item)=>{
          if(item.movieListName == movieListName){
            return;
          }
          else return item;
        } )
        setCreatedMovieListPublic({createdListPublic: updatedListPublic})
        
        const {data} = await axios.post('https://movie-app-pro.herokuapp.com/api/list/deletelist',{movieListName},config);
        if(data.acknowledged){
          
          toast.success('List deleted Successfully')
        }
        else{
          toast.warning('Something went wrong, try again!')
        }
        
        
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
            <h2>Created Movie List (Private):</h2>  <button onClick={newListHandler}>Create new List</button>
            <div className='movie-list-container'>
                {
                  loadingPrivate ? <div style={{marginTop:"20px"}}><p>Loading your List</p><Loader/></div>:
                  createdMovieList && createdMovieList.createdList.map((item) => 
                  <Link to={`/list?q=${item.movieListName}`}>
                    <div className='movie-list-item'>
                      <h3>{item.movieListName} <ArrowForwardIcon/></h3>
                      {
                        item.createdBy == state.id ? <div onClick={(e)=>deleteListHandler(e, item.movieListName)} className='delete-container'><DeleteIcon/></div> : ''
                      }                  
                    </div>
                  </Link>        
                  )
                }
                {
                  !loadingPrivate && createdMovieList.createdList.length == 0 && <p>your private list is empty</p>
                }
              
            </div>

            <h2>Created Movie List (Public):</h2>
            <div className='movie-list-container'>
                {
                  loadingPublic ? <div style={{marginTop:"20px"}}><p>Loading Public List</p><Loader/></div>:
                  createdMovieListPublic && createdMovieListPublic.createdListPublic.map((item) => 
                  <Link to={`/list?q=${item.movieListName}`}>
                    <div className='movie-list-item'>
                      <h3>{item.movieListName} <ArrowForwardIcon/></h3>                  
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