import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getModelToken } from '@nestjs/mongoose';
import { Booking } from './schemas/booking.schema';
import { ProductsService } from '../products/products.service';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBookingModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  };

  const mockProductsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getModelToken(Booking.name),
          useValue: mockBookingModel,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw error if product is not available', async () => {
      mockProductsService.findById.mockResolvedValueOnce({ availability: false });

      await expect(
        service.create('user1', { product: 'prod1', startDate: '2026-10-01', endDate: '2026-10-05' } as any),
      ).rejects.toThrow('Product is not currently available');
    });

    it('should throw error if dates overlap', async () => {
      mockProductsService.findById.mockResolvedValueOnce({
        _id: 'prod1',
        availability: true,
        pricePerDay: 100,
        securityDeposit: 50,
        owner: 'owner1',
      });

      // Mock that an overlapping booking is found
      mockBookingModel.findOne.mockResolvedValueOnce({ _id: 'overlap_booking' });

      await expect(
        service.create('user1', { product: 'prod1', startDate: '2026-10-01', endDate: '2026-10-05' } as any),
      ).rejects.toThrow('Product is already booked for the selected dates. Please choose different dates.');
    });
  });
});
