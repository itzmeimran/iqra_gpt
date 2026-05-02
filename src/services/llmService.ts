import type { Message } from '../types';

const MOCK_RESPONSES = [
  "Great question! I'm GenAI, your intelligent assistant. I'm currently running in demo mode — connect a real LLM API key to get live responses.",
  "I understand you're looking for help with that. In production mode I'd query a live model like Claude or GPT-4. For now, here's a placeholder response.",
  "That's an interesting topic! Once you integrate a backend with your preferred LLM provider, I'll be able to give you much richer answers.",
  "I'm processing your request. This is the mock service — real inference would happen via your backend endpoint or directly via the Anthropic/OpenAI SDK.",
  "Thanks for chatting! To enable full AI capabilities, add your API credentials in `src/services/llmService.ts` or wire up a backend.",
];

class LLMService {
  /**
   * Stream a response chunk-by-chunk.
   * Replace the body with a real fetch to your backend or Anthropic API.
   */
  async streamResponse(
    _messages: Message[],
    onChunk: (chunk: string) => void
  ): Promise<void> {
    // ── MOCK MODE ──────────────────────────────────────────────────────────
    const response =
      MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    const words = response.split(' ');
    for (const word of words) {
      await new Promise((res) => setTimeout(res, 40 + Math.random() * 60));
      onChunk(word + ' ');
    }
    // ── REAL MODE (example) ────────────────────────────────────────────────
    // const res = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
    //     'anthropic-version': '2023-06-01',
    //   },
    //   body: JSON.stringify({
    //     model: 'claude-sonnet-4-20250514',
    //     max_tokens: 1024,
    //     stream: true,
    //     messages: _messages.map(m => ({ role: m.role, content: m.content })),
    //   }),
    // });
    // Handle SSE stream...
  }
}

export const llmService = new LLMService();
