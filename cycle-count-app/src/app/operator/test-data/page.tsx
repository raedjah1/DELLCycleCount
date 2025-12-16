// ============================================================================
// TEST DATA GENERATOR - Create sample data for testing operator workflows
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { SampleDataGenerator } from '@/lib/utils/sampleData';

export default function TestDataPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [generating, setGenerating] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<string>('');

  const generateTestData = async () => {
    if (!user?.id) {
      setResult('Error: No user found. Please log in first.');
      return;
    }

    try {
      setGenerating(true);
      setResult('Generating test data...');
      
      const data = await SampleDataGenerator.generateCompleteTestData(user.id);
      
      setResult(`
✅ Test data generated successfully!

📍 ${data.locations.length} locations created
📦 ${data.items.length} items created  
📋 ${data.plans.length} count plans created
📝 Journal "${data.journal.journal_number}" assigned to you
🎯 ${data.lines.length} counting tasks ready

You can now go to your dashboard to see the assigned journal and start counting!
      `);
      
    } catch (error: any) {
      console.error('Error generating test data:', error);
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const cleanupTestData = async () => {
    try {
      setCleaning(true);
      setResult('Cleaning up test data...');
      
      await SampleDataGenerator.cleanupSampleData();
      
      setResult('✅ Test data cleaned up successfully!');
      
    } catch (error: any) {
      console.error('Error cleaning up test data:', error);
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Data Generator</h1>
          <p className="text-gray-600">Generate sample journals and counting tasks for testing the operator interface</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Sample Data</h2>
              <p className="text-gray-600 mb-6">
                This will create sample locations, items, and a journal assigned to you for testing the counting workflow.
              </p>
              
              <button
                onClick={generateTestData}
                disabled={generating}
                className={`w-full py-4 rounded-lg font-medium transition-colors ${
                  generating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {generating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate Test Data'
                )}
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Clean Up Data</h2>
              <p className="text-gray-600 mb-6">
                Remove all test data from the database. Use this to start fresh.
              </p>
              
              <button
                onClick={cleanupTestData}
                disabled={cleaning}
                className={`w-full py-4 rounded-lg font-medium transition-colors ${
                  cleaning
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {cleaning ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Cleaning...
                  </div>
                ) : (
                  'Clean Up Test Data'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Result</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
            </div>
            
            {result.includes('✅ Test data generated successfully') && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => router.push('/operator/dashboard')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Generate More
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/operator/dashboard')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
