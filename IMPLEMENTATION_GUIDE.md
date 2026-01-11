# 🚀 Implementation Guide

## Step-by-Step Implementation

### Phase 1: Project Setup (30 minutes)

1. **Create Project**
```bash
npx create-expo-app music-player -t expo-template-blank-typescript
cd music-player
```

2. **Install Dependencies**
```bash
# Core dependencies
npx expo install expo-av expo-file-system @react-native-async-storage/async-storage

# Navigation
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

# State management and HTTP
npm install zustand axios

# UI components
npx expo install @react-native-community/slider @expo/vector-icons
```

3. **Create Folder Structure**
```bash
mkdir -p src/{api,components,screens,store,services,navigation,types,utils}
```

### Phase 2: Core Setup (1 hour)

1. **Create Types** (`src/types/index.ts`)
   - Define Song, Album, Artist interfaces
   - Create response types
   - Add navigation types

2. **Setup API Client** (`src/api/jiosaavn.ts`)
   - Configure axios instance
   - Create API methods
   - Add error handling

3. **Create Stores** (`src/store/`)
   - playerStore: current song, playback state
   - queueStore: queue management, persistence

### Phase 3: Audio Service (1-2 hours)

1. **Audio Service** (`src/services/audioService.ts`)
   - Initialize expo-av
   - Implement play/pause/seek
   - Handle next/previous logic
   - Setup status callbacks

2. **Storage Service** (`src/services/storageService.ts`)
   - Queue save/load
   - AsyncStorage operations

### Phase 4: UI Implementation (3-4 hours)

1. **Home Screen**
   - Search bar with debouncing
   - Song list with FlatList
   - Loading states
   - Pagination

2. **Player Screen**
   - Album artwork display
   - Playback controls
   - Seek slider
   - Shuffle/repeat buttons

3. **Queue Screen**
   - Queue list
   - Remove functionality
   - Current song indicator

4. **Navigation**
   - Stack navigator setup
   - Modal presentation
   - Screen transitions

### Phase 5: Testing & Polish (2-3 hours)

1. **Test Core Features**
   - Search and playback
   - Background audio
   - Queue persistence
   - Navigation flow

2. **Add Polish**
   - Loading indicators
   - Error messages
   - Empty states
   - Smooth animations

## 🔧 Common Issues & Solutions

### Issue 1: Audio Not Playing

**Problem**: Songs don't play when tapped

**Solutions**:
```typescript
// Ensure audio mode is set correctly
await Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
});

// Check download URL is valid
const downloadUrl = song.downloadUrl.find(d => d.quality === '320kbps');
console.log('Loading URL:', downloadUrl?.link || downloadUrl?.url);
```

### Issue 2: Background Playback Not Working

**Problem**: Music stops when app is minimized

**Solutions**:

1. **Update app.json**:
```json
{
  "ios": {
    "infoPlist": {
      "UIBackgroundModes": ["audio"]
    }
  },
  "android": {
    "permissions": [
      "android.permission.FOREGROUND_SERVICE"
    ]
  }
}
```

2. **Set audio mode on app start**:
```typescript
useEffect(() => {
  audioService.initialize();
}, []);
```

### Issue 3: Queue Not Persisting

**Problem**: Queue clears on app restart

**Solution**:
```typescript
// In App.tsx
useEffect(() => {
  const loadPersistedData = async () => {
    await useQueueStore.getState().loadQueue();
  };
  loadPersistedData();
}, []);
```

### Issue 4: Slider Not Updating

**Problem**: Seek slider doesn't move with playback

**Solution**:
```typescript
// Update position in onPlaybackStatusUpdate callback
const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
  if (status.isLoaded) {
    usePlayerStore.getState().setPosition(status.positionMillis / 1000);
  }
};
```

### Issue 5: Navigation Type Errors

**Problem**: TypeScript errors with navigation

**Solution**:
```typescript
// Define proper types
export type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Queue: undefined;
};

// Use typed navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
```

### Issue 6: Images Not Loading

**Problem**: Album artwork doesn't display

**Solution**:
```typescript
// Handle multiple image quality options
const getImageUrl = (images: ImageQuality[]) => {
  const preferredQuality = images.find(img => img.quality === '500x500');
  return preferredQuality?.link || preferredQuality?.url || images[0]?.link || '';
};
```

### Issue 7: Search Debouncing

**Problem**: Too many API calls while typing

**Solution**:
```typescript
const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery) {
      searchSongs(searchQuery);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [searchQuery]);
```

## 📊 Performance Optimization Tips

### 1. Use FlatList Optimizations
```typescript
<FlatList
  data={songs}
  renderItem={renderSongItem}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
/>
```

### 2. Memoize Components
```typescript
const SongCard = React.memo(({ song, onPress }) => {
  // Component code
});
```

### 3. Optimize Images
```typescript
<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode="cover"
  defaultSource={require('./placeholder.png')}
/>
```

### 4. Debounce Expensive Operations
```typescript
import { useMemo, useCallback } from 'react';

const debouncedSearch = useMemo(
  () => debounce((query) => searchSongs(query), 300),
  []
);
```

## 🎯 Testing Checklist

### Functional Testing
- [ ] Search returns results
- [ ] Tapping song plays audio
- [ ] Play/pause button works
- [ ] Skip forward/backward works
- [ ] Seek slider updates position
- [ ] Queue shows all songs
- [ ] Removing from queue works
- [ ] Shuffle randomizes queue
- [ ] Repeat modes cycle correctly

### Background Testing
- [ ] Audio continues when app minimized
- [ ] Audio continues when screen locks
- [ ] Controls work from background
- [ ] Audio stops when another app plays

### Persistence Testing
- [ ] Queue saved on app close
- [ ] Queue restored on app open
- [ ] Current index maintained
- [ ] Settings persist

### Edge Cases
- [ ] Empty search results
- [ ] No internet connection
- [ ] API errors handled
- [ ] End of queue behavior
- [ ] Empty queue state

## 🏗️ Architecture Best Practices

### 1. Separation of Concerns
```
UI Layer (Screens/Components)
    ↓
Store Layer (Zustand)
    ↓
Service Layer (audioService, storageService)
    ↓
API Layer (jiosaavn.ts)
```

### 2. Single Source of Truth
- All playback state in playerStore
- All queue data in queueStore
- No component-level state for shared data

### 3. Error Boundaries
```typescript
try {
  await audioService.loadAndPlay(song);
} catch (error) {
  console.error('Playback error:', error);
  Alert.alert('Error', 'Failed to play song');
}
```

### 4. Type Safety
```typescript
// Always define proper types
interface Song {
  id: string;
  name: string;
  // ... other fields
}

// Use type guards
const isSong = (obj: any): obj is Song => {
  return typeof obj.id === 'string' && typeof obj.name === 'string';
};
```

## 📦 Building for Production

### 1. Configure EAS Build

Create `eas.json`:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### 2. Build Commands
```bash
# Preview APK
eas build -p android --profile preview

# Production AAB
eas build -p android --profile production
```

### 3. Testing APK
1. Download APK from build page
2. Transfer to Android device
3. Enable "Install from Unknown Sources"
4. Install and test thoroughly

## 🎓 Learning Resources

- [React Navigation Docs](https://reactnavigation.org/)
- [Expo Audio Docs](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Native Performance](https://reactnative.dev/docs/performance)

## 💡 Pro Tips

1. **Start Simple**: Get basic playback working first, then add features
2. **Test on Device**: Background audio behavior differs on real devices
3. **Use Console Logs**: Debug audio state changes extensively
4. **Handle Errors**: Network requests can fail, always have fallbacks
5. **Keep State Minimal**: Only store what's necessary in global state
6. **Documentation**: Comment complex logic, especially audio callbacks

## 🐛 Debugging Tools

```typescript
// Add debug logging
const audioService = {
  async play() {
    console.log('[AudioService] Playing:', this.sound?._loaded);
    // ... rest of code
  }
};

// Monitor Zustand state
usePlayerStore.subscribe((state) => {
  console.log('[PlayerStore]', state);
});

// Log API responses
axios.interceptors.response.use(response => {
  console.log('[API Response]', response.config.url, response.status);
  return response;
});
```

Good luck with your implementation! 🚀