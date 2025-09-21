import { useContext, useRef } from 'react';
import SessionContext from '../context/SessionContext';
import supabase from '../supabase/supabase-client';
import RealtimeChat from './RealtimeChat';

export default function Chatbox({ data }) {
  const { session } = useContext(SessionContext);
  const formRef = useRef(null); // form için ref

  const handleSendMessageSubmit = async (event) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const message = formData.get('message');

    if (typeof message === 'string' && message.trim().length !== 0) {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            profile_id: session?.user.id,
            profile_username:
              session?.user.user_metadata.username || session?.user.email,
            game_id: data.id,
            content: message.trim(),
          },
        ])
        .select();

      if (error) {
        console.error('Mesaj gönderilemedi:', error);
      } else {
        form.reset(); // güvenli reset
      }
    }
  };

  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        margin: '20px 0',
        background: '#f8f9fa',
      }}
    >
      <h4 style={{ margin: '0 0 16px 0', color: '#333' }}>Gamers Chat</h4>

      <form ref={formRef} onSubmit={handleSendMessageSubmit}>
        <fieldset
          role="group"
          style={{
            display: 'flex',
            gap: '8px',
            border: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          <input
            type="text"
            name="message"
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#333',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#1f2937',
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Send
          </button>
        </fieldset>
      </form>

      {/* RealtimeChat komponentini buraya ekle */}
      <RealtimeChat data={data} />
    </div>
  );
}
