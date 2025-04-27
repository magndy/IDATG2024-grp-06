// src/pages/HomePage.tsx
import React from 'react'; // Import React

// Define the HomePage component
const HomePage: React.FC = () => {
  // It just returns a simple div for now
  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded">
      <h1 className="text-xl font-semibold">Welcome to the ElectroMart Homepage!</h1>
      <p>This is the placeholder for the home page content.</p>
    </div>
  );
};

// Export the component so App.tsx can import it
export default HomePage;