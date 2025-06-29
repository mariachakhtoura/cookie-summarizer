# Cookie Story Summarizer

A Chrome extension that analyzes website cookies and explains them through AI-generated stories.

## What it does

- Scans cookies on any website you visit
- Uses Chrome's built-in AI to create readable explanations
- Shows you what tracking is happening in plain English
- Displays cookie details and privacy insights

## Setup

1. Enable Chrome AI:
   - Go to `chrome://flags/`
   - Search "Prompt API for Gemini Nano"
   - Set to "Enabled" and restart Chrome

2. Install extension:
   - Download this repository
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the folder

3. Use it:
   - Visit any website
   - Click the extension icon
   - Read the cookie analysis summary

## How it works

The extension reads cookies from the current tab, then asks Chrome's AI to write a summary of what's happening with your data.

Works entirely locally - no data leaves your browser.

## Requirements

- Chrome browser with AI features enabled
- No external dependencies

## Development

Run `npm run dev` to open Chrome extensions page for testing.

Source files are in the `src/` directory.
