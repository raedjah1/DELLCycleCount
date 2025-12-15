# 🔐 **MICROSOFT AZURE AUTHENTICATION SETUP GUIDE**
## DELL Warehouse Cycle Count - Enterprise MFA Authentication

---

## 🎯 **WHAT THIS DOES**

This connects your "Sign in with Microsoft" button to **REAL Microsoft authentication**:
- ✅ Users click button → Redirects to Microsoft login
- ✅ Microsoft handles MFA (Multi-Factor Authentication)  
- ✅ User authenticates with their DELL credentials
- ✅ Microsoft sends back user info + access token
- ✅ Your app gets user details and can access Microsoft services

**Result**: Enterprise-grade authentication with zero password management!

---

## 📋 **STEP-BY-STEP AZURE CONFIGURATION** 

### **🚀 QUICK START (5 Minutes)**

1. **Open Azure Portal**: Go to [portal.azure.com](https://portal.azure.com) 
2. **Search**: Type "App registrations" in the top search bar
3. **Click**: "App registrations" service
4. **Click**: "New registration" button

### **1. Create Azure App Registration**

**Fill out the registration form**:

```
Application Name: DELL Warehouse Cycle Count
Supported account types: ✅ Accounts in this organizational directory only (DELL only)
Redirect URI: 
  Type: Single-page application (SPA)
  URL: http://localhost:3000/auth/callback
```

5. **Click "Register"** 
6. **IMPORTANT**: Copy the **Application (client) ID** - you'll need this!

### **2. Configure Authentication**

1. In your app registration, go to **Authentication**
2. Under **Single-page application**, add these URIs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000` (for logout)
3. Under **Advanced settings**:
   - ✅ Check **"Access tokens (used for implicit flows)"**
   - ✅ Check **"ID tokens (used for implicit and hybrid flows)"**
4. Click **Save**

### **3. Configure API Permissions**

1. Go to **API permissions**
2. Click **"Add a permission"**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Add these permissions:
   - `User.Read` (Read user profile)
   - `User.Read.All` (Read all users)
   - `Directory.Read.All` (Read directory data)
6. Click **"Grant admin consent"** (requires admin)

### **4. Get Configuration Values**

From your App Registration **Overview** page, copy:
- **Application (client) ID**
- **Directory (tenant) ID**

---

## 🔧 **ENVIRONMENT CONFIGURATION** 

### **Create `.env.local` File**

In your project root (`cycle-count-app/`), create a `.env.local` file:

```bash
# Copy and paste this into .env.local file:
NEXT_PUBLIC_AZURE_CLIENT_ID=paste-your-client-id-here
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/paste-your-tenant-id-here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
```

### **⚠️ REPLACE THESE VALUES**:

1. **Get Client ID**: Azure Portal → Your App → Overview → Copy "Application (client) ID"
2. **Get Tenant ID**: Azure Portal → Your App → Overview → Copy "Directory (tenant) ID"

### **Example**:
```bash
NEXT_PUBLIC_AZURE_CLIENT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/12345678-90ab-cdef-1234-567890abcdef
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
```

### **💡 After Saving**:
- Restart your dev server: `npm run dev`
- The yellow banner will disappear
- Microsoft button will work with REAL authentication!

---

## 👥 **USER ROLE MAPPING**

### **Option A: Azure AD Groups (Recommended)**

1. In **Azure Portal** → **Entra ID** → **Groups**
2. Create these groups:
   - `warehouse-admins`
   - `warehouse-ic-managers`
   - `warehouse-managers`
   - `warehouse-supervisors`
   - `warehouse-leads`
   - `warehouse-operators`
   - `warehouse-viewers`
3. Assign users to appropriate groups

### **Option B: App Roles**

1. In your app registration → **App roles**
2. Create custom roles matching your warehouse hierarchy

---

## 🔒 **MFA CONFIGURATION**

### **Enable MFA for Users**:

1. **Azure Portal** → **Entra ID** → **Security** → **MFA**
2. **Conditional Access**:
   - Create policy for warehouse app
   - Require MFA for all users
   - Apply to your app registration

### **MFA Methods**:
- Microsoft Authenticator (recommended)
- SMS verification
- Phone call verification
- Hardware tokens

---

## 🌐 **PRODUCTION DEPLOYMENT**

For production deployment, update your `.env.local`:

```env
NEXT_PUBLIC_REDIRECT_URI=https://your-production-domain.com/auth/callback
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=https://your-production-domain.com
```

And update redirect URIs in Azure App Registration.

---

## 🧪 **TESTING THE SETUP**

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/auth/login`
3. Click **"Sign in with Microsoft"**
4. Should redirect to Microsoft login with MFA
5. After successful authentication, should return to your app

---

## 🔐 **DATA WAREHOUSE INTEGRATION**

Once authentication is working, you can use the access token to connect to:
- **Microsoft Fabric Data Warehouse**: `vlsi47wa3rcupljif6kcqsfmra-4afjdqcmwt2upoibtsafltmizi.datawarehouse.fabric.microsoft.com`
- The same Azure AD token can authenticate to Fabric

---

## 📞 **SUPPORT**

- **Azure AD Issues**: Contact your IT administrator
- **App Configuration**: Check Azure Portal logs
- **Development**: Review browser console for errors

---

## ✅ **CHECKLIST**

- [ ] Azure App Registration created
- [ ] Authentication configured
- [ ] API permissions granted
- [ ] Environment variables set
- [ ] User groups created
- [ ] MFA policies applied
- [ ] Testing completed
- [ ] Production deployment configured

**Your enterprise-grade Microsoft authentication is ready!** 🚀
