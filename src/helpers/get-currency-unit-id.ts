const USD_ID = '2eGL8drmSYAqLoetcx3yR1';
const EUR_ID = 'EWCAJP9TQoZ3EhcwyRg7mk';
const GBP_ID = 'KSeVvJLfx8LZb36CfYMti5';

export const getCurrencyUnitId = (currency: 'USD' | 'EUR' | 'GBP') => {
  switch (currency) {
    case 'USD':
      return USD_ID;
    case 'EUR':
      return EUR_ID;
    case 'GBP':
      return GBP_ID;
    default:
      return USD_ID;
  }
};
