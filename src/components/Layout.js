import React, { Component } from 'react';
import io from 'socket.io-client';
import LoginForm from './LoginForm';

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
		this.disconnect = this.disconnect.bind(this);

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
	disconnect() {
		const { socket } = this.state;

		socket.emit('USER_DISCONNECTED');

		this.setState({ user: null });
	}
  	render() {
  		const { socket } = this.state;
	    return (
	        <LoginForm socket={socket} setUser={this.setUser} />
	    );
  	}
}

export default Layout;
