import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

export const SetupWizard: React.FC<{ onComplete: (baseUrl: string, modelName: string, apiKey: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [baseUrl, setBaseUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [apiKey, setApiKey] = useState('');

  return (
    <Box flexDirection="column">
      <Text>🚀 Welcome to LiteAgent! Let's set up your agent.</Text>
      
      {step === 0 && (
        <Box>
          <Text>🔗 Enter BASE_URL (e.g. https://api.openai.com/v1): </Text>
          <TextInput value={baseUrl} onChange={setBaseUrl} onSubmit={(v) => { setBaseUrl(v || 'https://api.openai.com/v1'); setStep(1); }} />
        </Box>
      )}

      {step === 1 && (
        <Box>
          <Text>🤖 Enter MODEL_NAME (e.g. gpt-4o): </Text>
          <TextInput value={modelName} onChange={setModelName} onSubmit={(v) => { setModelName(v || 'gpt-4o'); setStep(2); }} />
        </Box>
      )}

      {step === 2 && (
        <Box>
          <Text>🔑 Enter API_KEY: </Text>
          <TextInput value={apiKey} onChange={setApiKey} onSubmit={(v) => { 
            if (v.trim()) {
              onComplete(baseUrl, modelName, v.trim());
            }
          }} />
        </Box>
      )}
    </Box>
  );
};
