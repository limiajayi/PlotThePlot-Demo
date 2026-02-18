import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'

import { supabase } from './lib/supabase';

// pinging the db
// to see if it works
// it works
supabase.from('media').select('*').eq('id', 1).then(({ data, error }) => {
    console.log('db reachable:', data);
    console.log('error:', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
