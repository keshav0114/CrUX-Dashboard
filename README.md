# CRUX Dashboard

A React application for analyzing website performance using the Chrome UX Report (CRUX) API.

## Features

- Search and analyze performance metrics for any URL
- Support for multiple URLs with aggregate statistics
- Filter and sort performance metrics
- Visual representation of Core Web Vitals data

## Setup and Configuration

### Prerequisites

- Node.js (version 16 or higher)
- npm (version 7 or higher)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### API Key Configuration

To use the CRUX API, you need to obtain a Google API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the "Chrome UX Report API" for your project
4. Create an API key in the "Credentials" section
5. Create a `.env` file in the root of your project and add:

```
VITE_CRUX_API_KEY=your_api_key_here
```

For development purposes, you can use the application with the default mock data that's generated when no API key is provided.

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment on Netlify

### Option 1: Manual Deployment

1. Build your project:
   ```
   npm run build
   ```

2. Install the Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

3. Deploy using the Netlify CLI:
   ```
   netlify deploy
   ```

### Option 2: Continuous Deployment with GitHub

1. Push your repository to GitHub
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Environment Variables on Netlify

1. Go to your site settings in Netlify
2. Navigate to "Build & deploy" > "Environment"
3. Add the environment variable:
   - Key: `VITE_CRUX_API_KEY`
   - Value: Your Google API key

## Usage

1. Enter one or more URLs in the input field
2. Click "Add" to add each URL to the list
3. Click "Search" to fetch performance data
4. View the results in the table
5. Use the filter options to narrow down results
6. Sort columns by clicking on the column headers

## Technologies Used

- React
- Vite
- Material UI
- Axios
