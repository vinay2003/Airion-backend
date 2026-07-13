const fs = require('fs');

let content = fs.readFileSync('apps/user-website/src/pages/UnifiedAuth.tsx', 'utf8');

// 1. Add imports
const importsToAdd = `import { auth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from '../lib/firebase';\n`;
content = content.replace(
  "import OTPInput from '@ease2event/shared/components/OTPInput';",
  "import OTPInput from '@ease2event/shared/components/OTPInput';\n" + importsToAdd
);

// 2. Add state variables
const stateVars = `    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [confirmationResult, setConfirmationResult] = useState<any>(null);`;
content = content.replace("    const [email, setEmail] = useState('');", stateVars);

// 3. Add Google OAuth handler
const googleAuthHandler = `
    // ─── Google OAuth ────────────────────────────────────────────────────────
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
                    const tokenParam = '?token=' + response.access_token;
                    if (selectedRole === UserRole.VENDOR) {
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : targetUrl + '/';
                        window.location.href = baseUrl + tokenParam;
                    } else if (selectedRole === UserRole.ADMIN) {
                        const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;
                        window.location.href = isLocal ? 'http://localhost:5175/' + tokenParam : (ADMIN_URL ? ADMIN_URL + '/' + tokenParam : '/admin' + tokenParam);
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
    };

    // ─── Phone OTP ────────────────────────────────────────────────────────
    const setupRecaptcha = () => {
        if (!(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible'
            });
        }
    };
`;
content = content.replace(
  "    // ─── Send OTP via Email ────────────────────────────────────────────────────",
  googleAuthHandler + "\n    // ─── Send OTP via Email / Phone ────────────────────────────────────────────────────"
);

// 4. Update handleSendOTP
const sendOTPRegex = /const handleSendOTP = useCallback\(async \(\w*\??: React\.FormEvent\) => \{[\s\S]*?\}, \[email, mode, resendTimer, selectedRole\]\);/;
const newSendOTP = `const handleSendOTP = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (resendTimer > 0) return;

        setLoading(true);
        try {
            if (authMethod === 'email') {
                const trimmedEmail = email.trim().toLowerCase();
                if (!trimmedEmail || !/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(trimmedEmail)) {
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
                toast.success('Verification code sent to ' + trimmedEmail);
                
            } else {
                let phoneNumber = phone.trim();
                if (!phoneNumber) {
                    toast.error('Please enter a valid phone number.');
                    setLoading(false);
                    return;
                }
                if (!phoneNumber.startsWith('+')) {
                    phoneNumber = '+91' + phoneNumber;
                }

                setupRecaptcha();
                const appVerifier = (window as any).recaptchaVerifier;
                const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
                setConfirmationResult(confirmation);
                toast.success('Verification code sent to ' + phoneNumber);
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
    };`;
content = content.replace(sendOTPRegex, newSendOTP);

// 5. Update handleVerifyOTP
const verifyOTPRegex = /const handleVerifyOTP = async \([\s\S]*?finally \{\n            setLoading\(false\);\n        \}\n    \};/;
const newVerifyOTP = `const handleVerifyOTP = async (finalOtp?: string) => {
        const otpValue = finalOtp || otp;
        if (!otpValue || otpValue.length !== 6) {
            toast.error('Please enter a valid 6-digit code.');
            return;
        }

        setLoading(true);
        try {
            let response: any;
            
            if (authMethod === 'phone' && confirmationResult) {
                const result = await confirmationResult.confirm(otpValue.trim());
                const idToken = await result.user.getIdToken();
                response = await otpAuth.verifyFirebaseToken(idToken, selectedRole);
            } else {
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
                    if (selectedRole === UserRole.USER) {
                        toast.success('Verified! Please complete your profile.');
                        setStep('details');
                        setLoading(false);
                        return;
                    } else if (selectedRole === UserRole.VENDOR) {
                        toast.success('Account created! Redirecting to vendor setup...');
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : targetUrl + '/';
                        setTimeout(() => window.location.href = baseUrl + 'signup-form?token=' + response.access_token, 800);
                        return;
                    }
                }

                toast.success('Welcome back!');
                setTimeout(() => {
                    const tokenParam = '?token=' + response.access_token;
                    if (selectedRole === UserRole.VENDOR) {
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : targetUrl + '/';
                        window.location.href = baseUrl + tokenParam;
                    } else if (selectedRole === UserRole.ADMIN) {
                        const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;
                        window.location.href = isLocal ? 'http://localhost:5175/' + tokenParam : (ADMIN_URL ? ADMIN_URL + '/' + tokenParam : '/admin' + tokenParam);
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
    };`;
content = content.replace(verifyOTPRegex, newVerifyOTP);


// 6. UI: Add recaptcha-container
content = content.replace(
  "{/* 🛡️ Secure Forms */}",
  "{/* 🛡️ Secure Forms */}\n                    <div id=\"recaptcha-container\"></div>"
);


// 7. UI: Add Google Button and Auth Method Toggle
const beforeInputStr = `<div className="space-y-5">
                                    <div>
                                        <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 ml-1">
                                            Email address
                                        </label>`;
const newInputsHeader = `<div className="space-y-4 mb-8">
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                        className="w-full h-14 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all hover:bg-neutral-50 dark:hover:bg-slate-800 shadow-sm"
                                    >
                                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                                            </g>
                                        </svg>
                                        Continue with Google
                                    </button>
                                    
                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-neutral-200 dark:border-slate-800"></div>
                                        <span className="flex-shrink-0 mx-4 text-neutral-400 text-sm font-medium">Or continue with</span>
                                        <div className="flex-grow border-t border-neutral-200 dark:border-slate-800"></div>
                                    </div>
                                    
                                    <div className="flex p-1 bg-neutral-100 dark:bg-slate-900/80 rounded-xl mb-4 w-full">
                                        <button type="button" onClick={() => setAuthMethod('email')} className={'flex-1 py-2 text-sm font-semibold rounded-lg transition-all ' + (authMethod === 'email' ? 'bg-white dark:bg-slate-800 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500')}>Email</button>
                                        <button type="button" onClick={() => setAuthMethod('phone')} className={'flex-1 py-2 text-sm font-semibold rounded-lg transition-all ' + (authMethod === 'phone' ? 'bg-white dark:bg-slate-800 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500')}>Phone Number</button>
                                    </div>
                                </div>
                                
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 ml-1">
                                            {authMethod === 'email' ? 'Email address' : 'Mobile number'}
                                        </label>`;
content = content.replace(beforeInputStr, newInputsHeader);


// 8. Replace the email input with conditional input
const emailInputBlock = `                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-500 transition-colors pointer-events-none">
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
                                            {/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(email) && (
                                                <CheckCircle2 size={24} className="text-emerald-500 animate-in zoom-in duration-300" />
                                            )}
                                        </div>`;
                                        
const conditionalInputBlock = `                                        {authMethod === 'email' ? (
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
                                                    {/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(email) && (
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
                                        )}`;

content = content.replace(emailInputBlock, conditionalInputBlock);
// Fallback if regex missed it
if (content.includes('^[^\s@]+@[^\s@]+\.[^\s@]+$')) {
    content = content.replace(
        "{/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (",
        "{/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(email) && ("
    );
    const regex1 = /<div className="absolute left-4 top-1\/2[\s\S]*?<\/div>\n                                        <input\n                                            type="email"[\s\S]*?placeholder="you@example.com"\n                                        \/>\n                                        <div className="absolute right-4 top-1\/2[\s\S]*?<\/div>/;
    content = content.replace(regex1, conditionalInputBlock);
}

// 9. Fix step text
content = content.replace(
    "{step === 'email'\n                                        ? 'Enter your email to receive a verification code.'\n                                        : `Verification code sent to ${email}`}",
    "{step === 'email'\n                                        ? 'Enter your details to receive a verification code.'\n                                        : `Verification code sent to ${authMethod === 'email' ? email : phone}`}"
);

fs.writeFileSync('apps/user-website/src/pages/UnifiedAuth.tsx', content);
