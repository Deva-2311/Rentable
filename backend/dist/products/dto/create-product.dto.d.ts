export declare class CreateProductDto {
    name: string;
    description: string;
    category: string;
    images?: string[];
    pricePerDay: number;
    securityDeposit: number;
    condition: string;
    location: string;
    availability?: boolean;
    rentalRules?: string;
    cancellationPolicy?: string;
}
