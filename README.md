# Rig Ecosystem Dashboard

A comprehensive visual dashboard showcasing the growth, adoption, and ecosystem metrics for the Rig framework and Arc ecosystem.

![Rig Ecosystem Dashboard](https://placeholder-for-dashboard-screenshot.com/screenshot.png)

## Overview

The Rig Ecosystem Dashboard is designed for investors and stakeholders to get a clear view of the current state, growth trajectory, and ecosystem development around the Rig framework and Arc. It presents key metrics, partnerships, and projects in an intuitive, visually appealing format.

## Features

- **GitHub Star Growth Tracking**: Historical growth trajectory with interactive time period selection
- **Key Metrics Visualization**: Contributors, active adoption, and star velocity stats
- **Enterprise Partners & Integrations**: Visual showcase of official partnerships and integrations
- **Arc Ecosystem Projects**: Detailed display of live projects within the Arc ecosystem
- **Community & Achievements**: Highlights of community size and ecosystem milestones
- **Ryzome - The Agentic App Store**: Vision and roadmap for the Ryzome platform

## Technologies Used

- **HTML5/CSS3** with Tailwind CSS for styling
- **JavaScript** for interactive elements
- **Google Charts** for data visualization
- **PapaParse** for CSV parsing

## Getting Started

### Prerequisites

- A modern web browser
- Basic web server (optional for local development)

### Running Locally

1. Clone this repository
```
git clone https://github.com/yourusername/ecosystem_stats.git
```

2. Navigate to the project directory
```
cd ecosystem_stats
```

3. Either:
   - Open `index.html` directly in your browser, or
   - Serve it using a simple HTTP server:
     ```
     python -m http.server 8000
     ```
     Then visit `http://localhost:8000` in your browser

### Hosting on Vercel

This dashboard can be easily deployed on Vercel for fast, global hosting:

1. Push your repository to GitHub
2. Go to [Vercel](https://vercel.com/) and sign up/login (you can use your GitHub account)
3. Click "Add New" and select "Project"
4. Import your GitHub repository (you may need to install the Vercel GitHub app first)
5. Configure project settings:
   - Framework Preset: Select "Other" (static HTML)
   - Build and Output Settings: Leave defaults
   - Environment Variables: Add any if needed
6. Click "Deploy"

Your dashboard will be deployed and accessible at a Vercel URL (e.g., `ecosystem-stats.vercel.app`).

For a custom domain:
1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your custom domain (e.g., `ecosystem-stats.arc.fun`)
4. Follow Vercel's instructions to set up the required DNS records (typically a CNAME record)

## Project Structure

- `index.html` - Main dashboard layout and content
- `dashboard.js` - JavaScript for dashboard interactivity and chart rendering
- `styles.css` - Custom styles beyond Tailwind
- `logos/` - Directory containing partner and project logos
- `stars_data.csv` - Historical GitHub star data

## Customizing the Dashboard

To update the dashboard with new data:

1. Replace `stars_data.csv` with updated GitHub star metrics
2. Update partner logos in the `logos/` directory
3. Modify project details in the Arc Ecosystem section as needed

## License

[MIT License](LICENSE)

## Contact

For more information about Rig and Arc:
- Rig Framework: [https://github.com/0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig)
- Arc Ecosystem: [https://www.arc.fun/](https://www.arc.fun/)
- Ryzome Waitlist: [https://www.arc.fun/ryzome-waitlist](https://www.arc.fun/ryzome-waitlist)
