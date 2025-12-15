// ============================================================================
// LOGIN BRANDING ORGANISM - Complex Branding System
// ============================================================================
// Location: /components/organisms/LoginBranding/
// Purpose: Complete branding section with company info and features

interface LoginBrandingProps {
  companyName?: string;
  tagline?: string;
  features?: string[];
  logoPlaceholder?: string;
}

export function LoginBranding({ 
  companyName = "Warehouse Cycle Count",
  tagline = "Advanced inventory management system with real-time accuracy tracking, automated workflows, and comprehensive variance analysis.",
  features = [
    'Live production counting',
    'Transaction-aware reconciliation', 
    'Role-based workflow automation',
    'Mobile-optimized interface'
  ],
  logoPlaceholder = "D"
}: LoginBrandingProps) {
  
  return (
    <div className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <BrandingBackground />
      
      {/* Main Branding Content */}
      <div className="relative z-10 flex flex-col justify-center px-12 py-20 text-white h-full">
        {/* Company Logo & Title */}
        <CompanyHeader 
          companyName={companyName}
          tagline={tagline}
          logoPlaceholder={logoPlaceholder}
        />
        
        {/* Feature Highlights */}
        <FeatureList features={features} />
        
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
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse" />
    </div>
  );
}

function CompanyHeader({ companyName, tagline, logoPlaceholder }: {
  companyName: string;
  tagline: string; 
  logoPlaceholder: string;
}) {
  return (
    <div className="mb-8">
      {/* Company Logo Placeholder */}
      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 transition-transform hover:scale-105">
        <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">{logoPlaceholder}</span>
        </div>
      </div>
      
      {/* Company Title */}
      <h1 className="text-4xl font-bold leading-tight mb-4">
        {companyName}
      </h1>
      <p className="text-blue-100 text-lg leading-relaxed">
        {tagline}
      </p>
    </div>
  );
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <FeatureItem key={index} text={feature} index={index} />
      ))}
    </div>
  );
}

function FeatureItem({ text, index }: { text: string; index: number }) {
  return (
    <div 
      className="flex items-center space-x-3 animate-fadeIn"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span className="text-blue-100">{text}</span>
    </div>
  );
}

function SecurityFooter() {
  return (
    <div className="mt-16 pt-8 border-t border-white/20">
      <p className="text-blue-200 text-sm">
        🔐 Secure access with enterprise-grade authentication
      </p>
    </div>
  );
}
