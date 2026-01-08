import React from 'react';
import { TagType } from '../types';
import { Coffee, ShieldAlert, Tv, CheckCircle2 } from 'lucide-react';

interface TagModalProps {
  onSelect: (tag: TagType) => void;
}

export const TagModal: React.FC<TagModalProps> = ({ onSelect }) => {
  const options = [
    { tag: TagType.REST, label: 'Rest / Break', icon: Coffee, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { tag: TagType.BLOCKED, label: 'Blocked / Difficult', icon: ShieldAlert, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { tag: TagType.DISTRACTION, label: 'Distracted', icon: Tv, color: 'bg-red-100 text-red-700 hover:bg-red-200' },
    { tag: TagType.DONE, label: 'Task Finished', icon: CheckCircle2, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Why did you stop?</h3>
          <div className="grid grid-cols-2 gap-4">
            {options.map((opt) => (
              <button
                key={opt.tag}
                onClick={() => onSelect(opt.tag)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${opt.color}`}
              >
                <opt.icon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
          <button 
            onClick={() => onSelect(TagType.WORK)}
            className="mt-6 text-gray-400 text-sm hover:text-gray-600 underline"
          >
            Dismiss (Log as Work)
          </button>
        </div>
      </div>
    </div>
  );
};
