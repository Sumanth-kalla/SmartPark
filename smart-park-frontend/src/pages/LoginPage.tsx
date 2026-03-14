import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const LoginPage = () => {

    const [role, setRole] = useState<"user" | "staff" | "admin">("user");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setError("");

        try {

            setLoading(true);

            const response = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (data.user.role !== role) {
                throw new Error(`This account is registered as ${data.user.role}`);
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

        <div className="min-h-screen bg-[#050b18] text-white flex relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute w-[900px] h-[900px] bg-yellow-500/10 blur-[160px] rounded-full -top-40 left-1/2 -translate-x-1/2" />

            {/* LEFT SIDE */}
            <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex flex-col justify-center w-1/2 px-20 relative"
            >

                <div>

                    <div className="w-14 h-14 bg-yellow-500 rounded-xl mb-8 shadow-xl shadow-yellow-500/20" />

                    <h1 className="text-5xl font-extrabold leading-tight mb-6">

                        Secure Smart Parking
                        <br />
                        Infrastructure.

                    </h1>

                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">

                        Manage slots, monitor live occupancy, automate billing,
                        and eliminate congestion — all from one intelligent system.

                    </p>

                    <div className="mt-12 space-y-4 text-sm text-gray-500">

                        <p>• QR-based Entry & Exit</p>
                        <p>• Real-Time Slot Monitoring</p>
                        <p>• Automated Fee Calculation</p>
                        <p>• Role-Based Access Control</p>

                    </div>

                </div>

            </motion.div>


            {/* RIGHT SIDE */}
            <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16"
            >

                <div className="w-full max-w-md mx-auto backdrop-blur-xl bg-white/[0.03] border border-white/10 p-10 rounded-2xl shadow-2xl">

                    {/* Back Button */}

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

                        Sign in to SmartPark

                    </h2>

                    <p className="text-gray-400 mb-8 text-sm">

                        Access your dashboard securely.

                    </p>


                    {/* ROLE SELECTOR */}

                    <div className="mb-8">

                        <p className="text-sm text-gray-400 mb-3">
                            Login as
                        </p>

                        <div className="grid grid-cols-3 gap-2">

                            {["user", "staff", "admin"].map((r) => {

                                const active = role === r;

                                return (

                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        whileHover={{ scale: 1.05 }}
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r as any)}
                                        className={`py-2 rounded-lg text-sm font-semibold transition-all
${active
                                                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                            }`}
                                    >

                                        {r.charAt(0).toUpperCase() + r.slice(1)}

                                    </motion.button>

                                );

                            })}

                        </div>

                    </div>


                    <form onSubmit={handleSubmit} className="space-y-6">

                        {error && (

                            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg border border-red-500/20">

                                {error}

                            </div>

                        )}

                        {/* EMAIL */}

                        <div>

                            <label className="block text-sm text-gray-400 mb-2">

                                Email Address

                            </label>

                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                            />

                        </div>


                        {/* PASSWORD */}

                        <div>

                            <label className="block text-sm text-gray-400 mb-2">

                                Password

                            </label>

                            <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Enter your password"
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

                        </div>


                        {/* LOGIN BUTTON */}

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-3 bg-yellow-500 text-black py-3 rounded-lg font-bold text-lg transition shadow-lg shadow-yellow-500/20
${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-400"}
`}
                        >

                            {loading ? (

                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Signing In...
                                </>

                            ) : (

                                `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`

                            )}

                        </motion.button>

                    </form>


                    {/* DIVIDER */}

                    <div className="my-8 flex items-center">

                        <div className="flex-1 h-px bg-white/10" />

                        <span className="px-4 text-sm text-gray-500">
                            or
                        </span>

                        <div className="flex-1 h-px bg-white/10" />

                    </div>


                    {/* GOOGLE BUTTON */}

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-white text-black py-3 rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-gray-200 transition shadow-md"
                    >

                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            className="w-5 h-5"
                        />

                        Continue with Google

                    </motion.button>


                    {/* SIGNUP */}

                    <div className="text-center text-sm text-gray-400 mt-8">

                        Don’t have an account?{" "}

                        <Link
                            to="/signup"
                            className="text-yellow-500 hover:text-yellow-400 font-semibold"
                        >

                            Create one

                        </Link>

                    </div>

                </div>

            </motion.div>

        </div>

    );

};

export default LoginPage;