# YouTube Live Stream Setup Guide

## How to Add Your YouTube Live Stream

The website is already set up to display a YouTube live stream. You just need to update the channel ID.

### Steps:

1. **Find Your YouTube Channel ID:**
   - Go to your YouTube channel
   - Click on your channel icon → Settings → Advanced settings
   - Copy your Channel ID (looks like: `UC-xxxxxxxxxxxxxxxxxxx`)

2. **Update the Website:**
   - Open `index.html`
   - Find this line (around line 60):
   ```html
   src="https://www.youtube.com/embed/live_stream?channel=UC-YOUR-CHANNEL-ID"
   ```
   - Replace `UC-YOUR-CHANNEL-ID` with your actual channel ID

3. **Alternative Method (Using a Specific Video ID):**
   If you have a specific live stream URL, you can use:
   ```html
   src="https://www.youtube.com/embed/VIDEO-ID-HERE"
   ```

### Example URLs:

**For Live Stream:**
```
https://www.youtube.com/embed/live_stream?channel=UCxxxxxxxxxxxxxx
```

**For Specific Video:**
```
https://www.youtube.com/embed/dQw4w9WgXcQ
```

**With Autoplay:**
```
https://www.youtube.com/embed/live_stream?channel=UCxxxxxxxxxxxxxx&autoplay=1
```

### Testing:

1. Save your changes
2. Open `index.html` in a browser
3. The YouTube player should appear in the radio section
4. When you're live, it will show your stream automatically

### Note:

- The embed will show "Video unavailable" when you're not live
- You can hide the YouTube section when not streaming using CSS
- The current setup allows fullscreen and all standard YouTube controls

---

## Photos/Videos

Images from the original site are now integrated:
- Logo in header: ✅
- Conference photos in event cards: ✅
- All images are lazy-loaded for performance

## Navigation

All pages are now working:
- ✅ Home (index.html)
- ✅ About / Jesusislordradio.org (about.html)
- ✅ Library of Messages (library.html)  
- ✅ Repentance & Holiness (repentance.html)

## Next Steps for Production:

1. Add your actual YouTube channel ID
2. Connect real radio stream to play button (if you have a stream URL)
3. Add more photos to photo sections
4. Update event dates and information
5. Test on mobile devices
6. Deploy to your hosting service

Enjoy your new optimized website! 🎉
