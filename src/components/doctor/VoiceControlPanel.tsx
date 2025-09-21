import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Square, 
  Volume2, 
  Stethoscope,
  VolumeX,
  Clock
} from 'lucide-react';
import { medicalVoiceService } from '../../services/voiceService';

export default function VoiceControlPanel({ 
  analysisResults, 
  isVisible = true,
  onPlayStart,
  onPlayEnd,
  className = ""
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [autoStarted, setAutoStarted] = useState(false);

  useEffect(() => {
    setIsSupported(medicalVoiceService.isSpeechSupported);
  }, []);

  // Auto-start voice consultation when analysis results are available
  useEffect(() => {
    if (analysisResults && !autoStarted && isSupported) {
      // Small delay to ensure smooth transition after analysis
      const timer = setTimeout(() => {
        handleAutoStart();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [analysisResults, autoStarted, isSupported]);

  const handleAutoStart = async () => {
    if (!analysisResults) return;

    try {
      setAutoStarted(true);
      setIsPlaying(true);
      
      if (onPlayStart) onPlayStart();

      await medicalVoiceService.speakAnalysisResults(analysisResults, {
        onStart: () => {
          console.log('Auto-started Retinal Doctor consultation');
        },
        onEnd: () => {
          setIsPlaying(false);
          if (onPlayEnd) onPlayEnd();
        },
        onError: (error) => {
          console.error('Voice synthesis error:', error);
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error starting voice consultation:', error);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    medicalVoiceService.stop();
    setIsPlaying(false);
  };

  if (!isVisible || !isSupported) {
    return null;
  }

  return (
    <Card className={`border-l-4 border-l-medical-blue ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Stethoscope className="w-5 h-5 mr-2 text-medical-blue" />
            Voice Consultation
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-medical-blue-lighter text-medical-blue">
              <Volume2 className="w-3 h-3 mr-1" />
              Retinal Doctor
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              ~45 sec
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status and Control */}
        <div className="flex items-center justify-between">
          {isPlaying ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-medical-blue rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium text-medical-blue">
                  Retinal Doctor Speaking...
                </span>
              </div>
              <Button onClick={handleStop} variant="destructive" size="sm">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                {autoStarted ? (
                  <>
                    <VolumeX className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Consultation completed
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2 text-medical-blue" />
                    <span className="text-sm text-medical-blue">
                      Starting consultation...
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Active Consultation Indicator */}
        {isPlaying && (
          <div className="p-3 bg-medical-blue-lighter rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-medical-blue rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium text-medical-blue">
                  Audio Consultation Active
                </span>
              </div>
              <Stethoscope className="w-4 h-4 text-medical-blue" />
            </div>
            <p className="text-xs text-muted-foreground">
              Your Retinal Doctor is providing a concise analysis of the examination results.
            </p>
          </div>
        )}

        {/* Information */}
        <div className="text-xs text-muted-foreground p-3 bg-medical-blue-lighter rounded-lg">
          <div className="flex items-start space-x-2">
            <Volume2 className="w-4 h-4 mt-0.5 text-medical-blue" />
            <div>
              <p className="font-medium text-medical-blue mb-1">Auto Voice Consultation</p>
              <p>Your Retinal Doctor automatically provides a concise spoken summary of the diagnosis, confidence level, and key recommendations in under one minute.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}