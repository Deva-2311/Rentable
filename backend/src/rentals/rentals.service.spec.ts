import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RentalsService } from './rentals.service';
import { Rental } from './schemas/rental.schema';
import { BookingsService } from '../bookings/bookings.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

describe('RentalsService', () => {
  let service: RentalsService;

  const mockRentalModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockBookingsService = {
    findById: jest.fn(),
    internalUpdateStatus: jest.fn(),
  };

  const mockNotificationsGateway = {
    notifyUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: getModelToken(Rental.name),
          useValue: mockRentalModel,
        },
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
        {
          provide: NotificationsGateway,
          useValue: mockNotificationsGateway,
        },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
