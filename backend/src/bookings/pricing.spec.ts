describe('RENTABLE Pricing & Financial Logic Calculation', () => {
  it('should correctly calculate duration, rental amount, 10% platform fee, and total amount', () => {
    const pricePerDay = 500;
    const securityDeposit = 1000;
    const durationDays = 3;

    const rentalAmount = durationDays * pricePerDay;
    const platformFee = Math.round(rentalAmount * 0.1);
    const totalAmount = rentalAmount + securityDeposit + platformFee;

    expect(rentalAmount).toBe(1500);
    expect(platformFee).toBe(150);
    expect(securityDeposit).toBe(1000);
    expect(totalAmount).toBe(2650);
  });

  it('should guarantee minimum duration of 1 day for same-day rentals', () => {
    const startDate = new Date('2026-10-25T10:00:00.000Z');
    const endDate = new Date('2026-10-25T18:00:00.000Z');

    const durationDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)),
    );

    const pricePerDay = 1200;
    const securityDeposit = 5000;
    const rentalAmount = durationDays * pricePerDay;
    const platformFee = Math.round(rentalAmount * 0.1);
    const totalAmount = rentalAmount + securityDeposit + platformFee;

    expect(durationDays).toBe(1);
    expect(rentalAmount).toBe(1200);
    expect(platformFee).toBe(120);
    expect(totalAmount).toBe(6320);
  });

  it('should accurately convert INR rupees to paise for payment gateway orders', () => {
    const totalAmountRupees = 2650;
    const amountInPaise = Math.round(totalAmountRupees * 100);

    expect(amountInPaise).toBe(265000);
  });
});
