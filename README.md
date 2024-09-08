# Library Management System Frontend

This is the frontend component of the Library Management System, built with Next.js and React.

## Setup and Installation

1. Ensure you have Node.js 14+ and npm installed on your system.

2. Clone the repository and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file in the frontend directory and add the following:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
   Adjust the URL if your backend is running on a different port or host.

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To create a production build:
   ```bash
   npm run build
   ```
To start the production server:
   ```bash
   npm start
   ```

## Project Structure

- `src/components/`: React components
- `src/pages/`: Next.js pages
- `src/app/`: Next.js app directory (for new layout structure)
- `src/lib/`: Utility functions and helpers
- `src/utils/`: API utility functions

## Development

- The main application component is in `src/components/LibraryManagementSystem.tsx`
- API calls are handled in `src/utils/api.ts`
- To add new features, create new components in the `components` directory and update the main component as needed

## Styling

This project uses Tailwind CSS for styling. The configuration can be found in `tailwind.config.ts`.

## Troubleshooting

If you encounter any issues:
1. Ensure all dependencies are installed correctly
2. Verify that the `.env.local` file is set up with the correct API URL
3. Check the console output in both the terminal and browser developer tools for any error messages

For any additional questions or support, please open an issue in the main repository.