# Fetch Rewards Client - Dog Adoption Matcher

A modern web application built with Next.js that helps users search for shelter dogs and find their perfect adoption match. This project was developed as part of the Fetch Frontend Take-Home Exercise.

## 🐶 About This Project

This application allows dog lovers to search through a database of shelter dogs with the goal of finding these dogs new homes. Users can browse available dogs, filter by various criteria, add favorites, and ultimately get matched with a dog for adoption.

## 🚀 Features

- **User Authentication**: Secure login with name and email
- **Dog Search**: Browse available shelter dogs with multiple filtering options
  - Filter by breed
  - Sort alphabetically (ascending/descending)
  - Paginated results for better performance
- **Favorites System**: Select and save your favorite dogs
- **Dog Matching**: Generate a match from your list of favorite dogs
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS and Headless UI

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **State Management**: React Context API and TanStack Query
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack React Query
- **Data Display**: TanStack React Table
- **TypeScript**: For type safety and better developer experience

## 🎮 User Flow

1. **Login**: Users authenticate with their name and email
2. **Search**: Browse available dogs with various filtering options
3. **Favorites**: Add dogs to a favorites list
4. **Match**: Generate a match from the favorites list
5. **Success**: View the matched dog and celebrate finding a new furry friend!

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd fetch-client
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables:
   - Create two environment files: `.env.development` and `.env.production`
   - Add the following variables to both files:
     - `NODE_ENV`: Set to "development" or "production" respectively
     - `BASE_URL`: Set to the Fetch API base URL as specified in the [exercise instructions](https://frontend-take-home.fetch.com/)

### Development

Start the development server with TurboPack for faster rebuilds:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

## 📁 Project Structure

- **`src/app`**: Main application pages and components
  - **`_components`**: Shared UI components
  - **`search`**: Search functionality with filters and pagination
  - **`login`**: Authentication components
  - **`logout`**: Logout functionality
- **`src/server`**: Server-side utilities and API handling
- **`src/hooks`**: Custom React hooks for state management
- **`src/types`**: TypeScript type definitions
- **`src/react-query`**: Query configurations for data fetching

## 🚢 Deployment

The application is deployed and can be accessed at: https://fetch-rewards-application.vercel.app

The source code is available at: https://github.com/Gaudet-B/fetch-client
