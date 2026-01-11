# 🎥 Demo Video Script (2-3 Minutes)

## Recording Setup
- **Duration**: 2-3 minutes
- **Screen Recording**: Use Android screen recorder or ADB screenrecord
- **Audio**: Optional voiceover or text overlays
- **Quality**: 1080p, 30fps minimum

## Script Timeline

### Opening (0:00 - 0:15) - 15 seconds
**Screen**: App launch screen → Home screen loads

**Actions**:
1. Open the app
2. Show loading of trending songs
3. Brief pause to show the UI

**Text Overlay/Narration**:
> "Music Player - A React Native music streaming app using JioSaavn API"

---

### Feature 1: Search (0:15 - 0:35) - 20 seconds
**Screen**: Home screen with search bar

**Actions**:
1. Tap search bar
2. Type "arijit singh"
3. Show search results loading
4. Scroll through results

**Text Overlay/Narration**:
> "Real-time search with pagination support"

---

### Feature 2: Playback (0:35 - 1:00) - 25 seconds
**Screen**: Tap a song → Player screen opens

**Actions**:
1. Tap a song from the list
2. Show player screen opening (modal animation)
3. Song starts playing (show loading → playing)
4. Display album art, song info, controls

**Text Overlay/Narration**:
> "Full-featured player with high-quality audio streaming"

---

### Feature 3: Player Controls (1:00 - 1:30) - 30 seconds
**Screen**: Player screen

**Actions**:
1. **Pause/Play**: Tap pause, then play
2. **Seek**: Drag the seek bar (show time updating)
3. **Skip**: Tap next button (song changes)
4. **Previous**: Tap previous button
5. **Shuffle**: Toggle shuffle (show icon change)
6. **Repeat**: Toggle repeat modes (off → all → one)

**Text Overlay/Narration**:
> "Complete playback controls: play, pause, seek, skip, shuffle, and repeat"

---

### Feature 4: Queue Management (1:30 - 1:50) - 20 seconds
**Screen**: Player screen → Queue screen

**Actions**:
1. Tap queue icon
2. Show queue screen with all songs
3. Highlight current playing song
4. Tap a different song in queue (starts playing)
5. Show remove button (tap to remove a song)
6. Go back to player

**Text Overlay/Narration**:
> "Queue management: view, reorder, and remove songs"

---

### Feature 5: Background Playback (1:50 - 2:05) - 15 seconds
**Screen**: Navigation demonstration

**Actions**:
1. From player, swipe down to go back to home
2. Show mini player persistent at bottom
3. Tap mini player to return to full player
4. Minimize app (go to home screen)
5. Show music still playing in notification/status
6. Return to app

**Text Overlay/Narration**:
> "Background playback with synced mini player across screens"

---

### Feature 6: Queue Persistence (2:05 - 2:20) - 15 seconds
**Screen**: App close and reopen

**Actions**:
1. Close the app completely (swipe away from recents)
2. Reopen the app
3. Show queue restored
4. Show same song at same position
5. Resume playback

**Text Overlay/Narration**:
> "Queue persistence - your music queue is saved and restored"

---

### Closing (2:20 - 2:30) - 10 seconds
**Screen**: Feature list overlay

**Actions**:
1. Show home screen or player
2. Display feature list

**Text Overlay**:
```
✓ Search & Browse
✓ High-Quality Streaming
✓ Full Player Controls
✓ Queue Management
✓ Background Playback
✓ Shuffle & Repeat
✓ Queue Persistence

Built with React Native + TypeScript
State: Zustand | Audio: expo-av
```

---

## Recording Tips

### Before Recording
1. **Clean Device**: Remove notifications, set to Do Not Disturb
2. **Good Internet**: Ensure stable connection for smooth streaming
3. **Prepare Queue**: Have songs pre-loaded for faster demo
4. **Test Run**: Do a practice recording to check timing

### During Recording
1. **Smooth Gestures**: Tap and swipe deliberately, not too fast
2. **Show Loading**: Let loading states display (shows real functionality)
3. **Pause Between**: Brief pause between features for clarity
4. **Landscape/Portrait**: Record in portrait mode (standard for mobile)

### After Recording
1. **Trim**: Cut any mistakes or long waits
2. **Add Overlays**: Use video editor to add text/annotations
3. **Speed Up**: Can speed up long loading sections to 1.5x
4. **Export**: High quality MP4, under 50MB if possible

## Alternative 2-Minute Version

If you need a shorter version, combine sections:

**0:00-0:20**: Intro + Search
**0:20-0:50**: Playback + Controls (combine pause/play/seek/skip)
**0:50-1:20**: Queue + Background playback
**1:20-1:45**: Navigation + Persistence
**1:45-2:00**: Feature list closing

## Tools for Screen Recording

### Android
```bash
# ADB command
adb shell screenrecord /sdcard/demo.mp4
# Stop with Ctrl+C
adb pull /sdcard/demo.mp4
```

### Built-in Recorders
- Samsung: Edge panel → Screen recorder
- Xiaomi: Control center → Screen recorder
- OnePlus: Quick settings → Screen recorder

### Apps
- AZ Screen Recorder (no watermark)
- DU Recorder
- Screen Recorder - No Ads

## Video Editing (Optional)

### Simple Edits
- **Windows**: ClipChamp, DaVinci Resolve (free)
- **Mac**: iMovie, Final Cut Pro
- **Online**: Kapwing, Clipchamp online

### Add These Elements
1. App title at start
2. Feature labels as you demo
3. Technical stack at the end
4. Your name/GitHub link

## Upload Platforms
- **Google Drive**: Share with link
- **YouTube**: Unlisted video
- **Vimeo**: Free account
- **GitHub**: Release section (under 2GB)

## Example Text Overlays

```
[0:00] Music Player - React Native
[0:15] Search with real-time results
[0:35] High-quality audio streaming
[1:00] Complete playback controls
[1:30] Queue management features
[1:50] Background playback support
[2:05] Persistent queue storage
[2:20] Tech Stack: React Native + TypeScript + Zustand + expo-av
```

## Accessibility Notes

Make sure your demo shows:
- Loading indicators working
- Error states (optional, but shows robustness)
- Smooth animations
- Responsive UI
- Real data from API (not mock data)

## Final Checklist
- [ ] App opens without crashes
- [ ] Search returns results
- [ ] Song plays with audio
- [ ] All controls work
- [ ] Background playback works
- [ ] Queue can be managed
- [ ] App restart restores queue
- [ ] Smooth UI animations
- [ ] Clear video quality
- [ ] Under 3 minutes total

Good luck with your demo video! 🎬