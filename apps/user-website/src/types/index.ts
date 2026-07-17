export interface EventPackage {
    title: string;
    price: string;
    desc: string;
    features: string[];
}

export interface Event {
    id: string;
    vendorId?: string;
    title: string;
    category: string;
    image: string;
    images?: string[];
    rating: number;
    location: string;
    reviews: number;
    price: string;
    capacity: string;
    description: string;
    amenities?: string[];
    packages?: EventPackage[];
}

export interface Category {
    title: string;
    image: string;
    link: string;
}
