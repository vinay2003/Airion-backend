import React from 'react';
import SEO from '../components/SEO';

const AboutUs: React.FC = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            <SEO title="About Us" description="We bring your vision to life. Airion is your trusted partner for unforgettable events." />
            {/* Hero Section */}
            <div className="relative py-20 bg-gray-50 dark:bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        We Create <span className="text-red-500 font-cursive">Memories</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Airion is your trusted partner in crafting unforgettable events. From intimate gatherings to grand celebrations, we bring your vision to life.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 border border-gray-100 dark:border-slate-700">
                    {[
                        { label: 'Events Planned', value: '500+' },
                        { label: 'Happy Clients', value: '10k+' },
                        { label: 'Verified Vendors', value: '250+' },
                        { label: 'Cities Covered', value: '15+' },
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">{stat.value}</div>
                            <div className="text-sm text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story & Vision */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-24">
                {/* Our Story */}
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop"
                                alt="Our Story"
                                className="rounded-3xl shadow-2xl relative z-10"
                            />
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                            Founded by a team of passionate event enthusiasts, Airion was born out of a shared vision to make event planning an enjoyable and seamless experience. We understand the stress that comes with organizing special moments, and we're here to change that.
                        </p>
                        <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed">
                            What started as a small idea has grown into a comprehensive platform connecting thousands of people with the perfect venues and vendors for their celebrations.
                        </p>
                    </div>
                </div>

                {/* Our Vision */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="md:w-1/2">
                        <div className="relative">
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop"
                                alt="Our Vision"
                                className="rounded-3xl shadow-2xl relative z-10"
                            />
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Vision</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                            We aim to be the go-to platform for anyone seeking the perfect venue, delectable catering, and a plethora of additional services. Our goal is to democratize event planning, making premium experiences accessible to everyone.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Simplifying the booking process',
                                'Ensuring transparency and trust',
                                'Supporting local vendors and businesses',
                                'Creating unforgettable experiences'
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-slate-300">
                                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-50 dark:bg-slate-900 py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Meet the Team</h2>
                    <div className="flex justify-center">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-700 max-w-sm hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-red-50 dark:border-red-900/20">
                                <img
                                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop"
                                    alt="Naif Farooqui"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Naif Farooqui</h3>
                            <p className="text-red-500 font-medium mb-4">Lead Designer & Developer</p>
                            <p className="text-gray-600 dark:text-slate-400 text-sm">
                                Passionate about creating intuitive and beautiful digital experiences. Leading the technical and design vision for Airion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
