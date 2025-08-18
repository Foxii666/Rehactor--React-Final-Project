import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import supabase from '../supabase/supabase-client';

function LogoutButton({ setSession }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Errore durante il logout: ' + error.message);
      return;
    }
    setSession(null);
    navigate('/');
  };

  return <button onClick={handleLogout}>Logout</button>;
}

function Navbar() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="flex justify-between">
      <h2>
        <Link to="Homepage">GameHub</Link>
      </h2>
      {session ? (
        <>
          <ul className="flex justify-center">
            <li className="mx-2">
              <span>Ciao, {session.user.email}</span>
            </li>
            <li className="mx-2">
              <LogoutButton setSession={setSession} />
            </li>
          </ul>
        </>
      ) : (
        <>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
}

export default Navbar;
