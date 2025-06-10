import { useState } from 'react'
import './App.css'
import ChatButton from './chatboat/ChatButton';
import ChatWindow from './chatboat/ChatWindow';

function App() {
  const[isChatOpen,setIsChatOpen]=useState(false);

  return (
    <>
      <ChatButton isOpen={isChatOpen} onClick={()=>setIsChatOpen(!isChatOpen)}/>
        <ChatWindow isOpen={isChatOpen} onClose={()=>setIsChatOpen(false)}/>
    </>
  )
}

export default App
