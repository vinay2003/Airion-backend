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
}

export interface Category {
    title: string;
    image: string;
    link: string;
}
