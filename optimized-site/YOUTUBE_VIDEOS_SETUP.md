# YouTube Automatic Video Feed Setup

## Overview

The "Latest Updates" section now automatically fetches the 4 most recent videos from your YouTube channel **@repentpreparetheway** using the YouTube Data API v3.

## Setup Instructions

### Step 1: Get a YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **YouTube Data API v3**:
   - Click "Enable APIs and Services"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Click "Create Credentials"
   - Select "API Key"
   - Copy the generated API key

### Step 2: Configure the API Key

1. Open `script.js`
2. Find the `YOUTUBE_CONFIG` section at the top
3. Replace `YOUR_YOUTUBE_API_KEY_HERE` with your actual API key:

```javascript
const YOUTUBE_CONFIG = {
    apiKey: 'AIzaSyC-your-actual-api-key-here', // Replace with your key
    channelId: 'UCyOKv_cPBDjBKcASt2fRCcA', // Already set to @repentpreparetheway
    maxResults: 4
};
```

### Step 3: Test the Integration

1. Open `index.html` in your browser
2. Scroll to the "Latest Updates" section
3. You should see the 4 most recent videos from your channel automatically loaded
4. Check browser console (F12) for any errors

## How It Works

- **Automatic Updates**: The page fetches fresh videos every time someone visits
- **No Manual Updates**: You don't need to update the HTML anymore
- **Latest First**: Videos are automatically sorted by publish date
- **YouTube Thumbnails**: Uses the official high-quality YouTube thumbnails
- **Clickable Cards**: Each card links directly to the YouTube video

## Customization Options

### Change Number of Videos

In `script.js`, modify `maxResults`:

```javascript
const YOUTUBE_CONFIG = {
    apiKey: 'YOUR_KEY',
    channelId: 'UCyOKv_cPBDjBKcASt2fRCcA',
    maxResults: 6  // Change to show more or fewer videos
};
```

### API Quota Information

- YouTube Data API has a daily quota limit (10,000 units per day by default)
- Each page load uses approximately 100 units
- This allows ~100 page loads per day
- For higher traffic, you may need to implement caching

## Troubleshooting

### Videos Not Showing

1. Check browser console (F12) for error messages
2. Verify your API key is correct
3. Ensure YouTube Data API v3 is enabled in Google Cloud Console
4. Check that your YouTube channel is public

### API Quota Exceeded

If you exceed the daily quota:
1. Wait 24 hours for quota to reset
2. Request quota increase in Google Cloud Console
3. Implement server-side caching to reduce API calls

## Fallback Option

If you prefer not to use the YouTube API, you can manually edit the video cards in `index.html` as before. Just remove or comment out the `initYouTubeVideos()` call in `script.js`.

---

**Channel**: @repentpreparetheway  
**Channel ID**: UCyOKv_cPBDjBKcASt2fRCcA
