import React, { useState } from 'react'
import 'styles/Auth.scss';
import {authService} from '../fbase';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider,
   GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { async } from '@firebase/util';
import "styles/Auth.scss"

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [newAccount, setNewAccount] = useState(true);//true 회원가입, false로그인
  const [error, setError] = useState('');

  const onChange = (e) => {
    console.log('e.target.name->',e.target.name)
    console.log(e);
    const {target:{name, value}} = e;
    if(name === 'email'){
      setEmail(value);
    }else if(name === 'password'){
      setPassword(value)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if(newAccount){
        //회원가입
        data = await createUserWithEmailAndPassword(authService, email, password)
      }else{
        //로그인
        data = await signInWithEmailAndPassword(authService, email, password)
      }
      console.log('data->',data);
    }catch(error){
      console.log('error->',error);
      setError(error.message);
    }
  }
  const toggleAccount = () => setNewAccount(prev => !prev);

  const onSocialClick = async (e) => {
    const {target:{name}} = e;
    let provider;
    console.log('e.target.name->',e.target.name)
    if(name === "google"){
      provider = new GoogleAuthProvider();

    }else if(name === "github"){
      provider = new GithubAuthProvider();

    }
    const data = await signInWithPopup(authService, provider)
    console.log('data->',data);
  }

  return (
    <div className='bg'>
      <div className='bg_back'>로그인</div>
      <form onSubmit={onSubmit}>
        <input name="email" type='email' placeholder='Email' required 
        value={email} onChange={onChange} />

        <input name="password" type='password' placeholder='password' required 
        value={password} onChange={onChange}/>

        <input className='submit' type='submit' value={newAccount ? "Create Account" : "시작하기"}/>
      </form>
      <p>Netflix 회원이 아닌가요? <a href='#'>지금 가입하세요.</a></p>
      <p className='detail'>
      이 페이지는 Google reCAPTCHA의 보호를 받아<br/>
       사용자가 로봇이 아님을 확인합니다. <a href='#'>자세히 알아보기.</a>
      </p>
      <span className='account' onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>

      <div className='btn'>
        <button onClick={onSocialClick} name="google"><span className='google'></span>구글로 로그인하기</button>
        <button onClick={onSocialClick} name="github"><span className='github'></span>깃허브로 로그인하기</button>
      </div>
    </div>
  )
}

export default Auth