import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Rooms from './component/Rooms';
import Users from './component/Users';
import './App.css'

let socket;
const socketEndpoint = 'http://localhost:5000';
const socketOptions = { transports: ['websocket'] };

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);


  useEffect(() => {
    socket = io(socketEndpoint, socketOptions);

    const handleConnect = () => {
      setIsSocketConnected(true);
      setRetryCount(0);
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);

      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000);
      setTimeout(() => {
        socket.connect();
        setRetryCount((prevCount) => prevCount + 1);
      }, retryDelay);
    };

    const handleConnectError = (error) => {
      console.error('Socket connection error:', error);
      socket.close();
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.close();
    };
  }, [retryCount]);


  useEffect(() => {

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      console.log(msg, '  mesgs');
    });

    socket.on('privateMessage', (privateMessage) => {
      console.log('Private Message:', privateMessage);
    });

    socket.on('typing', (user) => {
      console.log(user, '  user');
      setTypingUsers((prevUsers) => [user.username]);
      setTimeout(() => {
        setTypingUsers((prevUsers) => prevUsers.filter((u) => u !== user.username));
      }, 2000);
    });

    socket.on('messageHistory', (history) => {
      setMessages(history);
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  const joinRoom = () => {
    if (username && room) {
      socket.emit('join', { username, room });
      toast.success(`Joined room: ${room}`);
    } else {
      toast.error('Please enter a username and room');
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  const sendPrivateMessage = (to) => {
    const text = prompt('Enter your private message:');
    if (text.trim() !== '') {
      socket.emit('privateMessage', { to, text });
    }
  };

  const handleTyping = () => {
    socket.emit('typing');
  };


  const handleUserName = (e) => {
    setUsername(e);
  }

  const handleRoom = (e) => {
    setRoom(e);
  }

  return (
    <div className='App'>
      <ToastContainer />
      <h1>Real-Time Chat App</h1>
      <div className='chat-app'>
        <div>
          <div>
            {isSocketConnected ? (
              <p className='font-bold'>Socket is connected!</p>
            ) : (
              <p className='font-bold'>Socket is not connected. Retrying...</p>
            )}
          </div>
          <div>
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
              Room:
              <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
            </label>
            <br />
            <button onClick={joinRoom}>Join Room</button>
          </div>
          <div>
            <h2>Room: {room}</h2>
            <ul>
              {console.log(messages, '  messages')}
              {messages.map((msg, index) => (
                <li key={index}>
                  <strong>{msg.user}:</strong> {msg.text}
                </li>
              ))}
            </ul>
            <form onSubmit={sendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={handleTyping}
              />
              <button type="submit">Send</button>
            </form>
            <div>
              {typingUsers.length > 0 &&
                typingUsers.map((user, index) => (
                  <span key={index}>{user} is typing...</span>
                ))}
            </div>
            <button onClick={() => sendPrivateMessage('socketId')}>
              Send Private Message
            </button>
          </div>
        </div>

        <div className='second-panel'>
          <Rooms handleRoom={handleRoom} />
          <Users handleUserName={handleUserName} />
        </div>
      </div>
    </div>
  );
}

export default App;
