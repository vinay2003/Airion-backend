import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../lib/api';
// UI imports would normally go here - assuming shadcn/ui components exist or using standard HTML for now to avoid specific UI lib dependency errors if not fully set up
// Replacing specific UI components with HTML/Tailwind for broader compatibility based on current setup

const vendorProfileSchema = z.object({
    businessName: z.string().min(3, 'Business name must be at least 3 characters'),
    businessEmail: z.string().email('Invalid email address'),
    businessPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
    businessDescription: z.string().min(50, 'Description must be at least 50 characters'),
    categoryId: z.string().min(1, 'Please select a category'),
    subcategoryId: z.string().min(1, 'Please select a subcategory'),
    pricingTier: z.enum(['basic', 'premium', 'enterprise']),
    businessHours: z.any().optional(), // Simplifying for initial implementation
    portfolioImages: z.array(z.string()).optional(),
    socialLinks: z.object({
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        website: z.string().optional(),
    }).optional(),
});

const VendorProfileEditor = () => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(vendorProfileSchema),
    });

    const selectedCategory = watch('categoryId');

    useEffect(() => {
        fetchCategories();
        fetchVendorProfile();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchSubcategories(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (e) { console.error(e) }
    };

    const fetchSubcategories = async (categoryId: string) => {
        try {
            const response = await api.get(`/categories/${categoryId}/subcategories`);
            setSubcategories(response.data);
        } catch (e) { console.error(e) }
    };

    const fetchVendorProfile = async () => {
        try {
            const response = await api.get('/vendors/me');
            const profile = response.data;
            if (profile && !profile.message) {
                type VendorProfileData = z.infer<typeof vendorProfileSchema>;
                Object.keys(profile).forEach((key) => {
                    // key needs to be cast because Object.keys returns string[]
                    setValue(key as any, profile[key]);
                });
            }
        } catch (error) {
            console.error('Failed to load profile', error);
        }
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            // Check if updating or creating
            const current = await api.get('/vendors/me');
            if (current.data && !current.data.message) {
                await api.put('/vendors/me', data);
            } else {
                await api.post('/vendors', data);
            }
            alert('Profile saved successfully!');
        } catch (error) {
            alert('Failed to save profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Business Profile</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Business Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Business Name</label>
                        <input
                            {...register('businessName')}
                            className="w-full p-2 border rounded"
                            placeholder="Your Business Name"
                        />
                        {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Business Email</label>
                        <input
                            type="email"
                            {...register('businessEmail')}
                            className="w-full p-2 border rounded"
                        />
                        {errors.businessEmail && <p className="text-red-500 text-sm">{errors.businessEmail.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Business Phone</label>
                        <input
                            type="tel"
                            {...register('businessPhone')}
                            className="w-full p-2 border rounded"
                        />
                        {errors.businessPhone && <p className="text-red-500 text-sm">{errors.businessPhone.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Pricing Tier</label>
                        <select {...register('pricingTier')} className="w-full p-2 border rounded">
                            <option value="basic">Basic</option>
                            <option value="premium">Premium</option>
                            <option value="enterprise">Enterprise</option>
                        </select>
                    </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select {...register('categoryId')} className="w-full p-2 border rounded">
                            <option value="">Select Category</option>
                            {categories.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Subcategory</label>
                        <select {...register('subcategoryId')} className="w-full p-2 border rounded" disabled={!selectedCategory}>
                            <option value="">Select Subcategory</option>
                            {subcategories.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.subcategoryId && <p className="text-red-500 text-sm">{errors.subcategoryId.message as string}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        {...register('businessDescription')}
                        rows={4}
                        className="w-full p-2 border rounded"
                    />
                    {errors.businessDescription && <p className="text-red-500 text-sm">{errors.businessDescription.message as string}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default VendorProfileEditor;
