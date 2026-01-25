export interface Event {
    id: string;
    title: string;
    category: string;
    image: string;
    rating: number;
    location: string;
    reviews: number;
    price: string;
    capacity: string;
    description: string;
}

export interface Category {
    title: string;
    image: string;
    link: string;
}
