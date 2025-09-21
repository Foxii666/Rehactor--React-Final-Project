import { useState, useEffect, useRef, useCallback } from 'react';
import supabase from '../supabase/supabase-client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const chatContainer = {
  marginTop: '5px',
  padding: '0px 3px',
  width: '100%',
  height: '50vh',
  overflowY: 'scroll',
  display: 'flex',
  flexDirection: 'column-reverse',
  justifyContent: 'space-between',
};

export default function RealtimeChat({ data }) {
  const [messages, setMessages] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState('');
  const messageRef = useRef(null);
  const scrollSmoothToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };

  const getInitialMessages = useCallback(async () => {
    if (!data?.id) return;
    setLoadingInitial(true);
    const { data: messages, error } = await supabase
      .from('messages')
      .select()
      .eq('game_id', data.id)
      .order('created_at', { ascending: true });
    if (error) {
      setError(error.message);

      return;
    }
    setMessages(messages || []);
    setLoadingInitial(false);
  }, [data?.id]);
  useEffect(() => {
    if (data) {
      getInitialMessages();
    }

    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `game_id=eq.${data?.id}`,
        },
        () => {
          getInitialMessages();
        }
      )

      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [data, getInitialMessages]);

  useEffect(() => {
    scrollSmoothToBottom();
  }, [messages]);
  if (!data) {
    return <div>Loading game data...</div>;
  }
  return (
    <div style={chatContainer} ref={messageRef}>
      {loadingInitial && <progress></progress>}{' '}
      {error && <article style={{ color: 'red' }}>{error}</article>}{' '}
      {messages.length === 0 && !loadingInitial ? (
        <article
          style={{ textAlign: 'center', padding: '20px', color: '#666' }}
        >
          No messages yet. Send the first one!{' '}
        </article>
      ) : (
        messages.map((message) => (
          <article
            key={message.id}
            style={{
              marginBottom: '15px',
              padding: '10px',
              background: '#f5f5f5',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
            }}
          >
            {' '}
            <p
              style={{
                margin: '0 0 5px 0',
                fontWeight: 'bold',
                color: '#007bff',
              }}
            >
              {message.profile_username}{' '}
            </p>{' '}
            <small
              style={{
                display: 'block',
                marginBottom: '5px',
                color: '#333',
              }}
            >
              {message.content}{' '}
            </small>{' '}
            <p
              style={{
                margin: 0,
                fontSize: '0.8em',
                color: '#666',
                textAlign: 'right',
              }}
            >
              {dayjs().to(dayjs(message.created_at))}{' '}
            </p>{' '}
          </article>
        ))
      )}{' '}
    </div>
  );
}
