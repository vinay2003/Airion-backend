import React from 'react';
import SEO from '../components/SEO';

const AboutUs: React.FC = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            <SEO title="About Us" description="We bring your vision to life. Ease2event is your trusted partner for unforgettable events." />


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
                        <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed mb-6 font-medium">
                            Founded by a team of passionate event architects, Ease2event was engineered with a mission to make event orchestration a seamless, premium experience. We eliminate the friction of organizing complex celebrations.
                        </p>
                        <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                            What started as a disruptive idea has evolved into a global marketplace connecting the world with verified venues and elite vendors.
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

        </div>
    );
};

export default AboutUs;
