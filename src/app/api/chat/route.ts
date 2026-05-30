import { NextRequest, NextResponse } from 'next/server';
import { orchestrateChat } from '@/lib/chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage?.content || typeof latestMessage.content !== 'string') {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    const reply = await orchestrateChat(latestMessage.content);
    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error('[/api/chat]', error);
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
}
