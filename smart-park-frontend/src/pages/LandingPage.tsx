import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
    };

    return (

        <div className="relative min-h-screen bg-[#050b18] text-white overflow-hidden">

            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-yellow-500/10 blur-[140px] rounded-full -z-10" />

            {/* HEADER */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-[#050b18]/80 border-b border-white/5">

                <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

                    <div className="flex items-center gap-3">

                        <div className="w-9 h-9 bg-yellow-500 rounded-lg shadow-lg shadow-yellow-500/20" />

                        <h1 className="text-xl font-extrabold tracking-wide">
                            SMARTPARK
                        </h1>

                    </div>

                    <nav className="flex items-center gap-10 text-sm font-medium text-gray-400">

                        <a className="hover:text-white transition-colors">
                            The System
                        </a>

                        <a className="hover:text-white transition-colors">
                            Features
                        </a>

                        <Link to="/login" className="hover:text-white transition-colors">
                            Log in
                        </Link>

                        <Link to="/dashboard/slots">

                            <button className="bg-yellow-500 text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 hover:scale-105 active:scale-95">

                                Get Started

                            </button>

                        </Link>

                    </nav>

                </div>

            </header>


            {/* HERO */}
            <motion.section
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-6xl mx-auto flex flex-col items-center text-center pt-32 pb-40 px-6"
            >

                <motion.h2
                    variants={item}
                    className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] text-gray-200"
                >

                    Stop Searching

                </motion.h2>

                <motion.h2
                    variants={item}
                    className="text-6xl md:text-8xl font-black tracking-tight text-yellow-500 mt-3 leading-[1.05]"
                >

                    Start Parking

                </motion.h2>

                <motion.p
                    variants={item}
                    className="mt-10 max-w-2xl text-lg text-gray-400 leading-relaxed"
                >

                    A smart parking management system designed to optimize slot allocation,
                    reduce congestion, and enforce operational efficiency — not chaos.

                </motion.p>

                <motion.div
                    variants={item}
                    className="mt-14"
                >

                    <Link to="/dashboard/slots">

                        <button className="bg-yellow-500 text-black px-12 py-5 rounded-xl text-lg font-bold shadow-xl shadow-yellow-500/20 hover:bg-yellow-400 hover:scale-105 transition-all duration-300 active:scale-95">

                            Start Parking

                        </button>

                    </Link>

                </motion.div>

            </motion.section>


            {/* FEATURES */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 px-6 pb-40"
            >

                {[
                    {
                        title: "Real-Time Slot Visibility",
                        desc: "Instantly monitor available and occupied parking slots."
                    },
                    {
                        title: "One-Click Smart Booking",
                        desc: "Reserve parking slots without friction or manual allocation."
                    },
                    {
                        title: "Transparent Fee Tracking",
                        desc: "Clear hourly pricing with automated billing logic."
                    }
                ].map((itemData, i) => (
                    <motion.div
                        variants={item}
                        whileHover={{ scale: 1.05 }}
                        key={i}
                        className="bg-white/[0.03] border border-white/5 p-8 rounded-2xl hover:border-yellow-500/30 transition-all"
                    >

                        <h3 className="text-xl font-semibold mb-4 text-white">
                            {itemData.title}
                        </h3>

                        <p className="text-gray-400 leading-relaxed">
                            {itemData.desc}
                        </p>

                    </motion.div>
                ))}

            </motion.section>


            {/* WORKFLOW */}
            <section className="relative max-w-6xl mx-auto px-6 pb-48">

                <div className="text-center mb-28">

                    <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">

                        The Smart Parking Flow

                    </h2>

                    <p className="text-gray-400 text-lg">

                        From entry to exit — fully automated and controlled.

                    </p>

                </div>

                <div className="absolute left-1/2 top-40 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block"></div>

                <div className="space-y-32 relative">

                    {[
                        {
                            title: "Slot Configuration",
                            desc: "Admin defines parking slots, pricing rules, and structured zones.",
                            align: "right"
                        },
                        {
                            title: "QR-Based Entry",
                            desc: "Driver scans QR code at entry. System logs session instantly.",
                            align: "left"
                        },
                        {
                            title: "Smart Slot Allocation",
                            desc: "System assigns available slot and prevents conflicts.",
                            align: "right"
                        },
                        {
                            title: "Live Monitoring",
                            desc: "Dashboard updates occupancy and parking duration in real-time.",
                            align: "left"
                        },
                        {
                            title: "Exit & Auto Billing",
                            desc: "Exit QR scan calculates fee and frees the slot automatically.",
                            align: "right"
                        }
                    ].map((step, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            key={index}
                            className="grid md:grid-cols-2 gap-12 items-center"
                        >

                            {step.align === "right" ? (
                                <>
                                    <div className="md:text-right">

                                        <p className="text-yellow-500 text-xs font-bold tracking-widest mb-2">
                                            STEP 0{index + 1}
                                        </p>

                                        <h3 className="text-3xl font-bold text-white mb-4">
                                            {step.title}
                                        </h3>

                                        <p className="text-gray-400 leading-relaxed">
                                            {step.desc}
                                        </p>

                                    </div>

                                    <div />

                                </>
                            ) : (
                                <>

                                    <div />

                                    <div>

                                        <p className="text-yellow-500 text-xs font-bold tracking-widest mb-2">
                                            STEP 0{index + 1}
                                        </p>

                                        <h3 className="text-3xl font-bold text-white mb-4">
                                            {step.title}
                                        </h3>

                                        <p className="text-gray-400 leading-relaxed">
                                            {step.desc}
                                        </p>

                                    </div>

                                </>
                            )}

                        </motion.div>
                    ))}

                </div>

            </section>


            {/* FINAL CTA */}
            <section className="relative py-40 px-6 text-center">

                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent pointer-events-none" />

                <div className="relative max-w-4xl mx-auto">

                    <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-200 leading-tight">

                        Don’t leave your parking operations to chance.

                        <br />

                        <span className="text-white">

                            Automate your parking system today.

                        </span>

                    </h2>

                    <p className="mt-8 text-lg text-gray-400">

                        Join modern facilities that replaced manual tracking with structured,
                        QR-powered smart parking infrastructure.

                    </p>

                    <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">

                        <Link to="/login">

                            <button className="bg-yellow-500 text-black px-12 py-5 rounded-xl text-lg font-bold shadow-xl shadow-yellow-500/20 hover:bg-yellow-400 hover:scale-105 transition-all duration-300 active:scale-95">

                                Start Your Smart Parking Journey

                            </button>

                        </Link>

                        <button className="px-10 py-5 rounded-xl text-lg font-semibold text-gray-300 border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all">

                            View Demo

                        </button>

                    </div>

                    <p className="mt-6 text-sm text-gray-500">

                        No complex setup. Scalable infrastructure. Built for real-world parking environments.

                    </p>

                </div>

            </section>


            {/* FOOTER */}
            <footer className="border-t border-white/5 py-10 text-center text-sm text-gray-500">

                © 2026 SmartPark. All rights reserved.

            </footer>

        </div>

    );

};

export default LandingPage;