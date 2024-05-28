import { useEffect } from 'react';
import styles from '../styles/Payment.module.css';

const RazorpayPayment = () => {

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: 'rzp_test_QCrqL8LJiY3bHW', // Enter the Key ID generated from the Dashboard
      amount: 100, // Amount is in currency subunits. Default currency is INR. Hence, 100 refers to 100 paise
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Test Transaction',
      image: 'https://yourlogo.com/logo.png',
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'Razorpay Corporate Office'
      },
      theme: {
        color: '#3399cc'
      },
      method: {
        upi: true, // Enable UPI method
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pay using Razorpay</h1>
      <button onClick={handlePayment} className={styles.button}>Pay Now</button>
    </div>
  );
};

export default RazorpayPayment;
