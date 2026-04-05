import React, { useEffect, useState } from 'react';
from ".../vibe-check/modal/inference.py" import 
const HighlightHandler = () => {
  const [selectedText, setSelectedText] = useState('');
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString();
      
      if (text) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // --- Call your other function here ---
        handleExternalExtension(text);
        
        setSelectedText(text);
        setMenuPos({
          top: rect.top + window.scrollY - 30, // Adjust position
          left: rect.left + window.scrollX + rect.width / 2,
        });
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleExternalExtension = (text) => {
    console.log("Processed by extension:", text);
    // Add custom logic here
  };

  return (
    <div>
      <p>Highlight some text in this sentence to trigger the function.</p>
      {selectedText && (
        <div style={{
          position: 'absolute',
          top: `${menuPos.top}px`,
          left: `${menuPos.left}px`,
          background: 'black',
          color: 'white',
          padding: '5px',
          borderRadius: '4px',
          zIndex: 10
        }}>
          Action: {selectedText.length} chars
        </div>
      )}
    </div>
  );
};
export default HighlightHandler;
