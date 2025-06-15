
"use client";

import { useState, useEffect } from 'react';
import LiveTranslationControls from './LiveTranslationControls';
import TranscriptionControls from './TranscriptionControls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff, Send, Maximize, Minimize } from 'lucide-react';
import Image from 'next/image';

type ChatMessage = {
  id: string;
  sender: 'patient' | 'doctor' | 'system';
  text: string;
  timestamp: string;
};

type VideoCallInterfaceProps = {
  consultationId: string;
  doctorName: string;
  patientName: string;
  initialSymptoms?: string; 
};

export default function VideoCallInterface({ consultationId, doctorName, patientName, initialSymptoms }: VideoCallInterfaceProps) {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [mainVideoFeed, setMainVideoFeed] = useState<'doctor' | 'patient'>('doctor');
  const [textForLiveTranslation, setTextForLiveTranslation] = useState('');


  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString()); 
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'patient', text: newMessage, timestamp: new Date().toLocaleTimeString() }
      ]);
      setNewMessage('');
      
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { id: (Date.now()+1).toString(), sender: 'doctor', text: "नमस्ते, मैं आपकी कैसे मदद कर सकता हूँ?", timestamp: new Date().toLocaleTimeString() }
        ]);
      }, 1500);
    }
  };

  const handleEndCall = () => {
    alert('Call Ended (Simulated)');
  };

  const medicalContextString = initialSymptoms ? `Patient reported symptoms: ${initialSymptoms}.` : "General medical consultation.";

  const handleTranscriptReady = (transcript: string) => {
    setTextForLiveTranslation(transcript);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] max-h-screen bg-background overflow-hidden">
      <div className="flex-grow flex flex-col p-4 space-y-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
          <Card className={`relative aspect-video overflow-hidden shadow-lg ${mainVideoFeed === 'doctor' ? 'md:col-span-2' : ''}`}>
            <Image src="https://placehold.co/600x338.png" alt="Doctor Video Feed" layout="fill" objectFit="cover" data-ai-hint="doctor video" />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">{doctorName}</div>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/70" onClick={() => setMainVideoFeed('doctor')}>
              {mainVideoFeed === 'doctor' ? <Minimize className="w-4 h-4 text-white" /> : <Maximize className="w-4 h-4 text-white" />}
            </Button>
          </Card>
          <Card className={`relative aspect-video overflow-hidden shadow-lg ${mainVideoFeed === 'patient' ? 'md:col-span-2' : ''}`}>
             <Image src="https://placehold.co/600x338.png" alt="Patient Video Feed" layout="fill" objectFit="cover" data-ai-hint="person video" />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">{patientName}</div>
             <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/70" onClick={() => setMainVideoFeed('patient')}>
              {mainVideoFeed === 'patient' ? <Minimize className="w-4 h-4 text-white" /> : <Maximize className="w-4 h-4 text-white" />}
            </Button>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-3 flex justify-center items-center space-x-2 sm:space-x-3">
            <Button variant="outline" size="icon" onClick={() => setIsMicMuted(!isMicMuted)} aria-label={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}>
              {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsCameraOff(!isCameraOff)} aria-label={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}>
              {isCameraOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
            </Button>
            <Button variant="destructive" size="lg" onClick={handleEndCall} className="px-4 sm:px-6">
              <PhoneOff className="w-5 h-5 mr-0 sm:mr-2" /> <span className="hidden sm:inline">End Call</span>
            </Button>
            <div className="text-sm text-muted-foreground hidden sm:block">{currentTime}</div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <TranscriptionControls 
            onTranscriptReady={handleTranscriptReady} 
          />
          <LiveTranslationControls 
            medicalContext={medicalContextString} 
            inputText={textForLiveTranslation} 
          />
        </div>
      </div>

      <aside className="w-full lg:w-96 bg-secondary/30 border-l flex flex-col p-4 max-h-full lg:max-h-screen">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-xl">Consultation Chat</CardTitle>
        </CardHeader>
        <ScrollArea className="flex-grow mb-4 pr-2 -mr-2">
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg shadow ${
                  msg.sender === 'patient' ? 'bg-primary text-primary-foreground' : 
                  msg.sender === 'doctor' ? 'bg-card' : 'bg-muted text-muted-foreground italic text-xs'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'patient' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {msg.sender === 'system' ? '' : `${msg.sender === 'patient' ? 'You' : doctorName}, ${msg.timestamp}`}
                  </p>
                </div>
              </div>
            ))}
            {chatMessages.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Chat history will appear here.</p>}
          </div>
        </ScrollArea>
        <div className="flex items-center space-x-2 border-t pt-4">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow"
          />
          <Button onClick={handleSendMessage} size="icon" aria-label="Send message">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </aside>
    </div>
  );
}

