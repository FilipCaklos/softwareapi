import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user, setUser, apiUrl }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [subscriptionData, setSubscriptionData] = useState(user);
  const [extensionDays, setExtensionDays] = useState('30');

  useEffect(() => {
    // Refresh subscription data on mount
    fetchSubscriptionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubscriptionData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${apiUrl}/api/subscription/${user.userId}`);
      if (response.data.success) {
        setSubscriptionData(response.data);
      }
    } catch (err) {
      setError('Failed to fetch subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleExtendSubscription = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/subscription/extend`, {
        userId: user.userId,
        additionalDays: parseInt(extensionDays)
      });

      if (response.data.success) {
        setSuccess(`Subscription extended by ${extensionDays} days!`);
        setSubscriptionData({
          ...subscriptionData,
          expiryDate: response.data.newExpiryDate,
          daysRemaining: response.data.daysRemaining,
          status: response.data.daysRemaining > 0 ? 'active' : 'expired'
        });
        setUser({
          ...user,
          daysRemaining: response.data.daysRemaining,
          expiryDate: response.data.newExpiryDate
        });
        setExtensionDays('30');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to extend subscription');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'status-active' : 'status-expired';
  };

  return (
    <div className="dashboard">
      <h2>Subscription Dashboard</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="subscription-info">
        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-value">{subscriptionData.email}</span>
        </div>

        <div className="info-row">
          <span className="info-label">User ID:</span>
          <span className="info-value" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {subscriptionData.userId}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Status:</span>
          <span className={`info-value status-badge ${getStatusColor(subscriptionData.status)}`}>
            {subscriptionData.status.toUpperCase()}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Days Remaining:</span>
          <span className="info-value">
            <strong>{subscriptionData.daysRemaining}</strong> days
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Expiry Date:</span>
          <span className="info-value">{formatDate(subscriptionData.expiryDate)}</span>
        </div>

        {subscriptionData.createdAt && (
          <div className="info-row">
            <span className="info-label">Account Created:</span>
            <span className="info-value">{formatDate(subscriptionData.createdAt)}</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#333', marginTop: 0 }}>Extend Subscription</h3>
        <form onSubmit={handleExtendSubscription}>
          <div className="form-group">
            <label htmlFor="extensionDays">Additional Days</label>
            <select
              id="extensionDays"
              value={extensionDays}
              onChange={(e) => setExtensionDays(e.target.value)}
              disabled={loading}
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">365 days</option>
            </select>
          </div>

          <div className="form-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Extending...' : 'Extend Subscription'}
            </button>
          </div>
        </form>
      </div>

      <button
        onClick={fetchSubscriptionData}
        disabled={loading}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </button>
    </div>
  );
}

export default Dashboard;
