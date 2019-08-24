import { ReceiptTypeFilterPipe } from './receipt-type-filter.pipe';

describe('PaymentTypeFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new ReceiptTypeFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
