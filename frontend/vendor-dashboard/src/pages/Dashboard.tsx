import React, { useEffect, useState } from 'react';
import VendorProfileEditor from '../components/VendorProfileEditor';
import api from '../lib/api';

const Dashboard = () => {
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkVendorStatus();
    }, []);

    const checkVendorStatus = async () => {
        try {
            const response = await api.get('/vendors/me');
            if (response.data && !response.data.message) {
                setVendor(response.data);
            }
        } catch (error) {
            console.log('User is not yet a vendor');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    if (!vendor) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">Welcome to Airion!</h1>
                    <p className="text-gray-700">To start accepting bookings, please complete your business profile below.</p>
                </div>
                <VendorProfileEditor />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {vendor.businessName}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {vendor.isVerified ? 'Verified Vendor' : 'Pending Verification'}
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Bookings</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">₹0.00</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Average Rating</h3>
                    <p className="text-3xl font-bold text-yellow-500 mt-2">{vendor.rating || 'New'}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create New Service</button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">View Bookings</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
