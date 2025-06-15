
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
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [simulatedAudioInput, setSimulatedAudioInput] = useState('');
  const [sourceLang, setSourceLang] = useState(initialSourceLang);
  const [targetLang, setTargetLang] = useState(initialTargetLang);

  const { toast } = useToast();

  const handleRecordToggle = () => {
    if (isRecording) {
      // Stopping recording
      setIsPaused(false);
      setIsRecording(false);
      // In a real app, finalize recording here
    } else {
      // Starting recording
      setIsRecording(true);
      setIsPaused(false);
      setTranscript('');
      setSimulatedAudioInput(''); // Clear previous simulated input
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    // In a real app, pause/resume actual recording
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
      // Simulate creating a data URI from text. In a real app, this would be actual audio data.
      // This is a very rough simulation. A real audio file would be needed.
      // For Genkit, we'd need an actual audio data URI.
      // Let's make it clear this is a placeholder for audio.
      // A simple text-to-speech and then STT would be more realistic but out of scope.
      // We will assume the user pastes text as a proxy for spoken audio.
      const audioDataUri = `data:text/plain;base64,${Buffer.from(simulatedAudioInput).toString('base64')}`;
      
      const input: MedicalTranscriptInput = {
        audioDataUri: audioDataUri, // This will likely fail with Genkit if it expects real audio.
                                    // Genkit `media url` helper expects a real URL or actual data URI for audio/video.
                                    // This part of the demo is illustrative of the flow.
        sourceLanguage: supportedLanguages.find(l => l.code === sourceLang)?.name || 'English',
        targetLanguage: supportedLanguages.find(l => l.code === targetLang)?.name || 'Hindi',
      };
      
      // Showing a warning that this part is simulated and might not work with actual AI
      toast({
        title: "Simulation Notice",
        description: "Transcription is simulated with text input. Actual audio processing is required for the AI flow to work as intended.",
        variant: "default",
        duration: 7000,
      });

      // For demo purposes, let's bypass the actual AI call for text input and just "translate" it.
      // This is because `generateMedicalTranscript` expects an audio file.
      // We'll use the `translateLive` flow for this simulation if the user just types text.
      // If you had a mechanism to record audio and get a data URI, you'd use generateMedicalTranscript.
      
      // const result = await generateMedicalTranscript(input);
      // setTranscript(result.transcript);

      // SIMULATED TRANSCRIPTION USING TRANSLATE LIVE FOR TEXT INPUT
       const { translateLive } = await import('@/ai/flows/live-translation');
       const translationResult = await translateLive({
         text: simulatedAudioInput,
         sourceLanguage: input.sourceLanguage,
         targetLanguage: input.targetLanguage,
         medicalContext: "Patient consultation context"
       });
       setTranscript(translationResult.translatedText);


    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        variant: "destructive",
        title: "Transcription Failed",
        description: "Could not transcribe. Ensure valid input or try again.",
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
          Audio Recording & Transcription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button onClick={handleRecordToggle} variant={isRecording ? "destructive" : "default"} className="w-1/2">
            {isRecording ? <Pause className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          <Button onClick={handlePauseResume} disabled={!isRecording} variant="outline" className="w-1/2">
            {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
        
        {isRecording && isPaused && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-start">
            <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 shrink-0" />
            <div>
              <strong>Recording Paused.</strong> For this demo, please enter the "last spoken words" below to simulate audio input for transcription. In a real app, this would capture the actual audio segment.
            </div>
          </div>
        )}

        {(isRecording && isPaused) && (
          <div className='space-y-2'>
             <Label htmlFor="simulated-audio-input">Simulated Spoken Words (for demo)</Label>
             <Textarea
              id="simulated-audio-input"
              placeholder="Enter text here to simulate what was last spoken..."
              value={simulatedAudioInput}
              onChange={(e) => setSimulatedAudioInput(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={!isPaused}
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
              Transcribe Last Spoken (Simulated)
            </Button>
          </div>
        )}

        <div>
          <Label htmlFor="transcript-output">Transcript</Label>
          <Textarea
            id="transcript-output"
            placeholder="Transcription will appear here..."
            value={transcript}
            readOnly
            rows={5}
            className="bg-secondary/30 resize-none"
            aria-live="polite"
          />
        </div>
      </CardContent>
    </Card>
  );
}
