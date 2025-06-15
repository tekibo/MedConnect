
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Languages, ArrowRightLeft, Volume2, Sparkles } from 'lucide-react';
import { translateLive, type TranslateLiveInput } from '@/ai/flows/live-translation';
import { supportedLanguages } from '@/lib/data';
import type { Language } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type LiveTranslationControlsProps = {
  initialSourceLang?: string;
  initialTargetLang?: string;
  medicalContext?: string; // E.g., selected symptoms, patient notes
};

export default function LiveTranslationControls({
  initialSourceLang = 'en',
  initialTargetLang = 'hi',
  medicalContext = '',
}: LiveTranslationControlsProps) {
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState(initialSourceLang);
  const [targetLang, setTargetLang] = useState(initialTargetLang);
  const [isTranslating, setIsTranslating] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (liveMode && textToTranslate.trim() && !isTranslating) {
      const timer = setTimeout(() => {
        handleTranslate();
      }, 1000); // Auto-translate after 1 sec of inactivity in live mode
      return () => clearTimeout(timer);
    }
  }, [textToTranslate, liveMode, isTranslating]);

  const handleTranslate = async () => {
    if (!textToTranslate.trim()) {
      setTranslatedText('');
      return;
    }
    setIsTranslating(true);
    setTranslatedText(''); // Clear previous translation
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
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    // Optionally swap text and translation if it makes sense
    // setTextToTranslate(translatedText);
    // setTranslatedText(textToTranslate); // This might be confusing, perhaps just clear?
  };

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

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Languages className="w-6 h-6 mr-2 text-primary" />
          Live Translation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="live-mode-switch" checked={liveMode} onCheckedChange={setLiveMode} />
          <Label htmlFor="live-mode-switch" className="flex items-center">
            <Sparkles className={`w-4 h-4 mr-1.5 ${liveMode ? 'text-amber-500' : 'text-muted-foreground'}`} />
            Live Mode {liveMode ? "(Auto-translates)" : "(Manual)"}
          </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor="text-to-translate" className="mb-1 block">
              Text to Translate ({supportedLanguages.find(l => l.code === sourceLang)?.name})
            </Label>
            <Textarea
              id="text-to-translate"
              placeholder="Enter text here..."
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <div>
            <Label htmlFor="translated-text" className="mb-1 block">
              Translated Text ({supportedLanguages.find(l => l.code === targetLang)?.name})
            </Label>
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
                <Volume2 className="mr-2 h-4 w-4" /> // Icon implies speech, more generic translate icon might be better
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
