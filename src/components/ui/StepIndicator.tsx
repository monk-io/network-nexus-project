import React from 'react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepIndicator({ currentStep, totalSteps = 3, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-center space-x-2 mb-4", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                isCompleted ? 'bg-blue-500 text-white' :
                isCurrent ? 'bg-blue-200 text-blue-700 border-2 border-blue-500' :
                'bg-gray-200 text-gray-500'
              )}
            >
              {stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  'h-1 flex-1',
                  isCompleted || isCurrent ? 'bg-blue-500' : 'bg-gray-200'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
} 