import { StrictMode } from "react"; // Loads StrictMode, which helps catch mistakes while developing
import { createRoot } from "react-dom/client"; // Loads the tool that puts React into the page
import { BrowserRouter } from "react-router-dom"; // Loads the router that tracks the address in the browser
import App from "./App.jsx"; // Loads your main component
import "./index.css"; // Loads your styles

createRoot(document.getElementById("root")).render( // Finds the root div in index.html and draws the app inside it
  <StrictMode>
    {/* Turns on the extra development checks */}
    <BrowserRouter>
      {/* Lets every component below use routing */}
      <App />
      {/* Draws your app */}
    </BrowserRouter>
  </StrictMode>
); // Ends the render call