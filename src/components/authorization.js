import React from 'react';
import './authorization.css';

const Authorization =()=>{

let toEnter=()=>{

if ( login==='admin' && parol==='admin') {

     sessionStorage.setItem('securety', true);
    }else{ 
alert("your login or password is incorrect") 
 }
  }

let login="";
let parol=''



  return(
<div className="authorization-page">
    <header className="header">
        <span className="header__tech-text">Чат технической поддержки</span>
    </header>
    <main className="main-authorization">
        <div className="authorization-block">
            <span className="authorization__title"> Авторизация </span>
            <form className="authorization-form" action="index.html" method="post">
              <label htmlFor="loginField"><span>E-mail</span></label>
              <input id="loginField" type="text" name="login" onChange={(ev) => login = ev.target.value} placeholder="admin@gmail.com"/>
              <label htmlFor="parolField"><span>Пароль</span></label>
              <input id="parolField" type="text" name="parol" onChange={(ev) => parol = ev.target.value} placeholder="*******"/>
            </form>
        </div>
        <a href=""><p className="button__text" onClick={toEnter}>Войти</p></a>
    </main>
</div>
  )
}

export default Authorization;


