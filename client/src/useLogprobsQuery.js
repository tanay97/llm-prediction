import { useQuery } from '@tanstack/react-query';

const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '8000';
const BACKEND_URL = `http://0.0.0.0:${BACKEND_PORT}`;

function useLogprobsQuery(prompt, temperature) {
  return useQuery({
    queryKey: ['logprobs', prompt, temperature],
    queryFn: async () => {
      if (!prompt) return [];
      const res = await fetch(`${BACKEND_URL}/logprobs?prompt=${encodeURIComponent(prompt)}&temperature=${encodeURIComponent(temperature)}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data;
    },
    enabled: !!prompt,
    staleTime: 0,
  });
}

export default useLogprobsQuery; 