import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';
import { BookingsService } from '../bookings/bookings.service';
import { RentalsService } from '../rentals/rentals.service';
import { ConfigService } from '@nestjs/config';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPaymentModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockBookingsService = {
    findById: jest.fn(),
    internalUpdateStatus: jest.fn(),
    internalUpdatePaymentStatus: jest.fn(),
  };

  const mockRentalsService = {
    createRental: jest.fn(),
    getAllRentals: jest.fn().mockResolvedValue([]),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getModelToken(Payment.name),
          useValue: mockPaymentModel,
        },
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
        {
          provide: RentalsService,
          useValue: mockRentalsService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
