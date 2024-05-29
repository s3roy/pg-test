import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/Payment.module.css';

const Payment = () => {
  const router = useRouter();
  const [payeeVpa, setPayeeVpa] = useState('s3rinfy@icici');
  const [payeeName, setPayeeName] = useState('Souvik Roy');
  const [amount, setAmount] = useState('1.00');
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay');

  const handlePayment = async () => {
    const upiLink = generateUpiLink({
      payeeVpa: payeeVpa || 's3rinfy@icici',
      payeeName: payeeName || 'Souvik Roy',
      amount: amount || '1.00',
      transactionRef: generateTransactionRef(),
    });

    console.log('Generated UPI Link:', upiLink);

    // Check if the selected UPI app is installed
    const isInstalled = await isAppInstalled(getUrlScheme(selectedUpiApp));
    if (isInstalled) {
      // Attempt to open the UPI link directly
      window.location.href = upiLink;
    } else {
      alert(`${selectedUpiApp} app is not installed on your device.`);
    }
  };

  const generateUpiLink = ({ payeeVpa, payeeName, amount, transactionRef }) => {
    return `upi://pay?pa=${payeeVpa}&pn=${payeeName}&am=${amount}&cu=INR&tn=${transactionRef}`;
  };

  const generateTransactionRef = () => {
    return `ORDER${Date.now()}`;
  };

  const getUrlScheme = (upiApp) => {
    switch (upiApp) {
      case 'GPay':
        return 'tez://';
      case 'PhonePe':
        return 'phonepe://';
      case 'Paytm':
        return 'paytm://';
      default:
        return 'upi://';
    }
  };

  const isAppInstalled = (urlScheme) => {
    return new Promise((resolve) => {
      const start = new Date().getTime();
      const timeout = 1000; // 1 second
      let hasResponded = false;

      const handleFallback = () => {
        if (new Date().getTime() - start < timeout + 100) {
          resolve(false);
          hasResponded = true;
        }
      };

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = urlScheme;
      document.body.appendChild(iframe);

      setTimeout(() => {
        document.body.removeChild(iframe);
        if (!hasResponded) {
          handleFallback();
        }
      }, timeout);

      window.addEventListener('blur', () => {
        if (!hasResponded) {
          resolve(true);
          hasResponded = true;
        }
      });
    });
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
            <option value="Paytm">Paytm</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className={styles.button}>Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
