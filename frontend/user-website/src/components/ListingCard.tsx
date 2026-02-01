import React, { useState } from 'react';
import { Star, MapPin, Wifi, Car, Check, Heart, Share2, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ListingCardProps {
    id: string;
    image: string;
    title: string;
    rating: number;
    reviews: number;
    location: string;
    price: string;
    description: string;
    capacity?: string;
}

import { motion } from 'framer-motion';

const ListingCard: React.FC<ListingCardProps> = ({ id, image, title, rating, reviews, location, price, description, capacity }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 flex flex-col cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Link to={`/event/${id}`} className="block h-full w-full">
                    <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </Link>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-md shadow-sm">
                    {rating}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col gap-2">
                <Link to={`/event/${id}`}>
                    <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition-colors line-clamp-2">
                        {title}
                    </h3>
                </Link>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={`${i < Math.round(rating / 2) ? "fill-orange-500 text-orange-500" : "fill-gray-200 text-gray-200 dark:text-slate-700"}`}
                        />
                    ))}
                </div>

                {/* Location */}
                <div className="flex items-start gap-1 text-blue-600 dark:text-blue-400 font-medium text-sm">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{location}</span>
                </div>

                {/* Price Section */}
                <div className="mt-1">
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Per night before taxes and fees</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-500">
                        {price}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ListingCard;
