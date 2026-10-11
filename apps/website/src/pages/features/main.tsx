import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FeaturesPage } from './features-page';
import '@/app/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FeaturesPage />
  </StrictMode>,
);
