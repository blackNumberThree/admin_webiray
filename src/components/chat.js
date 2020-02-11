import React, { Component } from 'react';

import './main.css';

class Chat extends Component{

	state = {
		role:'admin',
		author:'Оператор',
		message: '',
		request: '',
		messages: [],
	};
	socket = this.props.socket

	//функция очистки чата
	cleanerChat=() =>{
			this.setState({messages:[]})
	}
	cleanChat = this.socket.on('CLEAN_CHAT', this.cleanerChat);

	//прием сообщений для чата
	addMessage = (data) => {
			this.setState( {messages: [...this.state.messages, data] } );
				 document.querySelector('.chat').scrollTop= 9999

	};
	socketListening = this.socket.on('TO_CHAT_MESS', this.addMessage );

	//прерием истории для чата
	hystoryMessage = (data) => {  

		let newData = data.map( (element) =>{
			return {
				role:element.role,
				author:element.user_name,
				message:element.message,
				request:element.request,
				time:element.time
			}
	});
	newData.forEach(element => this.setState( {messages: [...this.state.messages, element] } )  );
	 document.querySelector('.chat').scrollTop= 9999

	};
	hystoryListening = this.socket.on('MESS_TO_ADMIN', this.hystoryMessage );

	//отправка сообщений на сервер
	sendMessage = (ev) =>         //создание ф-ции  внесение сообщений в  массив сообщений
	{
		if(this.state.message.replace(/\s+/g,'')===''){}
			else{ 
				ev.preventDefault();
				this.socket.emit('TO_SERVER_MESS', {
					role: this.state.role,
					author: this.state.author,
					message: this.state.message,
					request: this.state.request,
					time:new Date().toLocaleString(),
					current_room:localStorage.getItem('current_room')
				})
				this.setState({message: '', request:''});
			}       
	};

	//отправка сообщений по кнопке "Enter"
	pressOfKey = document.addEventListener('keydown', (event) => {
		if(event.key==="Enter" && event.shiftKey===false){ 
			if(this.state.message.replace(/\s+/g,'')===''){}
			else{ 
				this.socket.emit('TO_SERVER_MESS', {
					role: this.state.role,
					author: this.state.author,
					message: this.state.message,
					request: this.state.request,
					time:new Date().toLocaleString(),
					current_room:localStorage.getItem('current_room')
					})
				this.setState({message: '', request:''});
			}  
		}
	})

    render(){
  

  return(

    <div className="main__left-side">
        <div className="main__chat chat">
            {
              	this.state.messages.map(message => {
	           		return (
	                        <div key={ Math.random()*Math.random()} className= { 'chat__mesedge messedge  ' + message.role} >
	                            <p className="mesedge__asking-question">{message.request}</p>
	                            <div className="chat-mesedge__middle-row">
	                                <p>{message.author}</p> 

	                                <div className="chat-mesedge__time">
	                                    <p>{message.time}</p>
	                                 <img className ="chat__vector-img" src={require('../img/vector.png')} onClick={ () =>{this.setState({request : message.message}) } } alt="ava"/>
	                                </div>
	                            </div>
	                            <p  className="chat-mesedge__main-text" >{message.message}</p >
	                        </div>
	                )
            	})
          	}
        </div>

        <div className="entry-block">
            <div className="entry-block__entry-field">
                <input maxLength="256" autoComplete="off" type="text" name="request" className="entry-block__request" value={this.state.request} onChange={ev => this.setState({request : ev.target.value}) } ></input>
                <textarea className="entry-block__textarea" autoComplete="off" maxLength="256" name="name" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}  ></textarea>
            </div>
            <div className="entry-block__buttons">
                <p onClick={this.sendMessage}>  Отправить</p>
            </div>
        </div>
    </div>

  )
}}

export default Chat;


