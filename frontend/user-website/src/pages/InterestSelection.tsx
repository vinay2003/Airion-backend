import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, Heart, Camera, MapPin, Music, Utensils, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '../lib/apiClient';

const INTERESTS = [
    { id: 'venue', label: 'Venues', icon: <Home size={18} /> },
    { id: 'catering', label: 'Catering', icon: <Utensils size={18} /> },
    { id: 'photography', label: 'Photography', icon: <Camera size={18} /> },
    { id: 'decor', label: 'Decorations', icon: <Sparkles size={18} /> },
    { id: 'music', label: 'Music & DJ', icon: <Music size={18} /> },
    { id: 'makeup', label: 'Makeup', icon: <Heart size={18} /> },
    { id: 'planning', label: 'Event Planning', icon: <MapPin size={18} /> },
];

const InterestSelection: React.FC = () => {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.patch('/auth/profile', { interests: selectedInterests });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save interests:', error);
            // Even if it fails, we can proceed to dashboard
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <header className="text-center mb-8">
                    <div className="bg-red-500 text-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles size={24} />
                    </div>
                    <h1 className="text-3xl font-bold dark:text-white">Personalize Your Experience</h1>
                    <p className="text-gray-500 mt-2">Select your interests to get better recommendations</p>
                </header>

                <Card className="border-none shadow-xl bg-white dark:bg-slate-900">
                    <CardHeader>
                        <CardTitle>What are you looking for?</CardTitle>
                        <CardDescription>Select at least 3 categories for the best experience</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {INTERESTS.map((interest) => (
                                <button
                                    key={interest.id}
                                    onClick={() => toggleInterest(interest.id)}
                                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${selectedInterests.includes(interest.id)
                                            ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20'
                                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-red-200 dark:bg-slate-800 dark:border-slate-700'
                                        }`}
                                >
                                    <div className={`mb-3 p-3 rounded-full ${selectedInterests.includes(interest.id) ? 'bg-red-100 text-red-600' : 'bg-white dark:bg-slate-700 shadow-sm'
                                        }`}>
                                        {interest.icon}
                                    </div>
                                    <span className="font-medium text-sm">{interest.label}</span>
                                    {selectedInterests.includes(interest.id) && (
                                        <div className="absolute top-2 right-2 text-red-500">
                                            <Check size={16} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 flex justify-between items-center">
                            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                                Skip for now
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={selectedInterests.length < 1 || loading}
                                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-red-200 dark:shadow-none"
                            >
                                {loading ? 'Saving...' : 'Get Started'}
                                {!loading && <ArrowRight size={20} className="ml-2" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default InterestSelection;
