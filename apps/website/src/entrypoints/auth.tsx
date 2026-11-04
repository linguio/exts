import { createRoot } from 'react-dom/client';
import { AuthPage } from '@/pages/auth';
import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(<AuthPage />);
