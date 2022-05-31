import logo from './logo.svg';
import './App.css';
import Login from './Pages/Authentication/Login/Login';
import { initialState, reducer } from "./reducers/userReducer.js";
import { createContext, useContext, useEffect, useReducer } from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom'
import Home from './Pages/Home/Home';
import Search from './Pages/Search/Search';
import List from './Pages/List/List';

export const userContext = createContext();

const Routing = () => {
  const {state, dispatch} = useContext(userContext)
  useEffect(()=> {
    const user = JSON.parse(localStorage.getItem('movieApp-userInfo'));
    console.log(user)
    if(user){
       dispatch({type: 'USER', payload:user})
    }

    console.log('state from app')
    console.log(state)
  }, [])

  return(
     <Routes>
        <Route exact path="/" element={<Login/>}> </Route>
        <Route exact path="/home" element={<Home/>}> </Route>
        <Route exact path="/search" element={<Search/>}> </Route>
        <Route exact path="/list" element={<List/>}> </Route>
        
      </Routes> 
  )
}

function App() {

  
  const [state, dispatch] = useReducer(reducer,initialState)
  return (
    <> 
    <userContext.Provider value={{state, dispatch}}>
      <Routing/>
    </userContext.Provider>
    </>
  );
}

export default App;
