import React, { useState } from 'react';
import { Button } from './Button';

interface ReviewModalProps {
  onSubmit: (input: number, output: number) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ onSubmit }) => {
  const [inputRating, setInputRating] = useState(5);
  const [outputRating, setOutputRating] = useState(5);

  return (
    <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Day Complete</h2>
        <p className="text-gray-500 mb-8">Take a moment to reflect on your session.</p>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-gray-700">Effort Input</label>
              <span className="text-blue-600 font-bold">{inputRating}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={inputRating}
              onChange={(e) => setInputRating(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-gray-400 mt-1">How hard did you try to focus?</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-gray-700">Output Satisfaction</label>
              <span className="text-green-600 font-bold">{outputRating}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={outputRating}
              onChange={(e) => setOutputRating(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <p className="text-xs text-gray-400 mt-1">How happy are you with what you achieved?</p>
          </div>
        </div>

        <div className="mt-10">
          <Button onClick={() => onSubmit(inputRating, outputRating)} className="w-full">
            Save & Close Day
          </Button>
        </div>
      </div>
    </div>
  );
};
