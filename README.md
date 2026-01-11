# 🎵 React Native Music Player

A feature-rich music streaming application built with React Native (Expo) and TypeScript, using the JioSaavn API.

## ✨ Features

### Core Features
- ✅ Search songs with real-time results
- ✅ Browse trending songs
- ✅ Full-featured music player with controls
- ✅ Background playback support
- ✅ Mini player synchronized with full player
- ✅ Queue management (add, remove, reorder)
- ✅ Queue persistence using AsyncStorage
- ✅ Pagination for search results
- ✅ Loading and error states

### Bonus Features
- ⭐ Shuffle mode
- ⭐ Repeat modes (off, one, all)
- ⭐ Seek functionality with time display
- ⭐ High-quality album artwork
- ⭐ Clean, modern UI design

## 🛠️ Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **Audio Playback**: expo-av
- **HTTP Client**: Axios
- **UI Components**: Custom components with React Native

## 📁 Project Structure

```
music-player/
├── src/
│   ├── api/
│   │   └── jiosaavn.ts          # API client and endpoints
│   ├── components/               # Reusable components
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Search and song list
│   │   ├── PlayerScreen.tsx     # Full music player
│   │   └── QueueScreen.tsx      # Queue management
│   ├── store/
│   │   ├── playerStore.ts       # Player state (Zustand)
│   │   └── queueStore.ts        # Queue state (Zustand)
│   ├── services/
│   │   ├── audioService.ts      # Audio playback logic
│   │   └── storageService.ts    # Persistent storage
│   ├── navigation/
│   │   └── AppNavigator.tsx     # Navigation configuration
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── App.tsx                      # App entry point
├── package.json
└── tsconfig.json
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Physical device or emulator

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd music-player
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npx expo start
```

4. **Run on Android**
```bash
npx expo start --android
```

5. **Run on iOS** (macOS only)
```bash
npx expo start --ios
```

## 📱 Building APK

### Using EAS Build (Recommended)

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure build**
```bash
eas build:configure
```

4. **Build APK**
```bash
eas build -p android --profile preview
```

### Using Expo Build (Legacy)
```bash
expo build:android -t apk
```

## 🏗️ Architecture

### State Management
The app uses **Zustand** for global state management, split into two stores:

1. **PlayerStore**: Manages current song, playback state, position, duration
2. **QueueStore**: Manages queue array, current index, shuffle/repeat logic

### Audio Playback
- Uses `expo-av` Audio.Sound API
- Configured for background playback
- Handles playback callbacks for position updates
- Automatic next song on completion

### Data Persistence
- Queue and current index saved to AsyncStorage
- Restored on app launch
- Updated on every queue modification

### Navigation Flow
```
HomeScreen (Stack)
    ├── PlayerScreen (Modal)
    │   └── QueueScreen (Modal)
```

## 🎯 Key Design Decisions

### Why Zustand over Redux?
- Simpler API with less boilerplate
- Better TypeScript support out of the box
- Smaller bundle size
- Sufficient for this app's complexity

### Why AsyncStorage over MMKV?
- Better Expo compatibility
- Adequate performance for queue data
- Simpler setup and no native modules needed
- MMKV can be added later if performance becomes an issue

### Background Playback Implementation
```typescript
await Audio.setAudioModeAsync({
  staysActiveInBackground: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
});
```

### Sync Between Mini and Full Player
- Both components read from the same Zustand store
- State updates trigger re-renders automatically
- Single source of truth for playback state

## 🐛 Known Limitations & Trade-offs

### Limitations
1. **No offline playback** - Requires active internet connection
2. **No background notifications** - Would require additional expo-notifications setup
3. **Basic queue reordering** - Uses simple list, not drag-and-drop UI

### Trade-offs
1. **AsyncStorage vs MMKV**: Chose AsyncStorage for simplicity and Expo compatibility
2. **No authentication**: JioSaavn API is public, no user accounts
3. **Limited error handling**: Basic error states, could be more comprehensive
4. **No caching**: Songs stream directly, no local caching implemented

## 🧪 Testing Checklist

- [x] Search functionality works
- [x] Songs play with audio
- [x] Background playback continues when app minimized
- [x] Play/pause/skip controls work
- [x] Seek bar updates and seeking works
- [x] Queue persists after app restart
- [x] Shuffle randomizes queue properly
- [x] Repeat modes cycle correctly
- [x] Mini player syncs with full player
- [x] Navigation between screens works
- [x] Loading states display properly
- [x] Error handling for network issues

## 📝 API Endpoints Used

```typescript
GET /api/search/songs?query={query}&page={page}
GET /api/songs/{id}
GET /api/songs/{id}/suggestions
```

## 🎨 UI/UX Features

- Dark theme throughout the app
- Smooth animations and transitions
- Loading indicators for async operations
- Visual feedback for current playing song
- Responsive layout for different screen sizes
- Intuitive controls and navigation

## 🔮 Future Enhancements

- [ ] Download songs for offline playback
- [ ] Create and manage playlists
- [ ] User favorites/likes
- [ ] Lyrics display
- [ ] Audio equalizer
- [ ] Social sharing
- [ ] Recently played history
- [ ] Sleep timer
- [ ] Crossfade between songs

## 📄 License

This project is for educational purposes as part of an assignment.

## 👨‍💻 Developer

Created as part of React Native Intern Assignment

---

**Note**: This app uses the JioSaavn API which may have rate limits or availability constraints. Ensure you have a stable internet connection for the best experience.