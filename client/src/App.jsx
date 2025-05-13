import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useLogprobsQuery from './useLogprobsQuery';
import './App.css';

const queryClient = new QueryClient();

function PredictionsBarChart({ model_output, other_paths }) {
  if (!model_output && !other_paths) return null;
  return (
    <div style={{ marginTop: 32 }}>
      <h4 style={{ marginBottom: 8, color: '#444' }}>Predicted Output:</h4>
      <div style={{ fontSize: 20, fontWeight: 600, color: '#1976d2', marginBottom: 24 }}>{model_output}</div>
      <h4 style={{ marginBottom: 16, color: '#444' }}>Other Predicted Tokens:</h4>
      <div>
        {other_paths && other_paths.map((prediction, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ minWidth: 80, fontFamily: 'monospace', fontSize: 16 }}>{prediction.text}</span>
            <div style={{
              height: 18,
              width: `${Math.max(5, Math.round(prediction.prob * 300))}px`,
              background: 'linear-gradient(90deg, #1976d2 60%, #90caf9 100%)',
              borderRadius: 6,
              margin: '0 12px',
              transition: 'width 0.3s',
            }} />
            <span style={{ fontSize: 15, color: '#555', minWidth: 48 }}>{(prediction.prob * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [debouncedPrompt, setDebouncedPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.5);
  const [debouncedTemperature, setDebouncedTemperature] = useState(0.5);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPrompt(prompt);
    }, 400);
    return () => clearTimeout(handler);
  }, [prompt]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTemperature(temperature);
    }, 400);
    return () => clearTimeout(handler);
  }, [temperature]);

  const { data: predictions = {}, isLoading, error } = useLogprobsQuery(debouncedPrompt, debouncedTemperature);

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleTempChange = (e) => {
    setTemperature(parseFloat(e.target.value));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ background: '#f6f8fa', minHeight: '100vh', padding: 32 }}>
        <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
          <h2 style={{ marginBottom: 24, color: '#222' }}>LLM Token Predictor</h2>
          <input
            type="text"
            value={prompt}
            onChange={handleChange}
            placeholder="Type your prompt..."
            style={{ width: '100%', padding: 12, fontSize: 18, borderRadius: 8, border: '1px solid #ddd', marginBottom: 24 }}
          />
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="temperature-slider" style={{ marginRight: 12, fontWeight: 500, color: '#444' }}>Temperature:</label>
            <input
              id="temperature-slider"
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={temperature}
              onChange={handleTempChange}
              style={{ verticalAlign: 'middle', width: 180 }}
            />
            <span style={{ marginLeft: 12, fontFamily: 'monospace', fontSize: 16 }}>{temperature.toFixed(2)}</span>
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>Failed to fetch predictions</p>}
          {predictions.model_output && (
            <PredictionsBarChart model_output={predictions.model_output} other_paths={predictions.other_paths} />
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
