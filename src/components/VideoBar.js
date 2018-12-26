import React, { Component } from 'react';
import { FaVideo } from 'react-icons/fa';

class VideoBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			playing: false
		}

		this.img = React.createRef();
		this.canvas = React.createRef();
		this.video = React.createRef();

		this.handleClick = this.handleClick.bind(this);
	}
	componentDidMount() {
		const { socket, activeChat } = this.props;
		const img = this.img.current;

		const streamEvent = `STREAM-${activeChat.id}`;

		socket.on(streamEvent, (image) => {
			img.src = image
			console.log('im here in cdm method')
		})
	}
	componentDidUpdate(prevProps) {
		const { socket, activeChat } = this.props;
		const img = this.img.current;

		if (activeChat.id !== prevProps.activeChat.id) {
			socket.off(`STREAM-${prevProps.activeChat.id}`);

			const streamEvent = `STREAM-${activeChat.id}`;

			socket.on(streamEvent, (image) => {
				img.src = image
				console.log('im here in cdu method')
			})
		}
	}
	handleClick() {
		const { socket, activeChat } = this.props;
		const canvas = this.canvas.current;
		const context = canvas.getContext("2d");
		const video = this.video.current;

		this.setState(prevState => ({
			playing: !prevState.playing
		}));

		navigator.getUserMedia = navigator.getUserMedia || 
								 navigator.webkitGetUserMedia || 
								 navigator.mozGetUserMedia || 
								 navigator.msgGetUserMedia;

	    if(navigator.getUserMedia) {
	       	navigator.getUserMedia(
	       		{ video : true, audio: true }, 
	       		(stream) => {
	       			video.src = window.URL.createObjectURL(stream);
	       		}, 
	       		(err) => console.log(err.message)
	       	);
	    }
	     
	    // CLEAR INTERVAL IF NOT PLAYING 
	    setInterval(() => {
	    	// context.drawImage(video, 0, 0, 330, 240);
	    	console.log('from setInterval')
	    	socket.emit('STREAM', { 
	    		image: canvas.toDataURL('image/webp'), 
	    		chatId: activeChat.id 
	    	});
	    }, 1000);
	}
	render() {
		const { playing } = this.state;
		return (
			<div className='video-container'>
				<div 
					className='video-icon' 
					onClick={this.handleClick}>
					<FaVideo />
				</div>
				{
					playing
						? <video 
							ref={this.video} 
							style={{width: '330px', height: '680px'}}
							 />
						: <img ref={this.img} alt='video placeholder' />
				}
				<canvas style={{display:'none'}} ref={this.canvas} />
			</div>
		)
	}
}

export default VideoBar;