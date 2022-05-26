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
	}
	componentDidMount() {
		const { socket, activeChat } = this.props;
		const img = this.img.current;

		const streamEvent = `STREAM-${activeChat.id}`;

		socket.on(streamEvent, (image) => {
			img.src = image
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
			})
		}
	}
	handleClick = () => {
		const { socket, activeChat } = this.props;
		const canvas = this.canvas.current;
		const context = canvas.getContext("2d");
		context.width = canvas.width;
		context.height = canvas.height;
		const video = this.video.current;

		navigator.getUserMedia = navigator.getUserMedia || 
								 navigator.webkitGetUserMedia || 
								 navigator.mozGetUserMedia || 
								 navigator.msgGetUserMedia;

		this.setState(prevState => ({
			playing: !prevState.playing
		}), () => {
			if(navigator.getUserMedia) {
		       	navigator.getUserMedia(
		       		{ video : true, audio: true }, 
		       		(stream) => {
		       			if (this.state.playing) {
		       				video.srcObject = stream;
		       				video.play();
		       			} else {
		       				video.srcObject = null;
		       			}
		       		}, 
		       		(err) => console.log(err.message)
		       	);
		    }

		   if (this.state.playing) {
		   		window.timer = setInterval(() => {
			    	context.drawImage(video, 0, 0, context.width, context.height);

			    	socket.emit('STREAM', { 
			    		image: canvas.toDataURL('image/webp'), 
			    		chatId: activeChat.id 
			    	});
			    }, 70);
		    } else {
		   		clearInterval(window.timer);
		    }
		});
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
				{ !playing &&
					<div className='video-img'>
						<img ref={this.img} alt=' ' />
					</div>
				}
				<video 
					ref={this.video} 
					style={{width: '330px', height: '680px', display: playing ? 'inherit' : 'none'}}
				/>
				<canvas style={{width: '330px', height: '330px', display:'none'}} ref={this.canvas} />
			</div>
		)
	}
}

export default VideoBar;