import axios from 'axios';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { link, quantity, serviceId } = req.body;

  if (!link || !quantity || !serviceId) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiToken = process.env.API_TOKEN;

    // ============================================================
    // CRITICAL: Adjust these parameters based on zefame.com's actual API documentation
    // Common patterns for SMM APIs:
    // ============================================================
    
    // Pattern 1: URL parameters (GET style)
    // const requestUrl = `${apiUrl}?key=${apiToken}&action=add&service=${serviceId}&link=${encodeURIComponent(link)}&quantity=${quantity}`;
    
    // Pattern 2: POST form data (MOST COMMON)
    const params = new URLSearchParams();
    params.append('key', apiToken);
    params.append('action', 'add');
    params.append('service', serviceId);
    params.append('link', link);
    params.append('quantity', quantity);
    
    // Pattern 3: JSON payload (if API expects JSON)
    // const payload = {
    //   key: apiToken,
    //   action: 'add',
    //   service: serviceId,
    //   link: link,
    //   quantity: quantity
    // };

    console.log(`Sending order to: ${apiUrl}`);
    console.log(`Service ID: ${serviceId}, Quantity: ${quantity}, Link: ${link}`);

    // Try Pattern 2 (form data) first
    const response = await axios.post(apiUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 30000 // 30 seconds timeout
    });

    // Log the actual response from the API
    console.log('API Response:', response.data);

    // Check if the order was successful
    // NOTE: You need to inspect the actual response format from zefame.com
    // Common response formats:
    // { "order": 12345, "balance": 10.50 }  -> success
    // { "error": "Insufficient balance" }    -> failure
    
    let success = false;
    let orderId = null;
    let status = 'Pending';
    let balance = '0.00';
    let message = '';

    // This logic MUST be adjusted based on actual API response
    if (response.data && !response.data.error) {
      success = true;
      orderId = response.data.order || response.data.id || 'N/A';
      balance = response.data.balance || '0.00';
      status = response.data.status || 'Processing';
      message = response.data.message || 'Order received successfully';
    } else {
      success = false;
      message = response.data.error || response.data.message || 'API returned an error';
    }

    if (success) {
      return res.status(200).json({
        success: true,
        order_id: orderId,
        status: status,
        balance: balance,
        message: message
      });
    } else {
      return res.status(400).json({
        success: false,
        message: message
      });
    }

  } catch (error) {
    console.error('API Error:', error.message);
    
    let errorMessage = 'Failed to connect to SMM service. ';
    
    if (error.response) {
      // The API responded with an error status code
      errorMessage += `API returned: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
      console.error('API Error Response:', error.response.data);
    } else if (error.request) {
      // No response received from API
      errorMessage += 'No response from API server. Please check if the API URL is correct.';
    } else {
      errorMessage += error.message;
    }
    
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}
