import { divide } from 'lodash';
import * as React from 'react';
import {useEffect, useRef} from 'react';
import {post} from './utils/http';
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const navigate = useNavigate()
  const passwd = useRef<HTMLInputElement>(null)

  const login = async () => {
    if(passwd.current){
      const r = await post('/hogar', {username: 'bla', password: passwd.current.value})
      if(r){
        navigate('/editor')
      }else{
        console.log({mensaje: 'Incorrecto!'})
      } 
    }
  }
  
  useEffect(() => {
    const leer_enter = (e) => { if (e.key == 'Enter') login() }
    const k = window.addEventListener('keyup', leer_enter)
    return () => window.removeEventListener('keyup', leer_enter)
  }, [])

  return (
    <div id="hogar">
      <div>
        <input id='pwd' type="password" ref={passwd} />
        <div id='login' className='btn' onClick={login}></div>
      </div>
    </div>
  )
} 
