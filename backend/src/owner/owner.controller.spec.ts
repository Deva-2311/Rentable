import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OwnerController } from './owner.controller';
import { Product } from '../products/schemas/product.schema';
import { Booking } from '../bookings/schemas/booking.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { Rental } from '../rentals/schemas/rental.schema';

describe('OwnerController', () => {
  let controller: OwnerController;

  const mockModel = {
    find: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnerController],
      providers: [
        {
          provide: getModelToken(Product.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(Booking.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(Payment.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(Rental.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    controller = module.get<OwnerController>(OwnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
