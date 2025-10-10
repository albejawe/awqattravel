# أوقات للسياحة والسفر (Awqat Travel & Tourism)

## 📱 About The Project

A comprehensive travel and tourism mobile application built with React and Capacitor, offering visa services, travel packages, Umrah bookings, chalet rentals, flight and hotel searches, and an integrated blog.

### ✨ Key Features

- 🛂 **Visa Services**: Apply for visas with automated form submission and WhatsApp notifications
- ✈️ **Travel Packages**: Browse and book travel offers with detailed pricing
- 🕋 **Umrah Services**: Specialized Umrah packages and bookings
- 🏖️ **Chalet Rentals**: Discover and book chalets with image galleries
- 🔍 **Flight & Hotel Search**: Integrated search functionality for flights and hotels
- 📝 **Travel Blog**: Content management system with rich text editing
- 🌐 **Bilingual**: Full support for Arabic and English
- 📱 **Mobile Ready**: Built with Capacitor for iOS and Android deployment
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS and shadcn/ui

### 🔗 Project Links

**Lovable Project**: https://lovable.dev/projects/fd4c9cf4-623b-4224-b7af-7beccf54fc9d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/fd4c9cf4-623b-4224-b7af-7beccf54fc9d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
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

## 🛠️ Technologies

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **React Router** - Client-side routing
- **React Hook Form** - Form management with validation
- **React Query** - Data fetching and state management
- **Lucide React** - Icon library

### Mobile
- **Capacitor 7** - Native iOS and Android deployment
- Cross-platform with native capabilities

### Backend & Services
- **Supabase** - Database, authentication, and storage
- **Edge Functions** - Serverless backend logic
- AI-powered blog content generation
- WhatsApp integration for notifications

### Admin Features
- Blog content management with rich text editor
- Category management
- Bulk import/export functionality
- Flight and hotel search management

## 🚀 Deployment

### Web Deployment
Simply open [Lovable](https://lovable.dev/projects/fd4c9cf4-623b-4224-b7af-7beccf54fc9d) and click on Share -> Publish.

### Mobile Deployment

**Android**
```sh
npm run build
npx cap sync android
npx cap open android
# Build APK/AAB in Android Studio
```

**iOS** (Requires Mac + Xcode)
```sh
npm run build
npx cap sync ios
npx cap open ios
# Build IPA in Xcode
```

## 🌐 Custom Domain

You can connect a custom domain through Project > Settings > Domains.

Read more: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 📄 License

Built with ❤️ using [Lovable](https://lovable.dev)
