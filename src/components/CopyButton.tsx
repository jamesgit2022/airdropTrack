import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors group ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-[#00E272]" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
      )}
    </button>
  );
};
