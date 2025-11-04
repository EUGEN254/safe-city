import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SafeCityContextProvider } from './context/SafeCity.jsx'

const root = createRoot(document.getElementById('root'));

// Function to hide spinner
const hideSpinner = () => {
  const spinner = document.getElementById('global-spinner');
  if (spinner) {
    // Add fade out animation
    spinner.style.transition = 'opacity 0.3s ease';
    spinner.style.opacity = '0';
    setTimeout(() => {
      spinner.style.display = 'none';
    }, 300);
  }
};

// Hide spinner when React is mounted
setTimeout(hideSpinner, 1000); // Fallback: hide after 1 second if something fails

root.render(
  <StrictMode>
    <BrowserRouter>
      <SafeCityContextProvider>
        <App />
      </SafeCityContextProvider>
    </BrowserRouter>
  </StrictMode>
);