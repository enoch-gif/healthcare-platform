import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Alert, AlertDescription } from '../../ui/alert';
import { Brain, Monitor } from 'lucide-react';

export default function TrainingProgress({ 
  currentEpoch, 
  totalEpochs, 
  trainingProgress, 
  trainingStatus,
  modelConfig 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 mr-2 text-medical-blue" />
          Training Progress
        </CardTitle>
        <CardDescription>Fusion model training with gradient accumulation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Epoch {currentEpoch} of {totalEpochs}</span>
          <span>{trainingProgress.toFixed(1)}% Complete</span>
        </div>
        <Progress value={trainingProgress} className="w-full" />
        
        {trainingStatus === 'training' && (
          <Alert>
            <Monitor className="h-4 w-4" />
            <AlertDescription>
              Training in progress using DeiT small + ResNet18 fusion architecture with batch size {modelConfig.batchSize} and {modelConfig.accumulationSteps} accumulation steps.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}