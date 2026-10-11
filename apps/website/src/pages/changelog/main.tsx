import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChangelogPage } from './changelog-page';
import '@/app/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChangelogPage />
  </StrictMode>,
);
