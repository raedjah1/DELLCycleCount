// Test route to verify routing is working
export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">🎉 Routing Works!</h1>
        <p className="text-blue-700 text-lg">Test route is functioning perfectly.</p>
        <p className="text-blue-600 mt-2">Navigate to /auth/test to see this page.</p>
      </div>
    </div>
  );
}
