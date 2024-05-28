import { useState, useEffect } from 'react';
import styles from '../styles/Payment.module.css';

const Payment = () => {
  const [payeeVpa, setPayeeVpa] = useState('s3rinfy@icici');
  const [payeeName, setPayeeName] = useState('Souvik Roy');
  const [amount, setAmount] = useState('1.00');

  useEffect(() => {
    // Function to open the chooser on Android
    const openChooser = (upiLink) => {
      const a = document.createElement('a');
      a.href = upiLink;
      a.click();
    };

    window.openChooser = openChooser;
  }, []);

  const handlePayment = () => {
    const upiLink = generateUpiLink({
      payeeVpa: payeeVpa || 's3rinfy@icici',
      payeeName: payeeName || 'Souvik Roy',
      amount: amount || '1.00',
      transactionRef: generateTransactionRef(),
    });

    console.log('Generated UPI Link:', upiLink);

    if (/android/i.test(navigator.userAgent)) {
      const chooserIntent = `intent://pay?pa=${encodeURIComponent(payeeVpa)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&tn=${encodeURIComponent(generateTransactionRef())}&cu=INR#Intent;scheme=upi;package=null;end`;
      window.openChooser(chooserIntent);
    } else {
      window.location.href = upiLink;
    }
  };

  const generateUpiLink = ({ payeeVpa, payeeName, amount, transactionRef }) => {
    return `upi://pay?pa=${encodeURIComponent(payeeVpa)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&tn=${encodeURIComponent(transactionRef)}&cu=INR`;
  };

  const generateTransactionRef = () => {
    return `ORDER${Date.now()}`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pay using UPI</h1>
      <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Payee VPA:</label>
          <input type="text" value={payeeVpa} onChange={(e) => setPayeeVpa(e.target.value)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Payee Name:</label>
          <input type="text" value={payeeName} onChange={(e) => setPayeeName(e.target.value)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Amount:</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className={styles.input} />
        </div>
        <button type="submit" className={styles.button}>Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
