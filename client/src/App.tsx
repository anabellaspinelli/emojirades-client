import './App.css';
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

interface ServerToClientEvents {
  receive_message: (message: Message) => void;
}

interface ClientToServerEvents {
  send_message: (message: string) => void;
}

interface Message {
  text: string;
  sender: string;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3001'
);

function App(): JSX.Element | null {
  const [message, setMessage] = useState<string>('');
  const [log, setLog] = useState<Message[]>([]);

  const pushMessageToLog = (messageData: Message) => {
    setLog((log) => {
      const newLog = [...log, messageData];
      return newLog;
    });
  };

  const sendMessage = () => {
    socket.emit('send_message', message);
  };

  useEffect(() => {
    socket.on('receive_message', (message) => {
      pushMessageToLog(message);
      console.log(message.text);
    });
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center pt-32 px-2 bg-purple-50">
      <header>
        <div className="p-4 rounded-2xl text-center bg-purple-400 hover:bg-purple-500 hover:shadow-lg transition-all">
          <h1 className="text-6xl text-white font-bold cursor-default">
            Socket.IOs
          </h1>
        </div>
      </header>

      <main className="mt-24">
        <section className="w-auto border-purple-600 border-2 rounded-2xl p-8 flex justify-between">
          <input
            aria-label="message"
            className="border-purple-500 border rounded px-2"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="type your message..."
            type="text"
            value={message}
          />
          <button
            className="ml-4 hover:bg-purple-200 bg-purple-100 px-4 py-2 rounded-md text-purple-900  transition-colors duration-150"
            onClick={sendMessage}
            type="button"
          >
            Send message
          </button>
        </section>
        {log.length !== 0 && (
          <section className="mt-12 w-full bg-white rounded-2xl border border-purple-100 py-4 px-2 shadow-inner">
            {log.map((message, i) => (
              <p key={i}>{message}</p>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
