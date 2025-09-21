import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { GitBranch } from 'lucide-react';

export default function ModelArchitecture() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GitBranch className="w-5 h-5 mr-2 text-medical-blue" />
          Fusion Model Architecture
        </CardTitle>
        <CardDescription>Two-branch neural network for retinal classification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-medical-blue-lighter rounded-lg">
          <h4 className="font-medium text-medical-blue mb-2">Branch 1: Vision Transformer</h4>
          <p className="text-sm text-muted-foreground">DeiT Small (Data-efficient Image Transformer)</p>
          <p className="text-xs text-muted-foreground mt-1">Output dimensions: 384</p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">+</span>
          </div>
        </div>
        
        <div className="p-4 bg-health-green-lighter rounded-lg">
          <h4 className="font-medium text-health-green mb-2">Branch 2: Convolutional Network</h4>
          <p className="text-sm text-muted-foreground">ResNet18 (Residual Network)</p>
          <p className="text-xs text-muted-foreground mt-1">Output dimensions: 512</p>
        </div>
        
        <div className="text-center">
          <div className="inline-block p-3 bg-accent-red-lighter rounded-lg">
            <h4 className="font-medium text-accent-red">Fusion Layer</h4>
            <p className="text-sm text-muted-foreground">Concatenated features → 4 classes</p>
            <p className="text-xs text-muted-foreground">CNV, DME, Drusen, Normal</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}