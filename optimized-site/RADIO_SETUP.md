# Radio Stream Setup Instructions

## Adding Your Radio Stream URL

The radio player is now configured to play an actual audio stream. To connect it to your real radio station:

### Step 1: Get Your Stream URL

Contact your radio hosting provider or check your radio dashboard to get your stream URL. It should look something like:
- `http://stream.zeno.fm/your-stream-id`
- `http://radio.jesusislordradio.org:8000/stream`
- `https://streams.radio.co/your-station-id/listen`

### Step 2: Update the JavaScript File

Open `script.js` and find this line (around line 9):

```javascript
audioElement = new Audio('http://stream.zeno.fm/your-stream-id');
```

Replace `'http://stream.zeno.fm/your-stream-id'` with your actual stream URL.

### Example:

If your stream URL is `http://radio.jesusislordradio.org:8000/stream`, change it to:

```javascript
audioElement = new Audio('http://radio.jesusislordradio.org:8000/stream');
```

### Step 3: Test the Stream

1. Save the `script.js` file
2. Refresh your website in the browser
3. Click the "Listen Live" button
4. The stream should start playing

### Troubleshooting

**Stream won't play:**
- Verify the stream URL is correct
- Check if the stream URL requires HTTPS (some browsers block HTTP audio on HTTPS sites)
- Make sure your stream server allows cross-origin requests (CORS)
- Check browser console for error messages

**Alternative: Use HTML5 Audio**

If the JavaScript approach doesn't work, you can also add a simple HTML5 audio element to your page and hide the custom button.

## Current Status

✅ Player controls work (play/pause button)
✅ Audio element created and configured
⚠️ Stream URL needs to be updated with actual radio station URL

## Need Help?

Contact your web hosting or radio streaming provider for:
1. Your exact stream URL
2. CORS configuration if needed
3. Alternative streaming options (HLS, DASH, etc.)
