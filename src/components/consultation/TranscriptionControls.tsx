
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Mic, Pause, FileText, Play, AlertTriangle } from 'lucide-react';
import { generateMedicalTranscript, type MedicalTranscriptInput } from '@/ai/flows/medical-transcript';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { supportedLanguages } from '@/lib/data';

type TranscriptionControlsProps = {
  initialSourceLang?: string;
  initialTargetLang?: string;
};

export default function TranscriptionControls({ 
  initialSourceLang = 'en', 
  initialTargetLang = 'hi' 
}: TranscriptionControlsProps) {
  const [isRecording, setIsRecording] = useState(false); // Represents if the "simulated input process" is active
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [simulatedAudioInput, setSimulatedAudioInput] = useState('');
  const [sourceLang, setSourceLang] = useState(initialSourceLang);
  const [targetLang, setTargetLang] = useState(initialTargetLang);

  const { toast } = useToast();

  const handleRecordToggle = () => {
    if (isRecording) {
      // Stopping/Finalizing simulated input process
      // If not paused, could auto-transcribe, or just stop. Here we just stop.
      setIsPaused(false); 
      setIsRecording(false);
      // The user would typically click "Transcribe" after this if they entered text while paused.
    } else {
      // Starting simulated input process
      setIsRecording(true);
      setIsPaused(false); // Ensure not paused when starting
      setTranscript(''); // Clear previous transcript
      setSimulatedAudioInput(''); // Clear previous simulated input
    }
  };

  const handlePauseResume = () => {
    if (!isRecording) return; // Can only pause/resume if "recording" (simulated input process) is active
    setIsPaused(!isPaused);
    // If resuming and there was text, user might continue typing or transcribe.
  };

  const handleTranscribe = async () => {
    if (!simulatedAudioInput.trim()) {
      toast({
        variant: "destructive",
        title: "Input Missing",
        description: "Please provide some text in the 'Simulated Spoken Words' area to transcribe.",
      });
      return;
    }

    setIsTranscribing(true);
    setTranscript('');
    try {
      // This is a simulation. Genkit `media url` expects a real URL or actual data URI for audio.
      // The `generateMedicalTranscript` flow is designed for audio.
      // For this text-based simulation, we will use the `translateLive` flow as a workaround.
      const audioDataUri_SIMULATED_TEXT_PLACEHOLDER = `data:text/plain;base64,${Buffer.from(simulatedAudioInput).toString('base64')}`;
      
      const sourceLanguageName = supportedLanguages.find(l => l.code === sourceLang)?.name || 'English';
      const targetLanguageName = supportedLanguages.find(l => l.code === targetLang)?.name || 'Hindi';

      toast({
        title: "Simulation Notice",
        description: `Transcribing simulated text from ${sourceLanguageName} to ${targetLanguageName}. Actual audio processing is not part of this demo.`,
        variant: "default",
        duration: 7000,
      });
      
      // Using translateLive for text-based "transcription" simulation
       const { translateLive } = await import('@/ai/flows/live-translation');
       const translationResult = await translateLive({
         text: simulatedAudioInput,
         sourceLanguage: sourceLanguageName,
         targetLanguage: targetLanguageName,
         medicalContext: "Patient consultation context (simulated transcription)" // Optional context
       });
       setTranscript(translationResult.translatedText);

      // Original call to generateMedicalTranscript (would require actual audio data URI)
      // const input: MedicalTranscriptInput = {
      //   audioDataUri: audioDataUri_SIMULATED_TEXT_PLACEHOLDER, 
      //   sourceLanguage: sourceLanguageName,
      //   targetLanguage: targetLanguageName,
      // };
      // const result = await generateMedicalTranscript(input);
      // setTranscript(result.transcript);

    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        variant: "destructive",
        title: "Transcription Failed",
        description: "Could not transcribe the simulated input. Please try again.",
      });
      setTranscript('Error: Could not transcribe.');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <FileText className="w-6 h-6 mr-2 text-primary" />
          Simulated Audio Transcription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button onClick={handleRecordToggle} variant={isRecording ? "destructive" : "default"} className="w-1/2">
            {isRecording ? <Pause className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {isRecording ? 'Stop Simulated Input' : 'Start Simulated Input'}
          </Button>
          <Button onClick={handlePauseResume} disabled={!isRecording} variant="outline" className="w-1/2">
            {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
            {isPaused ? 'Resume Input' : 'Pause Input'}
          </Button>
        </div>
        
        {isRecording && isPaused && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-start">
            <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 shrink-0" />
            <div>
              <strong>Input Paused.</strong> Enter text below to simulate spoken words. This demo does not use a real microphone.
            </div>
          </div>
        )}

        {(isRecording && isPaused) && (
          <div className='space-y-2'>
             <Label htmlFor="simulated-audio-input">Simulated Spoken Words (Type here)</Label>
             <Textarea
              id="simulated-audio-input"
              placeholder="Enter text here to simulate what was last spoken..."
              value={simulatedAudioInput}
              onChange={(e) => setSimulatedAudioInput(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={!isPaused && isRecording} // Should be enabled only when paused
            />
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger><SelectValue placeholder="Source Language" /></SelectTrigger>
                <SelectContent>{supportedLanguages.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger><SelectValue placeholder="Target Language" /></SelectTrigger>
                <SelectContent>{supportedLanguages.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={handleTranscribe} disabled={isTranscribing || !simulatedAudioInput.trim()} className="w-full">
              {isTranscribing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Transcribe Simulated Input
            </Button>
          </div>
        )}

        <div>
          <Label htmlFor="transcript-output">Transcript</Label>
          <Textarea
            id="transcript-output"
            placeholder="Transcription of simulated input will appear here..."
            value={transcript}
            readOnly
            rows={5}
            className="bg-secondary/30 resize-none"
            aria-live="polite"
          />
        </div>
        <p className="text-xs text-muted-foreground italic">Note: This component simulates audio transcription using text input. Actual microphone input and audio processing are not implemented in this demo.</p>
      </CardContent>
    </Card>
  );
}
