
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Mic, StopCircle, FileText, AlertTriangle, Settings2 } from 'lucide-react';
import { generateMedicalTranscript, type MedicalTranscriptInput } from '@/ai/flows/medical-transcript';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { supportedLanguages } from '@/lib/data';
import { Alert, AlertDescription as ShadAlertDescription, AlertTitle as ShadAlertTitle } from "@/components/ui/alert";


type TranscriptionControlsProps = {
  initialSourceLang?: string;
  initialTargetLang?: string;
  onTranscriptReady: (transcript: string) => void;
};

export default function TranscriptionControls({
  initialSourceLang = 'en',
  initialTargetLang = 'hi',
  onTranscriptReady,
}: TranscriptionControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [transcriptOutput, setTranscriptOutput] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [sourceLang, setSourceLang] = useState(initialSourceLang);
  const [targetLang, setTargetLang] = useState(initialTargetLang);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);
      toast({
        title: "Microphone Access Granted",
        description: "You can now record audio.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description: 'Please enable microphone permissions in your browser settings.',
      });
    }
  }, [toast]);

  useEffect(() => {
    // Clean up stream when component unmounts
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleStartRecording = () => {
    if (!streamRef.current || !hasPermission) {
      toast({
        variant: "destructive",
        title: "Permission Issue",
        description: "Microphone permission is required to record audio. Please grant permission first.",
      });
      requestMicrophonePermission(); // Attempt to request again
      return;
    }

    setAudioDataUrl(null); // Clear previous recording
    setTranscriptOutput(''); // Clear previous transcript
    setAudioChunks([]); // Reset chunks for new recording

    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setAudioChunks((prev) => [...prev, event.data]);
      }
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        setAudioDataUrl(reader.result as string);
      };
      // audioChunks are already updated via setAudioChunks in ondataavailable
    };

    recorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleTranscribe = async () => {
    if (!audioDataUrl) {
      toast({
        variant: 'destructive',
        title: 'No Audio Recorded',
        description: 'Please record audio before transcribing.',
      });
      return;
    }

    setIsTranscribing(true);
    setTranscriptOutput('');
    try {
      const sourceLanguageName = supportedLanguages.find(l => l.code === sourceLang)?.name || 'English';
      const targetLanguageName = supportedLanguages.find(l => l.code === targetLang)?.name || 'Hindi';
      
      const input: MedicalTranscriptInput = {
        audioDataUri: audioDataUrl,
        sourceLanguage: sourceLanguageName,
        targetLanguage: targetLanguageName,
      };
      const result = await generateMedicalTranscript(input);
      setTranscriptOutput(result.transcript);
      onTranscriptReady(result.transcript); // Pass transcript to parent
      toast({
          title: "Transcription Successful",
          description: `Audio transcribed from ${sourceLanguageName} to ${targetLanguageName}.`,
      });

    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        variant: 'destructive',
        title: 'Transcription Failed',
        description: 'Could not transcribe the audio. Please try again.',
      });
      setTranscriptOutput('Error: Could not transcribe.');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Mic className="w-6 h-6 mr-2 text-primary" />
          Audio Transcription
        </CardTitle>
        <CardDescription>
          Record audio using your microphone, then transcribe and translate it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasPermission === null && (
          <Button onClick={requestMicrophonePermission} className="w-full">
            <Mic className="mr-2 h-4 w-4" />
            Request Microphone Permission
          </Button>
        )}

        {hasPermission === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <ShadAlertTitle>Microphone Access Denied</ShadAlertTitle>
            <ShadAlertDescription>
              Please enable microphone permissions in your browser settings to use audio recording.
              <Button variant="link" onClick={requestMicrophonePermission} className="p-0 h-auto ml-1">Try requesting again</Button>
            </ShadAlertDescription>
          </Alert>
        )}

        {hasPermission === true && (
          <div className="flex items-center space-x-2">
            {!isRecording ? (
              <Button onClick={handleStartRecording} className="w-1/2" disabled={isTranscribing}>
                <Mic className="mr-2 h-4 w-4" /> Start Recording
              </Button>
            ) : (
              <Button onClick={handleStopRecording} variant="destructive" className="w-1/2" disabled={isTranscribing}>
                <StopCircle className="mr-2 h-4 w-4" /> Stop Recording
              </Button>
            )}
            <Button onClick={handleTranscribe} disabled={!audioDataUrl || isTranscribing || isRecording} className="w-1/2">
              {isTranscribing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Transcribe Recording
            </Button>
          </div>
        )}
        
        {isRecording && (
           <div className="flex items-center justify-center text-sm text-destructive animate-pulse p-2 bg-destructive/10 rounded-md">
            <Mic className="w-4 h-4 mr-2" /> Recording in progress...
          </div>
        )}

        <div className="space-y-2">
          <Label className="flex items-center"><Settings2 className="w-4 h-4 mr-1.5 text-muted-foreground"/>Transcription Language Settings</Label>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
              <Select value={sourceLang} onValueChange={setSourceLang} disabled={isRecording || isTranscribing}>
                <SelectTrigger><SelectValue placeholder="Source Language (Audio)" /></SelectTrigger>
                <SelectContent>{supportedLanguages.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={targetLang} onValueChange={setTargetLang} disabled={isRecording || isTranscribing}>
                <SelectTrigger><SelectValue placeholder="Target Language (Transcript)" /></SelectTrigger>
                <SelectContent>{supportedLanguages.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
        </div>

        <div>
          <Label htmlFor="transcript-output">Transcript</Label>
          <Textarea
            id="transcript-output"
            placeholder="Transcription will appear here..."
            value={transcriptOutput}
            readOnly
            rows={5}
            className="bg-secondary/30 resize-none"
            aria-live="polite"
          />
        </div>
         {audioDataUrl && !isRecording && (
            <div className="text-xs text-muted-foreground">
                <audio controls src={audioDataUrl} className="w-full">
                    Your browser does not support the audio element.
                </audio>
                Audio recorded. Ready to transcribe.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
