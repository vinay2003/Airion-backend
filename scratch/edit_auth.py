import re

with open('apps/user-website/src/pages/UnifiedAuth.tsx', 'r') as f:
    content = f.read()

# Add imports
imports_to_add = """import { auth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from '../lib/firebase';
import { FcGoogle } from 'react-icons/fc';
"""
content = content.replace("import OTPInput from '@ease2event/shared/components/OTPInput';", 
                          "import OTPInput from '@ease2event/shared/components/OTPInput';\n" + imports_to_add)


# Add state variables for phone auth
state_vars = """    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [confirmationResult, setConfirmationResult] = useState<any>(null);"""
content = content.replace("const [email, setEmail] = useState('');", state_vars)

# Add Firebase Google Auth handler
google_auth_handler = """    // ─── Google OAuth ────────────────────────────────────────────────────────
    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            
            const response = await otpAuth.verifyFirebaseToken(idToken, selectedRole);
            
            if (response.access_token) {
                loginWithResponse(response);
                toast.success('Successfully logged in with Google!');
                
                setTimeout(() => {
                    const tokenParam = `?token=${response.access_token}`;
                    if (selectedRole === UserRole.VENDOR) {
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : `${targetUrl}/`;
                        window.location.href = `${baseUrl}${tokenParam}`;
                    } else if (selectedRole === UserRole.ADMIN) {
                        const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;
                        window.location.href = isLocal ? `http://localhost:5175/${tokenParam}` : (ADMIN_URL ? `${ADMIN_URL}/${tokenParam}` : `/admin${tokenParam}`);
                    } else {
                        navigate('/dashboard');
                    }
                }, 800);
            }
        } catch (err: any) {
            console.error('[Google Auth] ❌ Error:', err);
            toast.error(err.message || 'Google sign in failed');
        } finally {
            setLoading(false);
        }
    };"""

# Add setupRecaptcha
setup_recaptcha = """    // ─── Phone OTP ────────────────────────────────────────────────────────
    const setupRecaptcha = () => {
        if (!(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => {
                    // reCAPTCHA solved
                }
            });
        }
    };"""

content = content.replace("// ─── Send OTP via Email ────────────────────────────────────────────────────", google_auth_handler + "\n\n" + setup_recaptcha + "\n\n// ─── Send OTP via Email / Phone ────────────────────────────────────────────────────")

# Modify handleSendOTP
send_otp_new = """    const handleSendOTP = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (resendTimer > 0) return;

        setLoading(true);
        try {
            if (authMethod === 'email') {
                const trimmedEmail = email.trim().toLowerCase();
                if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
                    toast.error('Please enter a valid email address.');
                    setLoading(false);
                    return;
                }
                
                if (selectedRole === UserRole.ADMIN) {
                    const adminEmails = [
                        'abhishekkumar518@gmail.com',
                        'vinaysharma31681@gmail.com',
                        'modeweltjob@gmail.com',
                        'admin@ease2event.com'
                    ];
                    if (!adminEmails.includes(trimmedEmail)) {
                        toast.error('Unauthorized admin email. Access Denied.');
                        setLoading(false);
                        return;
                    }
                }

                if (mode === 'signup') {
                    await otpAuth.sendSignupOTP({ email: trimmedEmail, role: selectedRole });
                } else {
                    await otpAuth.sendLoginOTP({ email: trimmedEmail, role: selectedRole });
                }
                toast.success(`Verification code sent to ${trimmedEmail}`);
                
            } else {
                // Phone Auth
                let phoneNumber = phone.trim();
                if (!phoneNumber) {
                    toast.error('Please enter a valid phone number.');
                    setLoading(false);
                    return;
                }
                if (!phoneNumber.startsWith('+')) {
                    phoneNumber = '+91' + phoneNumber; // Default to India if no code
                }

                setupRecaptcha();
                const appVerifier = (window as any).recaptchaVerifier;
                const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
                setConfirmationResult(confirmation);
                toast.success(`Verification code sent to ${phoneNumber}`);
            }

            setStep('otp');
            setResendTimer(60);
        } catch (err: any) {
            console.error('[OTP] ❌ Error:', err);
            if (authMethod === 'phone' && err.code === 'auth/too-many-requests') {
                toast.error('Too many requests. Please try again later.');
            } else {
                toast.error(err?.response?.data?.error || err?.message || 'Failed to send verification code.');
            }
        } finally {
            setLoading(false);
        }
    };"""

content = re.sub(r'const handleSendOTP = useCallback\(async.*?\}, \[email, mode, resendTimer, selectedRole\]\);', send_otp_new, content, flags=re.DOTALL)

verify_otp_new = """    const handleVerifyOTP = async (finalOtp?: string) => {
        const otpValue = finalOtp || otp;
        if (!otpValue || otpValue.length !== 6) {
            toast.error('Please enter a valid 6-digit code.');
            return;
        }

        setLoading(true);
        try {
            let response: any;
            
            if (authMethod === 'phone' && confirmationResult) {
                // Verify via Firebase
                const result = await confirmationResult.confirm(otpValue.trim());
                const idToken = await result.user.getIdToken();
                response = await otpAuth.verifyFirebaseToken(idToken, selectedRole);
            } else {
                // Verify via Backend Email OTP
                const trimmedEmail = email.trim().toLowerCase();
                if (mode === 'signup') {
                    response = await otpAuth.verifySignupOTP({
                        email: trimmedEmail,
                        otp: otpValue.trim(),
                        role: selectedRole,
                        name: fullName || undefined,
                    });
                } else {
                    response = await otpAuth.verifyLoginOTP({
                        email: trimmedEmail,
                        otp: otpValue.trim(),
                    });
                }
            }

            if (response?.access_token) {
                loginWithResponse(response);
                
                if (mode === 'signup') {
                    if (selectedRole === UserRole.USER && authMethod === 'email') {
                        toast.success('Verified! Please complete your profile.');
                        setStep('details');
                        setLoading(false);
                        return;
                    } else if (selectedRole === UserRole.VENDOR) {
                        toast.success('Account created! Redirecting to vendor setup...');
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : `${targetUrl}/`;
                        setTimeout(() => window.location.href = `${baseUrl}signup-form?token=${response.access_token}`, 800);
                        return;
                    }
                }

                toast.success('Welcome back!');
                setTimeout(() => {
                    const tokenParam = `?token=${response.access_token}`;
                    if (selectedRole === UserRole.VENDOR) {
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : `${targetUrl}/`;
                        window.location.href = `${baseUrl}${tokenParam}`;
                    } else if (selectedRole === UserRole.ADMIN) {
                        const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;
                        window.location.href = isLocal ? `http://localhost:5175/${tokenParam}` : (ADMIN_URL ? `${ADMIN_URL}/${tokenParam}` : `/admin${tokenParam}`);
                    } else {
                        navigate('/dashboard');
                    }
                }, 800);
            }
        } catch (err: any) {
            console.error('[Verify OTP] ❌ Error:', err);
            toast.error(err?.response?.data?.error || err?.message || 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };"""

content = re.sub(r'const handleVerifyOTP = async.*?finally \{\n            setLoading\(false\);\n        \}\n    \};', verify_otp_new, content, flags=re.DOTALL)


# UI Modifications
# 1. Add recaptcha container
content = content.replace("{/* 🛡️ Secure Forms */}", "{/* 🛡️ Secure Forms */}\n                    <div id=\"recaptcha-container\"></div>")

# 2. Add Google button
google_btn = """                                <div className="space-y-4 mb-8">
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                        className="w-full h-14 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all hover:bg-neutral-50 dark:hover:bg-slate-800 shadow-sm"
                                    >
                                        <FcGoogle size={24} />
                                        Continue with Google
                                    </button>
                                    
                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-neutral-200 dark:border-slate-800"></div>
                                        <span className="flex-shrink-0 mx-4 text-neutral-400 text-sm font-medium">Or continue with</span>
                                        <div className="flex-grow border-t border-neutral-200 dark:border-slate-800"></div>
                                    </div>
                                    
                                    {/* Auth Method Toggle */}
                                    <div className="flex p-1 bg-neutral-100 dark:bg-slate-900/80 rounded-xl mb-4 w-full">
                                        <button type="button" onClick={() => setAuthMethod('email')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMethod === 'email' ? 'bg-white dark:bg-slate-800 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>Email</button>
                                        <button type="button" onClick={() => setAuthMethod('phone')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMethod === 'phone' ? 'bg-white dark:bg-slate-800 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>Phone Number</button>
                                    </div>
                                </div>"""

content = content.replace("                                <div className=\"space-y-5\">\n                                    <div>\n                                        <label className=\"text-xl font-bold text-neutral-700 dark:text-slate-300 ml-1\">\n                                            Email address", google_btn + """
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 ml-1">
                                            {authMethod === 'email' ? 'Email address' : 'Mobile number'}
                                        </label>""")

email_input = """                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-500 transition-colors pointer-events-none">
                                            <Mail size={22} />
                                        </div>
                                        <input
                                            type="email"
                                            inputMode="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-12 h-16 bg-white dark:bg-slate-900 border-2 border-neutral-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-neutral-900 dark:text-white text-xl placeholder:text-neutral-400/50"
                                            placeholder="you@example.com"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                            {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                                                <CheckCircle2 size={24} className="text-emerald-500 animate-in zoom-in duration-300" />
                                            )}
                                        </div>"""
                                        
dynamic_input = """                                        {authMethod === 'email' ? (
                                            <>
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-500 transition-colors pointer-events-none">
                                                    <Mail size={22} />
                                                </div>
                                                <input
                                                    type="email"
                                                    inputMode="email"
                                                    autoComplete="email"
                                                    required
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    className="w-full pl-12 pr-12 h-16 bg-white dark:bg-slate-900 border-2 border-neutral-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-neutral-900 dark:text-white text-xl placeholder:text-neutral-400/50"
                                                    placeholder="you@example.com"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                                    {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                                                        <CheckCircle2 size={24} className="text-emerald-500 animate-in zoom-in duration-300" />
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-500 transition-colors pointer-events-none">
                                                    <Phone size={22} />
                                                </div>
                                                <input
                                                    type="tel"
                                                    inputMode="tel"
                                                    autoComplete="tel"
                                                    required
                                                    value={phone}
                                                    onChange={e => setPhone(e.target.value)}
                                                    className="w-full pl-12 pr-12 h-16 bg-white dark:bg-slate-900 border-2 border-neutral-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-neutral-900 dark:text-white text-xl placeholder:text-neutral-400/50"
                                                    placeholder="10-digit mobile number"
                                                />
                                            </>
                                        )}"""
content = content.replace(email_input, dynamic_input)

# Step Text Update
step_text_old = """                                    {step === 'email'
                                        ? 'Enter your email to receive a verification code.'
                                        : `Verification code sent to ${email}`}"""
step_text_new = """                                    {step === 'email'
                                        ? 'Enter your details to receive a verification code.'
                                        : `Verification code sent to ${authMethod === 'email' ? email : phone}`}"""
content = content.replace(step_text_old, step_text_new)


with open('apps/user-website/src/pages/UnifiedAuth.tsx', 'w') as f:
    f.write(content)
