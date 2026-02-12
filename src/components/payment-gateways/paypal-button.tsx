'use client'

import {
  PayPalScriptProvider,
  PayPalButtons,
  type OnApproveData,
  type OnApproveActions,
  type CreateOrderData,
  type CreateOrderActions
} from '@paypal/react-paypal-js'

interface PayPalButtonsWrapperProps {
  amount: string;
  onInitiatePayment: () => Promise<boolean>;
  onSuccess: (details: { transactionId: string }) => void;
  onError: (error: { message: string }) => void;
}

export const PayPalButtonsWrapper = ({ amount: inrAmount, onInitiatePayment, onSuccess, onError }: PayPalButtonsWrapperProps) => {

  // For this prototype, we'll use a fixed conversion rate.
  // In a real-world application, you would fetch this from a reliable currency conversion API.
  const INR_TO_USD_RATE = 83;
  const amountInUsd = (parseFloat(inrAmount) / INR_TO_USD_RATE).toFixed(2);


  const createOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
    // This function sets up the details of the transaction, including the amount.
    // It's called when the PayPal button is clicked.
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amountInUsd,
            currency_code: 'USD',
          },
        },
      ],
    });
  };

  const onApprove = (data: OnApproveData, actions: OnApproveActions) => {
    // This function captures the funds from the transaction.
    // It is called after the buyer approves the payment.
    return actions.order!.capture().then(function (details) {
      onSuccess({ transactionId: data.orderID });
    });
  }
  
  const onClick = async (data: Record<string, unknown>, actions: any) => {
    const canProceed = await onInitiatePayment();
    if (!canProceed) {
      // Reject the promise to prevent the PayPal modal from opening
      return actions.reject();
    }
    return actions.resolve();
  }

  const handleOnError = (err: any) => {
     onError({ message: 'An error occurred with the PayPal transaction or it was cancelled.' });
     console.error("PayPal Checkout onError", err);
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
        currency: 'USD',
      }}
    >
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={handleOnError}
        onClick={onClick}
      />
    </PayPalScriptProvider>
  )
}
