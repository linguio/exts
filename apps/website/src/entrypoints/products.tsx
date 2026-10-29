import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FeaturesPage } from '@/pages/products';
import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FeaturesPage />
  </StrictMode>,
);
