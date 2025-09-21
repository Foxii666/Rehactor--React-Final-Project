import { createContext } from 'react';

const SessionContext = createContext({
  session: null,
  isLoading: false,
  signOut: () => {},
});

export default SessionContext;
