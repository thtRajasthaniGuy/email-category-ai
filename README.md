# Smart Email Categorizer - Setup Instructions

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Google Cloud Console** account
3. **OpenAI API** account

## 1. Google Cloud Console Setup

### Step 1: Create a Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### Step 2: Enable APIs
1. Go to **APIs & Services** → **Library**
2. Search for and enable:
   - **Gmail API**
   - **Google+ API** (for authentication)

### Step 3: Create Credentials

#### OAuth 2.0 Client ID:
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Choose **Web application**
4. Add your domain to **Authorized JavaScript origins**:
   - `http://localhost:5173` (for development)
   - Your production domain
5. Add redirect URIs:
   - `http://localhost:5173` (for development)
   - Your production domain
6. Copy the **Client ID**

#### API Key:
1. Click **Create Credentials** → **API key**
2. Restrict the key to **Gmail API** only
3. Copy the **API Key**

### Step 4: Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Fill in the required fields
3. Add scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
4. Add test users (if in testing mode)

## 2. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or log in
3. Go to **API Keys** section
4. Create a new API key
5. Copy the key (starts with `sk-`)

## 3. Project Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Configuration
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your credentials in `.env`:
```env
VITE_OPENAI_KEY=sk-your_openai_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### Step 3: Update Configuration
In `components/GoogleLogin.tsx`, update:
```typescript
const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || "your_client_id";
const API_KEY = process.env.VITE_GOOGLE_API_KEY || "your_api_key";
```

## 4. Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 5. Troubleshooting

### Common Issues:

#### CORS Errors
- Make sure your domain is added to Google Cloud Console authorized origins
- Verify API key restrictions are set correctly

#### Authentication Fails
- Check OAuth consent screen configuration
- Ensure test users are added if in testing mode
- Verify redirect URIs match exactly

#### API Rate Limits
- OpenAI has rate limits on API calls
- Gmail API has quotas - check your usage in Google Cloud Console

#### Environment Variables Not Loading
- Make sure `.env` file is in the root directory
- Restart the development server after changing `.env`
- Variables must start with `VITE_` to be accessible in the browser

### Debug Mode
Add this to see API responses:
```typescript
// In GoogleLogin.tsx
console.log('Gmail API Response:', response);
console.log('OpenAI Response:', data);
```

## 6. Deployment Considerations

### Environment Variables
- Set environment variables in your hosting platform
- Never commit `.env` files to version control

### Domain Configuration
- Update Google Cloud Console with production domains
- Update CORS settings for production

### Security
- Implement proper error handling
- Consider implementing user session management
- Monitor API usage and costs

## 7. File Structure

```
src/
├── components/
│   ├── EmailCard.tsx      # Individual email display
│   ├── EmailList.tsx      # Email list with filtering
│   └── GoogleLogin.tsx    # Gmail authentication
├── services/
│   ├── categorizeEmail.ts # AI categorization
│   ├── summarizeEmail.ts  # AI summarization
│   └── processEmail.ts    # Email processing pipeline
├── store/
│   └── useEmailStore.ts   # Zustand state management
├── lib/
│   └── prompts.ts         # AI prompts
├── utils/
│   └── categories.ts      # Category definitions
└── App.tsx                # Main application
```

## 8. API Costs

### OpenAI API
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- Estimated cost: $0.01-0.05 per email processed

### Gmail API
- Free tier: 1 billion API calls per day
- Usually sufficient for personal use

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all API keys are correctly set
3. Check Google Cloud Console for API quotas
4. Review OpenAI API usage and billing