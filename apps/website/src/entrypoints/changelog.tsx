import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChangelogPage } from '@/pages/changelog';
import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChangelogPage />
  </StrictMode>,
);
