import fs from 'fs';

const filePath = 'apps/admin-panel/src/pages/AdminLogin.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Add states
content = content.replace(
    /const \[showOTP, setShowOTP\] = useState\(false\);/,
    `const [showOTP, setShowOTP] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [tempToken, setTempToken] = useState('');`
);

// Update verifyOTP
content = content.replace(
    /const response = await adminAuth\.verifyOtp\(phone\.trim\(\), code\);\s*loginWithResponse\(response\);\s*toast\.success\('Login successful!'\);\s*navigate\('\/'\);/g,
    `const response = await adminAuth.verifyOtp(phone.trim(), code);
            if (response.require2fa) {
                setTempToken(response.tempToken);
                setShowOTP(false);
                setShow2FA(true);
                setOtp(['', '', '', '', '', '']); // Reset OTP for 2FA
            } else {
                loginWithResponse(response);
                toast.success('Login successful!');
                navigate('/');
            }`
);

// Add verify2FA handler
const verify2FAHandler = `
    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) return toast.error('Enter the 6-digit Authenticator code');
        setLoading(true);
        try {
            // Note: Add verify2fa to adminAuth in shared package if needed. For now, calling it via axios/api is ideal.
            // Using standard fetch since we might not have it in shared yet.
            const apiRes = await fetch(import.meta.env.VITE_API_URL + '/api/auth/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken, otp: code })
            });
            const data = await apiRes.json();
            if (!apiRes.ok) throw new Error(data.message || 'Invalid 2FA code');
            
            loginWithResponse(data);
            toast.success('Login successful!');
            navigate('/');
        } catch (err: any) {
            toast.error(err.message || 'Invalid 2FA code');
        } finally {
            setLoading(false);
        }
    };
`;

content = content.replace(
    /const handleOtpChange =/,
    `${verify2FAHandler}\n    const handleOtpChange =`
);

// Add 2FA View
const twoFaView = `
                    {/* Step 3: 2FA Verification */}
                    {show2FA && (
                        <form onSubmit={handleVerify2FA} className="space-y-6">
                            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-4">
                                Enter the 6-digit code from your Authenticator app
                            </p>
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={\`otp-\${i}\`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-70"
                            >
                                {loading
                                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : 'Verify Authenticator'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setShow2FA(false); setShowOTP(false); setOtp(['', '', '', '', '', '']); }}
                                className="w-full text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-slate-300"
                            >
                                ← Back to Login
                            </button>
                        </form>
                    )}
`;

content = content.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*\);\s*};\s*export default AdminLogin;/,
    `${twoFaView}\n                </div>\n            </div>\n        </div>\n    );\n};\n\nexport default AdminLogin;`
);

content = content.replace(
    /\{!showOTP && \(/,
    `{!showOTP && !show2FA && (`
);

fs.writeFileSync(filePath, content);
console.log('AdminLogin patched');
