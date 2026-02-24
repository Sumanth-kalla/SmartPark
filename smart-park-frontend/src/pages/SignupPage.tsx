import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const SignupPage = () => {
    const [role, setRole] = useState<"user" | "staff">("user");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate(`/dashboard/${data.user.role}`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050b18] text-white flex">

            {/* LEFT SIDE */}
            <div className="hidden lg:flex flex-col justify-center w-1/2 px-20 relative overflow-hidden">
                <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full -z-10" />

                <div>
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg mb-6 shadow-lg shadow-yellow-500/20"></div>

                    <h1 className="text-5xl font-extrabold leading-tight mb-6">
                        Smart Parking
                        <br />
                        Starts Here.
                    </h1>

                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                        Create your SmartPark account to manage parking infrastructure,
                        automate billing, and control slot access with QR precision.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16">
                <div className="w-full max-w-md mx-auto">

                    <div className="mb-8">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-500 transition"
                        >
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">
                        Create your SmartPark account
                    </h2>
                    <p className="text-gray-400 mb-8 text-sm">
                        Start managing parking operations intelligently.
                    </p>

                    {/* Role Selector */}
                    <div className="mb-8">
                        <p className="text-sm text-gray-400 mb-3">Register as</p>
                        <div className="grid grid-cols-2 gap-2">
                            {["user", "staff"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r as "user" | "staff")}
                                    className={`py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${role === r
                                            ? "bg-yellow-500 text-black shadow-md shadow-yellow-500/20"
                                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {error && (
                            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                        />

                        <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                required
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-3 bg-yellow-500 text-black py-3 rounded-lg font-bold text-lg transition shadow-lg shadow-yellow-500/20 ${loading
                                    ? "opacity-70 cursor-not-allowed"
                                    : "hover:bg-yellow-400 active:scale-95"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Creating Account...
                                </>
                            ) : (
                                `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`
                            )}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-400 mt-8">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-yellow-500 hover:text-yellow-400 font-semibold"
                        >
                            Sign in
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignupPage;