import axios from 'axios';
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../../App';

import './Navbar.css'

const Navbar = () => {
    const {state, dispatch} = useContext(userContext);
    const navigate = useNavigate()

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

        const createdList = await axios.post('https://movie-app-pro.herokuapp.com/api/list/createList', {movieListName:newListName}, config)


    }
  return (
    <nav className='navbar'>
        <div><Link to='/home'>MovieApp</Link></div>

        <div className='logout-container'>
           <button onClick={function(){
                localStorage.clear();
                dispatch({type: 'CLEAR'})
                navigate('/')
              }}

              style={{backgroundColor: "white", color: 'black', borderRadius:"10px"}}
              
              >Logout ({state && state.name})</button>
        </div>
    </nav>

 
  )
}

export default Navbar