// ============================================================================
// AUTHENTICATION TEST PAGE
// ============================================================================
// Test Supabase authentication directly

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestAuthPage() {
  const [email, setEmail] = useState('raed.jah@reconext.com');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testAuth = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const supabase = createClient();
      
      console.log('🧪 Testing Supabase Auth...');
      console.log('   Email:', email);
      console.log('   Password length:', password.length);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      console.log('📋 Full Response:', { data, error });

      if (error) {
        setResult({
          success: false,
          error: {
            message: error.message,
            status: error.status,
            name: error.name
          }
        });
      } else if (data?.user) {
        setResult({
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email
          }
        });
      } else {
        setResult({
          success: false,
          error: { message: 'No user returned' }
        });
      }
    } catch (err: any) {
      console.error('❌ Test Error:', err);
      setResult({
        success: false,
        error: { message: err.message }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Supabase Auth Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              placeholder="raed.jah@reconext.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              placeholder="Enter password to test"
            />
          </div>

          <button
            onClick={testAuth}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? 'Testing...' : 'Test Authentication'}
          </button>

          {result && (
            <div className={`p-4 rounded-lg border-2 ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-semibold mb-2">
                {result.success ? '✅ Success' : '❌ Failed'}
              </h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Test Cases</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>✅ Correct password: Should succeed</li>
              <li>❌ Wrong password: Should fail with error</li>
              <li>❌ Wrong email: Should fail with error</li>
            </ul>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2">Check Browser Console</h3>
            <p className="text-xs text-yellow-800">
              Open DevTools (F12) → Console tab to see detailed logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

