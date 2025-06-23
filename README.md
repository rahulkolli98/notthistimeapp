# NotThisTime - Collaborative Shopping List App

A modern, collaborative shopping list application built with React Native, Expo, and Supabase. NotThisTime helps you shop smarter with real-time collaboration, replacement suggestions, and intelligent notifications.

## 🌟 Features

### Core Functionality
- **Create & Manage Lists**: Organize shopping lists by categories (Groceries, Hardware, Pharmacy, etc.)
- **Real-time Collaboration**: Share lists with family and friends with instant updates
- **Smart Shopping Mode**: Enhanced interface for active shopping with status tracking
- **Item Management**: Add items with notes, quantities, and store locations

### Advanced Features
- **Replacement Requests**: When items are out of stock, suggest alternatives to collaborators
- **Push Notifications**: Get notified when collaborators need replacement suggestions
- **Role-based Access**: Owner, Editor, and Member roles with appropriate permissions
- **Invitation System**: Send invitations to registered users via email
- **Search & Filter**: Find lists quickly with intelligent search

### Shopping Statuses
- **Need**: Items to be purchased
- **In Cart**: Items added to shopping cart
- **Bought**: Successfully purchased items
- **Out of Stock**: Items not available (with replacement request option)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator (or physical device)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/notthistime.git
   cd notthistime/notthistimeapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

## 🗄️ Database Setup

### Supabase Configuration

1. **Create a new Supabase project**
2. **Set up the database schema** (tables will be created automatically via the app)
3. **Configure authentication** (Email/Password enabled by default)
4. **Set up Row Level Security (RLS)** policies for data protection

### Required Tables
- `profiles` - User profiles with push tokens
- `lists` - Shopping lists with metadata
- `list_members` - User-list relationships with roles
- `items` - Shopping list items with status tracking
- `replacement_requests` - Out-of-stock replacement suggestions
- `invitations` - List sharing invitations
- `notification_logs` - Push notification tracking

## 📱 Push Notifications Setup

For replacement request notifications, follow the detailed setup guide in `PUSH_NOTIFICATIONS_SETUP.md`.

### Quick Setup:
1. Deploy Supabase Edge Function for notifications
2. Configure webhook in Supabase dashboard
3. Set up Expo push notification credentials
4. Update project ID in `usePushNotifications.ts`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native with Expo SDK 53
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **Push Notifications**: Expo Notifications + Supabase Edge Functions
- **State Management**: React Hooks + Custom hooks
- **Navigation**: Expo Router (file-based routing)

### Project Structure
```
notthistimeapp/
├── app/                    # App screens (Expo Router)
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── list/              # List detail screens
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Supabase client configuration
├── utils/                 # Helper functions
└── assets/               # Images and static files
```

### Key Components
- **Custom Hooks**: Data fetching and state management
- **Real-time Updates**: Automatic UI updates via Supabase subscriptions
- **Component Library**: Consistent UI components with TypeScript
- **Error Handling**: Comprehensive error states and user feedback

## 🔧 Development

### Available Scripts
```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android

# Run tests (if configured)
npm test

# Build for production
npm run build
```

### Code Style
- TypeScript for type safety
- Consistent component patterns
- Custom hooks for data logic
- Styled components with StyleSheet

## 🧪 Testing

### Manual Testing Features
- **List Creation & Management**: Create, edit, delete lists
- **Collaboration**: Invite users, manage roles, real-time updates
- **Shopping Flow**: Add items, change statuses, mark out of stock
- **Replacement Requests**: Request and respond to replacement suggestions
- **Push Notifications**: Test notification delivery

### Test Utilities
- `test-push-notifications.ts` - Push notification testing
- `test-list-deletion.ts` - List deletion flow testing

## 🚀 Deployment

### Expo Build
1. **Configure app.json** with your project details
2. **Build for platforms**:
   ```bash
   # iOS
   eas build --platform ios
   
   # Android
   eas build --platform android
   ```

### Supabase Deployment
1. **Deploy Edge Functions**:
   ```bash
   supabase functions deploy send-replacement-notification
   ```
2. **Configure production environment variables**
3. **Set up webhooks for push notifications**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write descriptive commit messages
- Test features thoroughly before submitting
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** - For the excellent React Native framework
- **Supabase Team** - For the powerful backend-as-a-service platform
- **React Native Community** - For the amazing ecosystem

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/notthistime/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/notthistime/discussions)
- **Email**: your.email@example.com

---

**Built with ❤️ for smarter shopping experiences**
