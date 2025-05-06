import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import socketService from '../../services/socket';

const Chat = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [typing, setTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchParticipants();
    setupSocketListeners();

    return () => {
      socketService.removeAllListeners();
    };
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setupSocketListeners = () => {
    const socket = socketService.connect();
    if (!socket) return;

    socket.emit('join_room', { projectId });

    socket.on('message_received', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user_typing', ({ senderId, typing }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (typing) {
          newSet.add(senderId);
        } else {
          newSet.delete(senderId);
        }
        return newSet;
      });
    });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages?projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/participants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch participants');
      const data = await response.json();
      setParticipants(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    try {
      const formData = new FormData();
      formData.append('content', newMessage);
      formData.append('projectId', projectId);
      if (selectedReceiver) {
        formData.append('receiverId', selectedReceiver);
      }
      if (file) {
        formData.append('attachment', file);
      }

      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to send message');

      setNewMessage('');
      setFile(null);
      
      // Socket will handle adding the new message to the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTyping = () => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.emit('typing', {
      projectId,
      senderId: user.id,
      typing: true
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        projectId,
        senderId: user.id,
        typing: false
      });
    }, 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Participants Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Participants</h2>
          <div className="space-y-2">
            {participants.map(participant => (
              <button
                key={participant.id}
                onClick={() => setSelectedReceiver(participant.id)}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  selectedReceiver === participant.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {participant.firstName} {participant.lastName}
                {typingUsers.has(participant.id) && (
                  <span className="ml-2 text-gray-500 text-sm">typing...</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === user.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                  message.senderId === user.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <div className="text-sm">
                  {message.senderId !== user.id && (
                    <span className="font-medium">
                      {message.sender.firstName} {message.sender.lastName}:
                    </span>
                  )}
                </div>
                <p>{message.content}</p>
                {message.attachmentUrl && (
                  <div className="mt-2">
                    <a
                      href={message.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      View Attachment
                    </a>
                  </div>
                )}
                <div className="text-xs mt-1 opacity-75">
                  {formatTimestamp(message.createdAt)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Attach
            </label>
            <button
              type="submit"
              disabled={!newMessage.trim() && !file}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send
            </button>
          </form>
          {file && (
            <div className="mt-2 text-sm text-gray-500">
              Selected file: {file.name}
              <button
                onClick={() => setFile(null)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
