# Berrionaire: The Future of Strategic Wealth

Berrionaire is a premium, high-performance wealth management and strategic intelligence platform. Designed for the elite, it combines sophisticated data visualization, AI-driven intelligence, and secure collaborative tools to provide a comprehensive view of your strategic landscape.

## Features

- **Strategic Dashboard:** A bento-grid layout providing a high-level overview of pending requests, user activity, and key metrics.
- **AI Intelligence:** Advanced analytical tools powered by Gemini for strategic foresight and secure analysis.
- **Portfolio Management:** Detailed asset tracking and 7-year wealth projections with interactive charts.
- **Secure Synergy:** Collaborative tools for strategic meetings and real-time coordination.
- **Premium UI:** A glassmorphic, dark-themed interface built with Tailwind CSS and Framer Motion.

## Deployment

### GitHub Pages
This project is configured for automated deployment to GitHub Pages via GitHub Actions.

1.  **Export to GitHub:** Use the "Export to GitHub" feature in AI Studio.
2.  **Configure Repository:**
    -   Go to your GitHub repository **Settings > Pages**.
    -   Under **Build and deployment > Source**, select **GitHub Actions**.
3.  **Vite Base Path:**
    -   If your repository is not at a root domain (e.g., `https://<username>.github.io/<repo-name>/`), you must update `vite.config.ts`:
        ```ts
        export default defineConfig({
          base: '/<repo-name>/',
          // ...
        });
        ```
4.  **Push to main:** The `deploy.yml` workflow will automatically build and deploy your site whenever you push to the `main` branch.

### Firebase
If you have configured Firebase:
1.  **Deploy Rules:** Use the `deploy_firebase` tool in AI Studio to sync your Security Rules.
2.  **Hosting:** You can also deploy to Firebase Hosting by running `firebase deploy` from your local environment after exporting.

## Environment Variables
Ensure you set the following environment variables in your GitHub repository secrets if you plan to use them in your CI/CD pipeline:
- `GEMINI_API_KEY`: Your Google Gemini API key.

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database/Auth:** Firebase (Firestore & Auth)
- **Charts:** Recharts
- **Icons:** Lucide React
