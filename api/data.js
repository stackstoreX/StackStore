// api/data.js
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const SUPABASE_URL = 'https://itmsrggznasayrtckxgt.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bXNyZ2d6bmFzYXlydGNreGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODQxMzMsImV4cCI6MjEwMDY2MDEzM30.FWS3hIbcVhlln-iEKN-8HD0-y7ohwhIDoKZ27xrE4hs';

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    const [productsRes, categoriesRes, deliveriesRes, reviewsRes, testimonialsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=sort_order.asc`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/categories?select=*&order=sort_order.asc`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/deliveries?select=*&order=created_at.desc`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/reviews?select=*&order=created_at.desc`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/testimonials?select=*`, { headers })
    ]);

    const [products, categories, deliveries, reviews, testimonials] = await Promise.all([
      productsRes.json(),
      categoriesRes.json(),
      deliveriesRes.json(),
      reviewsRes.json(),
      testimonialsRes.json()
    ]);

    res.status(200).json({ products, categories, deliveries, reviews, testimonials });

  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
}