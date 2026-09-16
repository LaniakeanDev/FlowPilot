'use client';

// FlowPilot - AI Chat Sidebar Component (Placeholder for MVP)

import { useState } from 'react';
import { useOptimization } from '../context/PlanningContext';

export default function AIChatSidebar() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string; timestamp: Date }>>([]);
  const { runOptimization, optimizationResult, isOptimizing } = useOptimization();

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      // Generate mock response
      const aiResponse = generateMockResponse(inputValue);
      const aiMessage = {
        role: 'ai' as const,
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Generate mock AI response based on user input
   */
  function generateMockResponse(input: string): string {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('optimize') || lowerInput.includes('best') || lowerInput.includes('route')) {
      return `I've analyzed your current assignments and found potential optimizations. Running optimization algorithm to find the best routes...`;
    }

    if (lowerInput.includes('truck') || lowerInput.includes('capacity')) {
      return `Based on current data, you have 10 trucks with capacity for 10 cars each. Some trucks may be underutilized. Would you like me to suggest reassignments?`;
    }

    if (lowerInput.includes('car') || lowerInput.includes('vin')) {
      return `I can see you have 30 cars to deliver across multiple locations. Would you like me to help with specific assignments?`;
    }

    if (lowerInput.includes('distance') || lowerInput.includes('cost')) {
      return `Currently optimizing for minimal distance. Total distance can be reduced by approximately 15-20% with optimal routing.`;
    }

    return `I understand you're looking for optimization suggestions. I can help analyze your current assignments and propose improvements. Try asking about "optimizing routes" or "truck capacity".`;
  }

  // Format time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">AI</span>
          </div>
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <p className="text-xs text-blue-100 mt-1">Optimization suggestions and insights</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-sm">Ask me for optimization suggestions</p>
            <p className="text-xs mt-1">Example: "Optimize routes for minimal distance"</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'ai' && (
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-blue-600 font-bold">AI</span>
                </div>
              )}
              <div
                className={`max-w-[200px] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-right mt-1 opacity-60">
                  {formatTime(message.timestamp)}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-blue-600 font-bold">U</span>
                </div>
              )}
            </div>
          ))
        )}

        {isOptimizing && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span>Optimizing routes...</span>
          </div>
        )}
      </div>

      {/* Optimization Result Display */}
      {optimizationResult && (
        <div className="p-3 border-t border-gray-200 bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h4 className="font-semibold text-blue-800">Optimization Complete</h4>
          </div>
          <p className="text-sm text-blue-700 mb-2">
            Total distance: {optimizationResult.totalDistance.toFixed(1)} km
          </p>
          {optimizationResult.savings > 0 && (
            <p className="text-sm text-green-600 font-medium">
              +{optimizationResult.savings.toFixed(1)} km saved!
            </p>
          )}
          {optimizationResult.unassignedCars.length > 0 && (
            <p className="text-sm text-orange-600 mt-1">
              {optimizationResult.unassignedCars.length} cars unassigned
            </p>
          )}
          <button
            onClick={runOptimization}
            className="mt-2 w-full py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Re-optimize
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for optimization suggestions..."
            className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
