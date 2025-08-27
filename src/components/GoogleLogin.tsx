


import { useGoogleLogin } from '@react-oauth/google';
import { useEmailStore } from '../store/useEmailStore';

export default function GoogleLogin() {
  const setAuthenticated = useEmailStore((s) => s.setAuthenticated);
  const login = useGoogleLogin({
    flow: 'implicit', // no refresh tokens, but good for MVP
    scope: 'https://www.googleapis.com/auth/gmail.readonly openid email profile',
    onSuccess: (tokenResponse) => {
      console.log('Login success:', tokenResponse);
      // tokenResponse contains access_token and expires_in
      setAuthenticated(true, tokenResponse.access_token);
    },
    onError: (err) => {
      console.error('Login failed:', err);
    },
  });

  return (
    <button
      onClick={() => login()}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Sign in with Google
    </button>
  );
}


