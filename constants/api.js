// Central API configuration for the Fursa app
// Change this URL when switching between development and production

// For local development with the Next.js backend:
// - Use your computer's local IP address (not localhost) so the phone can reach it
// - Find your IP with: ifconfig | grep "inet " (macOS) or ip addr (Linux)
// - The Next.js dev server runs on port 3000 by defaul

const API_BASE_URL = "https://fursa-backend-arit.vercel.app";

export default API_BASE_URL;
