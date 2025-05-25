# Step 1: Install the necessary dependencies.
npm i

# Step 2: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Deploy to Firebase

This project is configured for deployment to Firebase Hosting. Follow these steps to deploy:

1. **Set up Firebase Configuration**:
   - Copy `.env.example` to `.env`
   - Fill in the Firebase configuration values from your Firebase console

2. **Build the project**:
   ```sh
   npm run build
   ```

3. **Deploy to Firebase**:
   ```sh
   firebase deploy
   ```

After deployment, your app will be available at `https://rentvsbuy-d0ca5.web.app` and `https://rentvsbuy-d0ca5.firebaseapp.com`.

