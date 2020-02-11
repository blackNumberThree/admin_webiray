import React, { Component } from 'react';
import {Link} from "react-router-dom";
import './main.css';
import io from "socket.io-client";
import Chat from './chat.js';

class Main extends Component{
  state = {
      rooms:[],
      current_room:'Admin',
  }

  //подключение к серверу
 socket = io.connect("https://webchatnoclient.eu-4.evennode.com/");

  //создание нового канала
  newUser =  () => {
        this.socket.emit('ADD_USER',"Admin") 
  }
  newConnect =  this.socket.on('connect', this.newUser )

  // Создаем событие "смена комнаты"
  switchRoom = (ev) =>{
      this.socket.emit('SWITCH_ROOM', ev.target.innerText);
      this.setState( {rooms: [], current_room:ev.target.innerText } );          
   };

  //Создаем событие"Удаление комнаты" 
  deleteRoom = () =>  {
      if (this.state.current_room==='Admin') {alert(`don't do it! (◣_◢)`)} 
      else {
          this.setState(  {current_room:'Admin'} ); 
          this.socket.emit('DETELE_ROOM', this.state.current_room)
          this.socket.emit('SWITCH_ROOM', 'Admin')
     } 
  }

  //Получаем и отрисовываем новые комнаты
  changeRoom = (data,data_2) => { 
      if (data_2) 
      {
         localStorage.setItem('current_room', this.state.current_room);
         this.setState( {rooms: [ ...data]} ); 
                  }
          else{ this.setState(  {rooms:[ ...data]} ) } 
  };
  roomListening = this.socket.on('UPDATE_ROOMS', this.changeRoom );

      
  //рендеринг скрытого попапа
  createHiddenPopup = () =>  {
      if (this.state.rooms.length > 5) {
        return (
            <div className="chats-row__pop-up-hidden" onClick={this.hiddenList}>
                <ul className= "rooms-list"  >
                    {
                        this.state.rooms.map(room => {
                            if (room===this.state.current_room)
                                { return (<li key={room} className='chats-row__pop-up_active'>{room}</li>) }
                            else
                                { return( <li key={ toString(Symbol()) } className='chats-row__pop-up' onClick={this.switchRoom}>{room}</li>) } 
                        })
                    }
                </ul>
            </div>
        )
      }else{}
  }

  //условие и механизм работы скрытого попапа
  hiddenList = () => {
      if (this.state.isOpen) {
          document.querySelector('.chats-row__pop-up-hidden').style = "transform: rotate(90deg)";
          document.querySelector('.rooms-list').style = "display: none";
          this.setState({isOpen:false})
      }
      else{ 
          document.querySelector('.chats-row__pop-up-hidden').style = "transform: rotate(0deg)";
          document.querySelector('.rooms-list').style = "display: flex";
          this.setState({isOpen:true})
      }      
  }

  render(){
  return(
    <>
        <header className="header">
                <div className="header__leftside">
                    <span className="header__tech-text">Чат тех поддержки</span>
                    <div className="header__wrapper-chats-row ">
                        <div className="header__chats-row chats-row">
                            {
                              this.state.rooms.map(room => {
                                if (room===this.state.current_room) 
                                  { return (<div key={room} className='chats-row__pop-up_active'>{room}</div>) }
                                else
                                  { return( <div key={room} className='chats-row__pop-up' onClick={this.switchRoom}>{room}</div>) }
                              })                              
                            }
                        </div>
                        {this.createHiddenPopup()}
                    </div>
                </div>
        </header>

        <main className="main-chat" >
            <Chat socket= {this.socket}/>
            <div className="main__right-side right-side">
                <div className="right-side__buttons">
                    <p onClick={this.deleteRoom}> Завершить разговор</p>
                </div>
            </div>
        </main>
    </>
    )
  }
}

export default Main;
