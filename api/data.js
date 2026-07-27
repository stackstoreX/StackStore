export default async function handler(req, res) {
  // ❌ منع أي Cache خالص
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const SUPABASE_URL = 'https://itmsrggznasayrtckxgt.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bXNyZ2d6bmFzYXlydGNreGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODQxMzMsImV4cCI6MjEwMDY2MDEzM30.FWS3hIbcVhlln-iEKN-8HD0-y7ohwhIDoKZ27xrE4hs';

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };

  // ⏱️ Timeout لكل request لوحده (8 ثواني)
  const fetchWithTimeout = (url, options, timeout = 8000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  };

  // 🔄 Retry mechanism (يحاول 3 مرات)
  const fetchWithRetry = async (url, options, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetchWithTimeout(url, options);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        return await response.json();
      } catch (err) {
        if (i === retries) throw err;
        await new Promise(r => setTimeout(r, 600 * (i + 1))); // wait 600ms, 1200ms
      }
    }
  };

  try {
    const [products, categories, deliveries, reviews, testimonials] = await Promise.all([
      fetchWithRetry(`${SUPABASE_URL}/rest/v1/products?select=*&order=sort_order.asc.nullslast`, { headers }),
      fetchWithRetry(`${SUPABASE_URL}/rest/v1/categories?select=*&order=sort_order.asc.nullslast`, { headers }),
      fetchWithRetry(`${SUPABASE_URL}/rest/v1/deliveries?select=*&order=created_at.desc`, { headers }),
      fetchWithRetry(`${SUPABASE_URL}/rest/v1/reviews?select=*&order=created_at.desc`, { headers }),
      fetchWithRetry(`${SUPABASE_URL}/rest/v1/testimonials?select=*`, { headers })
    ]);

    res.status(200).json({ 
      success: true,
      products: products || [],
      categories: categories || [],
      deliveries: deliveries || [],
      reviews: reviews || [],
      testimonials: testimonials || [],
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('API Error:', err.message);
    res.status(500).json({ 
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
}