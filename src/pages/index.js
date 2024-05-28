import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/Payment.module.css';

const Payment = () => {
  const router = useRouter();
  const [payeeVpa, setPayeeVpa] = useState('s3rinfy@icici');
  const [payeeName, setPayeeName] = useState('Souvik Roy');
  const [amount, setAmount] = useState('1.00');
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay');

  const handlePayment = () => {
    const upiLink = generateUpiLink({
      payeeVpa: payeeVpa || 's3rinfy@icici',
      payeeName: payeeName || 'Souvik Roy',
      amount: amount || '1.00',
      transactionRef: generateTransactionRef(),
    });

    // Open the UPI link
    window.location.href = upiLink;
  };

  const generateUpiLink = ({ payeeVpa, payeeName, amount, transactionRef }) => {
    const baseLink = `upi://pay?pa=${payeeVpa}&pn=${payeeName}&am=${amount}&tn=${transactionRef}&cu=INR`;
    if (selectedUpiApp === 'GPay') {
      return `googlepay://pay?${baseLink}`;
    } else if (selectedUpiApp === 'PhonePe') {
      return `phonepe://pay?${baseLink}`;
    } else {
      return baseLink;
    }
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
        <div className={styles.formGroup}>
          <label className={styles.label}>Select UPI App:</label>
          <select value={selectedUpiApp} onChange={(e) => setSelectedUpiApp(e.target.value)} className={styles.input}>
            <option value="GPay">Google Pay</option>
            <option value="PhonePe">PhonePe</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className={styles.button}>Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
