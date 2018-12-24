import React, { Component } from 'react';
import io from 'socket.io-client';
import LoginForm from './LoginForm';
import ChatContainer from '../chats/ChatContainer';

const socketUrl = 'http://localhost:3001';

class Layout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			socket: null,
			user: null
		}

		this.initSocket = this.initSocket.bind(this);
		this.setUser = this.setUser.bind(this);
		this.logout = this.logout.bind(this);

	}
	componentWillMount() {
		this.initSocket();
	}
	initSocket() {
		const socket = io(socketUrl);
		socket.on('connect', () => {
			console.log('connected');
		})
		this.setState({ socket })
	}
	setUser(user) {
		const { socket } = this.state;

		socket.emit('USER_CONNECTED', user);

		this.setState({	user });
	}
	logout() {
		const { socket } = this.state;
		
		socket.emit('LOGOUT');

		this.setState({ user: null });
	}
  	render() {
  		const { socket, user } = this.state;
	    return (
	    	<div className=''>
	        	{
	        		!user 
	        			? <LoginForm socket={socket} setUser={this.setUser} />	
	        			: <ChatContainer socket={socket} user={user} logout={this.logout} />
	        	}
	        </div>
	    );
  	}
}

export default Layout;
