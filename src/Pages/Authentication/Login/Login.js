import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import './Login.css'
import { userContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
// import  Spinner  from '@chakra-ui/react'

const Login = () => {


    const navigate = useNavigate()


    const {state, dispatch} = useContext(userContext);
    const [showLogin, setShowLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')

    const [loading, setLoading] = useState(false)

    useEffect(()=> {

    }, [showLogin])

    const loginHandler = async(e) => {
        e.preventDefault();
        if(!email || !password){
            alert('all fields are required');
            return;
          }
      
          try {
            const config = {
              headers: {
                  'Content-Type' : ' application/json'
              }
            }
            setLoading(true)

            const {data} = await axios.post('https://movie-app-pro.herokuapp.com/api/user/login', {email, password}, config)
            
            if(data){
              toast('Login Successfull');
              localStorage.setItem('movieApp-userInfo', JSON.stringify(data));
              dispatch({type: 'USER', payload:data})
              
              // console.log('state from login')
              // console.log(state)
              setLoading(false)
              navigate('/home')

            }
      
          } catch (error) {
            toast(error.response.data.message)
          }
    }
    
    const signupHandler =async(e) => {
        e.preventDefault();
        
        if(!username || !email || !password || !confirmPassword){
            alert('all field are required');
            return;
          }
      
          if(password !== confirmPassword){
            alert('password dont matched')
            return
          }

          try {
            const config = {
              headers: {
                  'Content-Type' : ' application/json'
              }
            }

            setLoading(true)
      
            const {data} = await axios.post('https://movie-app-pro.herokuapp.com/api/user/signup', {name:username, email, password}, config)
            console.log(data)

            if(data){
              setLoading(false)
                setShowLogin(true)
                setEmail('')
                setPassword('')
            }
           
          } catch (error) {
            // toast(error.response.data.error) 
          }
    }



  return (
      <>
    
    <div className='auth-container'>
        <div className='auth-content-container'>
            

            <div>
                    <form>
                          {
                            showLogin ? <h3>LogIn</h3> : <h3>Signup</h3>
                          }
                        {
                            !showLogin && <input type="text" placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                        }
                        <input type="text" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)}/>

                        {
                            !showLogin &&  <input type="password" placeholder='Confirm your password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                        }

                       
                        
                        {
                            

                            showLogin ? <button onClick={loginHandler}>{loading ? 'Wait' : 'Login'}</button>:<button onClick={signupHandler}>{loading ? 'Wait' : 'Signup'}</button>
                        }
                    
                        {
                            showLogin
                            ? <p>Not a registered user, <span onClick={()=> setShowLogin(false)}>Create new account</span></p>
                            : <p>Already a registered user, <span onClick={()=> setShowLogin(true)}>SignIn</span></p>
                        }
                    </form>
               
            </div>

        </div>
    </div>
    <ToastContainer/>
      </>
    
  )
}

export default Login