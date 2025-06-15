
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Languages, ArrowRightLeft, Sparkles } from 'lucide-react';
import { translateLive, type TranslateLiveInput } from '@/ai/flows/live-translation';
import { supportedLanguages } from '@/lib/data';
import type { Language } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const LanguageSelector = ({ value, onChange, availableLanguages, placeholder }: { value: string, onChange: (value: string) => void, availableLanguages: Language[], placeholder: string }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full md:w-[180px]">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {availableLanguages.map(lang => (
        <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);

type LiveTranslationControlsProps = {
  initialSourceLang?: string;
  initialTargetLang?: string;
  medicalContext?: string;
  inputText?: string; // New prop to receive text from transcription
};

export default function LiveTranslationControls({
  initialSourceLang = 'en',
  initialTargetLang = 'hi',
  medicalContext = '',
  inputText = '', // Default to empty string
}: LiveTranslationControlsProps) {
  const [textToTranslate, setTextToTranslate] = useState(inputText);
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState(initialSourceLang);
  const [targetLang, setTargetLang] = useState(initialTargetLang);
  const [isTranslating, setIsTranslating] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (inputText) {
      setTextToTranslate(inputText);
    }
  }, [inputText]);

  const handleTranslate = useCallback(async () => {
    if (!textToTranslate.trim()) {
      return;
    }
    setIsTranslating(true);
    try {
      const input: TranslateLiveInput = {
        text: textToTranslate,
        sourceLanguage: supportedLanguages.find(l => l.code === sourceLang)?.name || 'English',
        targetLanguage: supportedLanguages.find(l => l.code === targetLang)?.name || 'Hindi',
        medicalContext: medicalContext,
      };
      const result = await translateLive(input);
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: "Could not translate the text. Please try again.",
      });
      setTranslatedText('Error: Could not translate.');
    } finally {
      setIsTranslating(false);
    }
  }, [textToTranslate, sourceLang, targetLang, medicalContext, toast]);

  useEffect(() => {
    if (liveMode && textToTranslate.trim() && !isTranslating) {
      const timer = setTimeout(() => {
        handleTranslate();
      }, 500); // Reduced delay for quicker live translation
      return () => clearTimeout(timer);
    }
  }, [liveMode, textToTranslate, isTranslating, handleTranslate]);

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    // Optionally swap texts: if textToTranslate becomes translatedText and vice versa
    // This might be useful if the user wants to translate back and forth.
    // For now, we keep it simple: just swap language selections.
    // setTextToTranslate(translatedText); 
    // setTranslatedText(textToTranslate); // Or clear translatedText
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Languages className="w-6 h-6 mr-2 text-primary" />
          Live Text Translation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="live-mode-switch" checked={liveMode} onCheckedChange={setLiveMode} />
          <Label htmlFor="live-mode-switch" className="flex items-center">
            <Sparkles className={`w-4 h-4 mr-1.5 ${liveMode ? 'text-amber-500' : 'text-muted-foreground'}`} />
            Live Mode {liveMode ? "(Auto-translates on text change)" : "(Manual)"}
          </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor="text-to-translate" className="mb-1 block">
              Text to Translate ({supportedLanguages.find(l => l.code === sourceLang)?.name})
            </Label>
            <Textarea
              id="text-to-translate"
              placeholder="Enter text here, or record audio and transcribe..."
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="translated-text">
                Translated Text ({supportedLanguages.find(l => l.code === targetLang)?.name})
              </Label>
              {isTranslating && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            </div>
            <Textarea
              id="translated-text"
              placeholder="Translation will appear here..."
              value={translatedText}
              readOnly
              rows={4}
              className="bg-secondary/30 resize-none"
              aria-live="polite"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <LanguageSelector value={sourceLang} onChange={setSourceLang} availableLanguages={supportedLanguages} placeholder="Source Language" />
            <Button variant="ghost" size="icon" onClick={swapLanguages} aria-label="Swap languages">
              <ArrowRightLeft className="w-5 h-5" />
            </Button>
            <LanguageSelector value={targetLang} onChange={setTargetLang} availableLanguages={supportedLanguages} placeholder="Target Language" />
          </div>
          {!liveMode && (
            <Button onClick={handleTranslate} disabled={isTranslating || !textToTranslate.trim()} className="w-full md:w-auto">
              {isTranslating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Languages className="mr-2 h-4 w-4" />
              )}
              Translate
            </Button>
          )}
        </div>
        {medicalContext && (
          <p className="text-xs text-muted-foreground italic">
            Medical Context considered: {medicalContext.substring(0,100)}{medicalContext.length > 100 && "..."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

