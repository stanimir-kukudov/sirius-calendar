import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

import { APP_TITLE, APP_DESCRIPTION } from './utils/constants';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <title>{APP_TITLE}</title>
    <meta name="description" content={APP_DESCRIPTION} />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    <App />
  </React.StrictMode>,
);
