import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [serviceId, setServiceId] = useState('248');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/order', {
        link: link,
        quantity: quantity,
        serviceId: serviceId
      });

      if (response.data.success) {
        setResult(response.data);
        setLink('');
      } else {
        setError(response.data.message || 'Order failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>The Edge Free SMM - Free Social Media Boosts</title>
        <meta name="description" content="Get free followers, likes, and views for Instagram, TikTok, YouTube, and more." />
      </Head>

      <main className={styles.main}>
        <div className={styles.glowOrb}></div>
        <h1 className={styles.title}>⚡ The Edge Free SMM</h1>
        <p className={styles.subtitle}>Free Social Media Marketing Panel</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>📱 Social Media Link</label>
            <input
              type="url"
              placeholder="https://instagram.com/username/post"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>🎯 Service ID</label>
              <input
                type="text"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className={styles.inputSmall}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>🔢 Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max="10000"
                className={styles.inputSmall}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? '🚀 Processing Order...' : '💎 Get Free Boost'}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {result && (
          <div className={styles.result}>
            <h3>✅ Order Placed Successfully!</h3>
            <p><strong>Order ID:</strong> {result.order_id}</p>
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Remaining Balance:</strong> ${result.balance}</p>
          </div>
        )}

        <div className={styles.services}>
          <h2>🔥 Available Free Services</h2>
          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>📸 Instagram Followers</div>
            <div className={styles.serviceCard}>❤️ Instagram Likes</div>
            <div className={styles.serviceCard}>🎵 TikTok Followers</div>
            <div className={styles.serviceCard}>▶️ YouTube Views</div>
            <div className={styles.serviceCard}>🐦 Twitter Followers</div>
            <div className={styles.serviceCard}>👍 Facebook Reactions</div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>The Edge Free SMM © 2025 | Powered by Zefame API</p>
      </footer>
    </div>
  );
    }
