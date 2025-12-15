// ============================================================================
// LOGIN BRANDING COMPONENT - Pure & Modular
// ============================================================================
// Single responsibility: Display company branding and feature highlights

export function LoginBranding() {
  return (
    <div className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <BrandingBackground />
      
      {/* Main Branding Content */}
      <div className="relative z-10 flex flex-col justify-center px-12 py-20 text-white h-full">
        {/* Company Logo & Title */}
        <CompanyHeader />
        
        {/* Feature Highlights */}
        <FeatureList />
        
        {/* Bottom Security Notice */}
        <SecurityFooter />
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS - Each with single responsibility
// ============================================================================

function BrandingBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg" />
    </div>
  );
}

function CompanyHeader() {
  return (
    <div className="mb-8">
      {/* Company Logo Placeholder */}
      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
        <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">D</span>
        </div>
      </div>
      
      {/* Company Title */}
      <h1 className="text-4xl font-bold leading-tight mb-4">
        Warehouse Cycle Count
      </h1>
      <p className="text-blue-100 text-lg leading-relaxed">
        Advanced inventory management system with real-time accuracy tracking, 
        automated workflows, and comprehensive variance analysis.
      </p>
    </div>
  );
}

function FeatureList() {
  const features = [
    'Live production counting',
    'Transaction-aware reconciliation', 
    'Role-based workflow automation',
    'Mobile-optimized interface'
  ];

  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <FeatureItem key={index} text={feature} />
      ))}
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-2 h-2 bg-green-400 rounded-full" />
      <span className="text-blue-100">{text}</span>
    </div>
  );
}

function SecurityFooter() {
  return (
    <div className="mt-16 pt-8 border-t border-white/20">
      <p className="text-blue-200 text-sm">
        Secure access with enterprise-grade authentication
      </p>
    </div>
  );
}
