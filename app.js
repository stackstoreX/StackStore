// ====== STACK STORE - APP.JS ======
// Complete Store with Products, Deliveries, Reviews & Admin
// FIXED: All data now syncs to Supabase as primary source

const ADMIN_CODE = 'STACK9';
const ADMIN_KEY = 'stackstore_admin_device';
const WHATSAPP_NUMBER = '201018484572';

const SUPABASE_URL = 'https://itmsrggznasayrtckxgt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bXNyZ2d6bmFzYXlydGNreGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODQxMzMsImV4cCI6MjEwMDY2MDEzM30.FWS3hIbcVhlln-iEKN-8HD0-y7ohwhIDoKZ27xrE4hs';

let supabaseClient = null;
let products = [];
let deliveries = [];
let reviews = [];
let categories = [];
const defaultCategories = [
    { id: 'all', name: 'الكل', icon: '<i class="fas fa-layer-group"></i>' },
    { id: 'editing', name: 'مونتاج', icon: '<i class="fas fa-film"></i>' },
    { id: 'design', name: 'تصميم', icon: '<i class="fas fa-pen-nib"></i>' },
    { id: 'ai', name: 'Ai', icon: '<i class="fas fa-robot"></i>' },
    { id: 'other', name: 'أخرى', icon: '<i class="fas fa-box-open"></i>' }
];
let isAdmin = false;
let isLoading = true;
let currentProduct = null;
let editingProductId = null;
let selectedRating = 0;
let publicSelectedRating = 0;
let currentFilter = 'all';
let testimonials = [];
const sampleTestimonials = [
    { id: 1, image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400', name: 'عميل 1' },
    { id: 2, image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400', name: 'عميل 2' },
    { id: 3, image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400', name: 'عميل 3' },
    { id: 4, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', name: 'عميل 4' },
    { id: 5, image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400', name: 'عميل 5' }
];

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x250/1e293b/94a3b8?text=No+Image';

const sampleProducts = [
    {
        id: 1,
        name: 'Netflix Premium',
        description: 'اشتراك Netflix بريميوم 4K UHD مع دعم 4 شاشات في نفس الوقت. تفعيل فوري على الإيميل الشخصي أو حساب جاهز.',
        image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600',
        category: 'streaming',
        status: 'available',
        prices: [
            { duration: 'شهر', price: 45, originalPrice: 70 },
            { duration: '3 شهور', price: 120, originalPrice: 210 },
            { duration: '6 شهور', price: 220, originalPrice: 420 },
            { duration: 'سنة', price: 400, originalPrice: 840 }
        ],
        detail_image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200',
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Spotify Premium',
        description: 'اشتراك Spotify بريميوم بدون إعلانات مع جودة صوت عالية وتخطي غير محدود.',
        image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600',
        category: 'music',
        status: 'available',
        prices: [
            { duration: 'شهر', price: 35, originalPrice: 50 },
            { duration: '3 شهور', price: 90, originalPrice: 150 },
            { duration: 'سنة', price: 300, originalPrice: 600 }
        ],
        detail_image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1200',
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        name: 'YouTube Premium',
        description: 'YouTube Premium بدون إعلانات مع YouTube Music وتحميل الفيديوهات.',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600',
        category: 'streaming',
        status: 'available',
        prices: [
            { duration: 'شهر', price: 40, originalPrice: 60 },
            { duration: '3 شهور', price: 100, originalPrice: 180 },
            { duration: 'سنة', price: 350, originalPrice: 720 }
        ],
        detail_image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200',
        created_at: new Date().toISOString()
    },
    {
        id: 4,
        name: 'ExpressVPN',
        description: 'ExpressVPN سريع وآمن مع سيرفرات في 94 دولة ودعم جميع الأجهزة.',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
        category: 'vpn',
        status: 'available',
        prices: [
            { duration: 'شهر', price: 50, originalPrice: 80 },
            { duration: '3 شهور', price: 130, originalPrice: 240 },
            { duration: 'سنة', price: 450, originalPrice: 960 }
        ],
        detail_image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200',
        created_at: new Date().toISOString()
    },
    {
        id: 5,
        name: 'Xbox Game Pass Ultimate',
        description: 'Xbox Game Pass Ultimate مع مكتبة ألعاب ضخمة و Xbox Live Gold.',
        image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600',
        category: 'gaming',
        status: 'out_of_stock',
        prices: [
            { duration: 'شهر', price: 55, originalPrice: 85 },
            { duration: '3 شهور', price: 150, originalPrice: 255 }
        ],
        detail_image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=1200',
        created_at: new Date().toISOString()
    },
    {
        id: 6,
        name: 'ChatGPT Plus',
        description: 'اشتراك ChatGPT Plus مع GPT-4 و أدوات متقدمة و سرعة أعلى.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
        category: 'other',
        status: 'coming_soon',
        prices: [
            { duration: 'شهر', price: 60, originalPrice: 100 }
        ],
        detail_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
        created_at: new Date().toISOString()
    }
];

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Stack Store initializing...');
    isAdmin = localStorage.getItem(ADMIN_KEY) === 'true';
    initSupabase();
    setupEventListeners();
    setupStarRatings();
    setupFilters();
    checkAdminStatus();
    await loadData();
    console.log('Stack Store ready!');
});

function initSupabase() {
    try {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client initialized');
        } else {
            console.warn('Supabase library not loaded yet, will retry...');
            setTimeout(initSupabase, 500);
        }
    } catch (e) {
        console.error('Supabase init failed:', e);
        supabaseClient = null;
    }
}

async function loadData() {
    isLoading = true;
    renderSkeletons();

    // 🚀 اعرض الكاش المحلي فوراً
    var cachedProducts = localStorage.getItem('stackstore_products');
    var cachedCategories = localStorage.getItem('stackstore_categories');
    var cachedDeliveries = localStorage.getItem('stackstore_deliveries');
    var cachedReviews = localStorage.getItem('stackstore_reviews');
    var cachedTestimonials = localStorage.getItem('stackstore_testimonials');

    if (cachedProducts) {
        try {
            products = JSON.parse(cachedProducts);
            products.forEach(function(p, i) { if (typeof p.sort_order !== 'number') p.sort_order = i; });
            products.sort(function(a, b) { return a.sort_order - b.sort_order; });
            renderProducts(); updateStats();
        } catch(e) {}
    }
    if (cachedCategories) {
        try {
            categories = JSON.parse(cachedCategories);
            categories.forEach(function(c, i) { if (typeof c.sort_order !== 'number') c.sort_order = i; });
            categories.sort(function(a, b) { return a.sort_order - b.sort_order; });
            setupFilters();
        } catch(e) {}
    }
    if (cachedDeliveries) {
        try {
            deliveries = JSON.parse(cachedDeliveries);
            renderDeliveries(); updateStats();
        } catch(e) {}
    }
    if (cachedReviews) {
        try {
            reviews = JSON.parse(cachedReviews);
            renderReviews(); updateStats();
        } catch(e) {}
    }
    if (cachedTestimonials) {
        try {
            testimonials = JSON.parse(cachedTestimonials);
            renderTestimonials();
        } catch(e) {}
    }

    // 🔄 زامن من السيرفر
    await syncFromServer();
    isLoading = false;
}

async function syncFromServer() {
  let lastError;
  
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      var controller = new AbortController();
      var timeoutId = setTimeout(function() { controller.abort(); }, 15000);
      
      // ⛔ cache-busting + no-store
      var res = await fetch('/api/data?t=' + Date.now(), { 
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error('API HTTP ' + res.status);
      
      var data = await res.json();
      if (!data.success) throw new Error(data.error || 'API returned error');
      
      // ✅ Validate data
      if (!Array.isArray(data.products)) throw new Error('Invalid products data');
      
      // 🔄 Update all arrays
      products = data.products;
      categories = data.categories && data.categories.length > 0 ? data.categories : defaultCategories;
      deliveries = data.deliveries || [];
      reviews = data.reviews || [];
      testimonials = data.testimonials || [];
      
      // 📊 Sort
      products.forEach(function(p, i) { if (typeof p.sort_order !== 'number') p.sort_order = i; });
      products.sort(function(a, b) { return a.sort_order - b.sort_order; });
      
      categories.forEach(function(c, i) { if (typeof c.sort_order !== 'number') c.sort_order = i; });
      categories.sort(function(a, b) { return a.sort_order - b.sort_order; });
      
      // 💾 Save to localStorage
      try {
        localStorage.setItem('stackstore_products', JSON.stringify(products));
        localStorage.setItem('stackstore_categories', JSON.stringify(categories));
        localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
        localStorage.setItem('stackstore_reviews', JSON.stringify(reviews));
        localStorage.setItem('stackstore_testimonials', JSON.stringify(testimonials));
      } catch(e) {}
      
      // 🎨 Render everything
      renderProducts(); 
      setupFilters();
      renderDeliveries(); 
      renderReviews(); 
      renderTestimonials();
      updateStats();
      
      console.log('✅ Loaded from Vercel API at', data.timestamp);
      return; // نجح، اخرج
      
    } catch (e) {
      lastError = e;
      console.warn('⏱️ Attempt ' + (attempt + 1) + ' failed:', e.message);
      if (attempt < 2) await new Promise(function(r) { setTimeout(r, 1200); });
    }
  }
  
  // ❌ كل المحاولات فشلت
  console.error('⏱️ All API attempts failed:', lastError.message);
  showToast('<i class="fas fa-triangle-exclamation"></i> تعذر الاتصال بالسيرفر، جاري عرض البيانات المحلية', 'error');
}

async function waitForSupabase() {
    var retries = 0;
    while (!supabaseClient && retries < 10) {
        await new Promise(function(r) { setTimeout(r, 300); });
        retries++;
    }
}

function renderSkeletons() {
    document.getElementById('productsGrid').innerHTML =
        '<div class="products-skeleton">' +
        '<div class="skeleton-card"><div class="skeleton img"></div><div class="skeleton title"></div><div class="skeleton price"></div></div>' +
        '<div class="skeleton-card"><div class="skeleton img"></div><div class="skeleton title"></div><div class="skeleton price"></div></div>' +
        '<div class="skeleton-card"><div class="skeleton img"></div><div class="skeleton title"></div><div class="skeleton price"></div></div>' +
        '<div class="skeleton-card"><div class="skeleton img"></div><div class="skeleton title"></div><div class="skeleton price"></div></div>' +
        '</div>';
}

function setupEventListeners() {
    setupUpload('paymentUpload', 'paymentFile', 'paymentPreview', 'paymentUpload', 'paymentRemove');
    setupUpload('deliveryUpload', 'deliveryFile', 'deliveryPreview', 'deliveryUpload', 'deliveryRemove');
    setupUpload('reviewUpload', 'reviewFile', 'reviewPreview', 'reviewUpload', 'reviewRemove');
    setupUpload('productImageUpload', 'productImageFile', 'productImagePreview', 'productImageUpload', 'productImageRemove');
    setupUpload('productDetailImageUpload', 'productDetailImageFile', 'productDetailImagePreview', 'productDetailImageUpload', 'productDetailImageRemove');

    document.querySelectorAll('.nav-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var section = this.getAttribute('data-section');
            if (section === 'admin') { openAdminLogin(); }
            else { showSection(section); }
        });
    });

    setupUpload('testimonialUpload', 'testimonialFile', 'testimonialPreview', 'testimonialUpload', 'testimonialRemove');
    document.getElementById('btnSaveTestimonial').addEventListener('click', saveTestimonial);
    document.getElementById('testimonialModal').addEventListener('click', function(e) {
        if (e.target === this) closeTestimonialModal();
    });

    document.getElementById('productSearch').addEventListener('input', function() { renderProducts(); });
    document.getElementById('btnSaveDelivery').addEventListener('click', addDelivery);
    document.getElementById('btnSavePublicReview').addEventListener('click', addPublicReview);
    document.getElementById('btnSaveProduct').addEventListener('click', saveProduct);

    document.getElementById('btnAdminLogin').addEventListener('click', checkAdminCode);
    document.getElementById('adminCodeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkAdminCode();
    });
    document.getElementById('btnBackFromLogin').addEventListener('click', function() {
        document.getElementById('adminLoginOverlay').classList.remove('active');
    });

    document.getElementById('btnModalClose').addEventListener('click', closeModal);
    document.getElementById('imageModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) closeProductModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.getElementById('adminLoginOverlay').classList.remove('active');
            document.getElementById('imageModal').classList.remove('active');
            document.getElementById('productModal').classList.remove('active');
            document.getElementById('datePickerOverlay').classList.remove('active');
            
            // Close mobile drawer
            var drawer = document.getElementById('mobileDrawer');
            if (drawer && drawer.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });

    setupDatePicker();

    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.section) {
            if (e.state.section === 'products') {
                document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
                document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
                document.getElementById('products').classList.add('active');
                document.getElementById('tabProducts').classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (e.state.section === 'productDetail' && e.state.productId) {
                showProductDetail(e.state.productId);
            } else {
                showSection(e.state.section, false);
            }
        } else {
            showSection('products', false);
        }
    });
}

function setupUpload(uploadId, fileId, previewId, uploadAreaId, removeId) {
    var uploadArea = document.getElementById(uploadId);
    var fileInput = document.getElementById(fileId);
    var removeBtn = document.getElementById(removeId);
    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener('click', function(e) {
        if (e.target !== removeBtn) fileInput.click();
    });
    fileInput.addEventListener('change', function() {
        handleImageUpload(this, previewId, uploadAreaId, removeId);
    });
    if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            removeImage(fileId, previewId, uploadAreaId, removeId);
        });
    }
}

function setupStarRatings() {
    setupStarRating('starRating', function(r) { selectedRating = r; });
    setupStarRating('publicStarRating', function(r) { publicSelectedRating = r; });
}

function setupStarRating(containerId, callback) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var stars = container.querySelectorAll('span');
    stars.forEach(function(star) {
        star.addEventListener('click', function() {
            var rating = parseInt(this.getAttribute('data-rating'));
            callback(rating);
            updateStarDisplay(containerId, rating);
        });
        star.addEventListener('mouseenter', function() {
            var rating = parseInt(this.getAttribute('data-rating'));
            updateStarDisplay(containerId, rating);
        });
    });
    container.addEventListener('mouseleave', function() {
        var currentRating = containerId === 'starRating' ? selectedRating : publicSelectedRating;
        updateStarDisplay(containerId, currentRating);
    });
}

function updateStarDisplay(containerId, rating) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var stars = container.querySelectorAll('span');
    stars.forEach(function(star, index) {
        if (index < rating) {
            star.classList.add('active');
            star.style.filter = 'grayscale(0)';
            star.style.opacity = '1';
        } else {
            star.classList.remove('active');
            star.style.filter = 'grayscale(1)';
            star.style.opacity = '0.3';
        }
    });
}

function setupFilters() {
    var container = document.getElementById('filterTabsContainer');
    if (!container) return;
    container.innerHTML = '';
    categories.forEach(function(cat) {
        var btn = document.createElement('button');
        btn.className = 'filter-tab' + (cat.id === currentFilter ? ' active' : '');
        btn.setAttribute('data-filter', cat.id);
        btn.innerHTML = (cat.icon ? cat.icon + ' ' : '') + escapeHtml(cat.name);
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderProducts();
        });
        container.appendChild(btn);
    });
}

function renderProducts() {
    var container = document.getElementById('productsGrid');
    var search = document.getElementById('productSearch').value.toLowerCase();

    var filtered = products.filter(function(p) {
        var matchesSearch = p.name.toLowerCase().includes(search) || (p.description || '').toLowerCase().includes(search);
        var matchesFilter = currentFilter === 'all' || p.category === currentFilter;
        return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon"><i class="fas fa-cart-shopping"></i></div><h3>لا توجد منتجات</h3><p>جرب تغير الفلتر أو البحث</p></div>';
        return;
    }

    var html = '<div class="products-grid">';
    filtered.forEach(function(p) {
        var bestPrice = p.prices && p.prices.length > 0 ? p.prices.reduce(function(prev, curr) {
            return prev.price < curr.price ? prev : curr;
        }) : null;

        var discount = bestPrice && bestPrice.originalPrice ? Math.round((1 - bestPrice.price / bestPrice.originalPrice) * 100) : 0;
        var imgSrc = p.detail_image || p.image || PLACEHOLDER_IMG;

        html += '<div class="product-card-wrapper">' +
            '<div class="product-card" onclick="showProductDetail(' + p.id + ')">' +
                (discount > 0 ? '<div class="card-discount-badge">خصم %' + discount + '</div>' : '') +
                '<img class="product-card-image" src="' + imgSrc + '" alt="' + p.name + '" loading="lazy" onerror="this.src=PLACEHOLDER_IMG">' +
            '</div>' +
            '<div class="product-info-below">' +
                '<button class="card-action-btn" onclick="event.stopPropagation(); showProductDetail(' + p.id + ')">فعل اشتراكك</button>' +
                '<div class="card-title-bottom">' + escapeHtml(p.name) + '</div>' +
                '<div class="card-price-row">' +
                    (bestPrice && bestPrice.originalPrice ? '<span class="original-price">' + bestPrice.originalPrice + ' ج.م</span>' : '') +
                    (bestPrice ? '<span class="sale-price">' + bestPrice.price + ' ج.م</span>' : '') +
                '</div>' +
            '</div>' +
        '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function showProductDetail(productId) {
    var p = products.find(function(x) { return x.id === productId; });
    if (!p) return;
    currentProduct = p;

    history.pushState({ section: 'productDetail', productId: productId }, '', '#product/' + productId);

    var statusClass = p.status || 'available';
    var statusText = statusClass === 'available' ? '<i class="fas fa-check-circle"></i> متاح' : statusClass === 'out_of_stock' ? '<i class="fas fa-circle-xmark"></i> نفذت الكمية' : '<i class="fas fa-clock"></i> قريباً';
    var imgSrc = p.detail_image || p.image || PLACEHOLDER_IMG;

    var pricesHtml = '';
    if (p.prices && p.prices.length > 0) {
        pricesHtml = '<table class="prices-table"><thead><tr><th>المدة</th><th>السعر</th><th>السعر قبل</th><th>الخصم</th></tr></thead><tbody>';
        p.prices.forEach(function(pr) {
            var discount = pr.originalPrice ? Math.round((1 - pr.price / pr.originalPrice) * 100) : 0;
            pricesHtml += '<tr>' +
                '<td>' + escapeHtml(pr.duration) + '</td>' +
                '<td class="sale-price">' + pr.price + ' ج.م</td>' +
                '<td class="original-price">' + (pr.originalPrice || '-') + ' ج.م</td>' +
                '<td>' + (discount > 0 ? '<span class="discount-badge">-' + discount + '%</span>' : '-') + '</td>' +
                '</tr>';
        });
        pricesHtml += '</tbody></table>';
    }

    var orderDisabled = p.status !== 'available' ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : '';
    var orderText = p.status === 'available' ? '<i class="fas fa-cart-shopping"></i> اطلب الآن عبر واتساب' : '<i class="fas fa-ban"></i> غير متاح حالياً';

    var html = '<div class="card">' +
        '<div class="product-detail-header">' +
        '<div class="product-detail-image">' +
        '<img src="' + imgSrc + '" alt="' + p.name + '" onerror="this.src=PLACEHOLDER_IMG">' +
        '</div>' +
        '<div class="product-detail-info">' +
        '<h2>' + escapeHtml(p.name) + ' <span class="status-badge ' + statusClass + '">' + statusText + '</span></h2>' +
        '<p class="detail-desc">' + escapeHtml(p.description) + '</p>' +
        '</div></div>' +
        '<div class="card-title"><span class="icon"><i class="fas fa-coins"></i></span>الأسعار والمدد</div>' +
        pricesHtml +
        '<button class="order-btn" ' + orderDisabled + ' onclick="orderProduct(' + p.id + ')">' + orderText + '</button>' +
        '</div>';

    document.getElementById('productDetailContent').innerHTML = html;
    renderProductReviews();

    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('productDetail').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function orderProduct(productId) {
    var p = products.find(function(x) { return x.id === productId; });
    if (!p || p.status !== 'available') return;
    var minPrice = p.prices && p.prices.length > 0 ? Math.min.apply(null, p.prices.map(function(x) { return x.price; })) : 0;
    var msg = 'مرحباً Stack Store!%0A%0Aأنا مهتم بشراء: ' + encodeURIComponent(p.name) + '%0Aالسعر يبدأ من: ' + minPrice + ' ج.م%0A%0Aأرجو التواصل معي للتفاصيل.';
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + msg, '_blank');
}

function renderProductReviews() {
    var container = document.getElementById('productReviewsList');
    if (!currentProduct) return;

    var productReviews = reviews.filter(function(r) { return r.product_id === currentProduct.id; });

    if (productReviews.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">لا توجد آراء بعد عن هذا المنتج. كن أول من يقيم! <i class="fas fa-star"></i></p>';
        return;
    }

    var html = '<div class="reviews-grid">';
    productReviews.forEach(function(r) {
        var stars = '';
        for (var i = 1; i <= 5; i++) {
            stars += i <= (r.rating || 0) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        var deleteBtn = isAdmin ? '<button class="delete-btn" onclick="deleteReview(' + r.id + ')"><i class="fas fa-trash"></i> مسح</button>' : '';
        html += '<div class="review-card">' + deleteBtn +
            '<div class="review-header">' +
            '<span class="reviewer-name">' + escapeHtml(r.name || 'عميل') + '</span>' +
            '<span class="review-date">' + formatDate(r.created_at) + '</span>' +
            '</div>' +
            '<div class="review-rating">' + stars + '</div>' +
            '<div class="review-text">' + escapeHtml(r.text) + '</div>' +
            '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function submitProductReview() {
    var name = document.getElementById('reviewerName').value.trim() || 'عميل';
    var text = document.getElementById('reviewerText').value.trim();
    if (!text) { showToast('<i class="fas fa-circle-xmark"></i> اكتب رأيك الأول!', 'error'); return; }
    if (selectedRating === 0) { showToast('<i class="fas fa-circle-xmark"></i> اختار التقييم بالنجوم!', 'error'); return; }
    if (!currentProduct) return;

    var review = {
        id: Date.now(),
        product_id: currentProduct.id,
        name: name,
        text: text,
        rating: selectedRating,
        created_at: new Date().toISOString()
    };

    reviews.unshift(review);
    localStorage.setItem('stackstore_reviews', JSON.stringify(reviews));

    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewerText').value = '';
    selectedRating = 0;
    updateStarDisplay('starRating', 0);

    renderProductReviews();
    renderReviews();
    updateStats();
    showToast('<i class="fas fa-check-circle"></i> تم إرسال رأيك بنجاح! شكراً لك <i class="fas fa-star"></i>', 'success');
}

function openProductModal(productId) {
    editingProductId = productId || null;
    var title = document.getElementById('productModalTitle');
    title.textContent = productId ? 'تعديل منتج' : 'منتج جديد';

    if (productId) {
        var p = products.find(function(x) { return x.id === productId; });
        if (!p) return;
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodDesc').value = p.description || '';
        document.getElementById('prodImageUrl').value = p.image || '';
        var catSelect = document.getElementById('prodCategory');
        catSelect.innerHTML = '';
        categories.forEach(function(cat) {
            if (cat.id === 'all') return;
            var opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = (cat.icon ? cat.icon + ' ' : '') + cat.name;
            catSelect.appendChild(opt);
        });
        catSelect.value = p.category || (categories[1] ? categories[1].id : 'other');
        document.getElementById('prodStatus').value = p.status || 'available';

        var pricesContainer = document.getElementById('pricesContainer');
        pricesContainer.innerHTML = '';
        if (p.prices && p.prices.length > 0) {
            p.prices.forEach(function(pr) {
                addPriceRow(pr.duration, pr.price, pr.originalPrice);
            });
        } else {
            addPriceRow();
        }

        if (p.image) {
            document.getElementById('productImagePreview').src = p.image;
            document.getElementById('productImagePreview').classList.add('show');
            document.getElementById('productImageUpload').classList.add('has-image');
            document.getElementById('productImageUpload').querySelector('.upload-content').style.display = 'none';
            document.getElementById('productImageRemove').classList.add('show');
        }
        document.getElementById('prodDetailImageUrl').value = p.detail_image || '';
        if (p.detail_image) {
            document.getElementById('productDetailImagePreview').src = p.detail_image;
            document.getElementById('productDetailImagePreview').classList.add('show');
            document.getElementById('productDetailImageUpload').classList.add('has-image');
            document.getElementById('productDetailImageUpload').querySelector('.upload-content').style.display = 'none';
            document.getElementById('productDetailImageRemove').classList.add('show');
        }
    } else {
        document.getElementById('prodName').value = '';
        document.getElementById('prodDesc').value = '';
        document.getElementById('prodImageUrl').value = '';
        var catSelect = document.getElementById('prodCategory');
        catSelect.innerHTML = '';
        categories.forEach(function(cat) {
            if (cat.id === 'all') return;
            var opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = (cat.icon ? cat.icon + ' ' : '') + cat.name;
            catSelect.appendChild(opt);
        });
        catSelect.value = categories[1] ? categories[1].id : 'other';
        document.getElementById('prodStatus').value = 'available';
        document.getElementById('pricesContainer').innerHTML = '';
        addPriceRow();
        removeImage('productImageFile', 'productImagePreview', 'productImageUpload', 'productImageRemove');
        document.getElementById('prodDetailImageUrl').value = '';
        removeImage('productDetailImageFile', 'productDetailImagePreview', 'productDetailImageUpload', 'productDetailImageRemove');
    }

    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    editingProductId = null;
}

function addPriceRow(duration, price, originalPrice) {
    var container = document.getElementById('pricesContainer');
    var row = document.createElement('div');
    row.className = 'price-row';
    row.innerHTML = '<input type="text" class="price-duration" placeholder="المدة" value="' + (duration || '') + '">' +
        '<input type="number" class="price-value" placeholder="السعر" value="' + (price || '') + '">' +
        '<input type="number" class="price-original" placeholder="السعر قبل" value="' + (originalPrice || '') + '">' +
        '<button class="btn btn-danger btn-sm" onclick="removePriceRow(this)"><i class="fas fa-trash"></i></button>';
    container.appendChild(row);
}

function removePriceRow(btn) {
    var row = btn.parentElement;
    var container = document.getElementById('pricesContainer');
    if (container.children.length > 1) {
        row.remove();
    } else {
        row.querySelectorAll('input').forEach(function(inp) { inp.value = ''; });
    }
}

async function saveProduct() {
    var name = document.getElementById('prodName').value.trim();
    var desc = document.getElementById('prodDesc').value.trim();
    var imageUrl = document.getElementById('prodImageUrl').value.trim();
    var category = document.getElementById('prodCategory').value;
    var status = document.getElementById('prodStatus').value;

    if (!name) { showToast('<i class="fas fa-circle-xmark"></i> أدخل اسم المنتج!', 'error'); return; }

    var image = imageUrl;
    var preview = document.getElementById('productImagePreview');
    if (preview.src && preview.classList.contains('show') && preview.src.startsWith('data:')) {
        image = preview.src;
    }

    var detailImageUrl = document.getElementById('prodDetailImageUrl').value.trim();
    var detailImage = detailImageUrl;
    var detailPreview = document.getElementById('productDetailImagePreview');
    if (detailPreview.src && detailPreview.classList.contains('show') && detailPreview.src.startsWith('data:')) {
        detailImage = detailPreview.src;
    }

    var prices = [];
    document.querySelectorAll('.price-row').forEach(function(row) {
        var duration = row.querySelector('.price-duration').value.trim();
        var price = parseFloat(row.querySelector('.price-value').value);
        var original = parseFloat(row.querySelector('.price-original').value) || null;
        if (duration && !isNaN(price)) {
            prices.push({ duration: duration, price: price, originalPrice: original });
        }
    });

    var productData = {
        name: name,
        description: desc,
        image: image,
        detail_image: detailImage,
        category: category,
        status: status,
        prices: prices,
        created_at: new Date().toISOString()
    };

    if (editingProductId) {
        var idx = products.findIndex(function(p) { return p.id === editingProductId; });
        if (idx !== -1) {
            productData.id = editingProductId;
            productData.created_at = products[idx].created_at;
            products[idx] = productData;
        }
    } else {
        productData.id = Date.now();
        products.unshift(productData);
    }

    // Save to localStorage (ignore if full)
    try {
        localStorage.setItem('stackstore_products', JSON.stringify(products));
    } catch (e) {
        console.warn('localStorage full, skipping local save:', e);
    }

     // Render immediately
    renderProducts();
    renderAdminProducts();
    updateStats();

    // Sync to Supabase (wait for result)
    if (supabaseClient) {
        try {
            if (editingProductId) {
                var { error } = await supabaseClient.from('products').update(productData).eq('id', editingProductId);
                if (error) throw error;
            } else {
                var { error } = await supabaseClient.from('products').insert([productData]);
                if (error) throw error;
            }
            closeProductModal();
            showToast('<i class="fas fa-check-circle"></i> تم حفظ المنتج بنجاح!', 'success');
        } catch (e) {
            closeProductModal();
            showToast('<i class="fas fa-triangle-exclamation"></i> تم الحفظ محلياً فقط - Supabase غير متاح', 'warning');
        }
    } else {
        closeProductModal();
        showToast('<i class="fas fa-check-circle"></i> تم الحفظ محلياً!', 'success');
    }
}

async function deleteProduct(id) {
    if (!confirm('متأكد إنك عاوز تمسح المنتج دا؟')) return;
    
    products = products.filter(function(p) { return p.id !== id; });
    
    try {
        localStorage.setItem('stackstore_products', JSON.stringify(products));
    } catch (e) {
        console.warn('localStorage full:', e);
    }

    renderProducts();
    renderAdminProducts();
    updateStats();
    showToast('<i class="fas fa-trash"></i> تم مسح المنتج!', 'success');

    if (supabaseClient) {
        try {
            await supabaseClient.from('products').delete().eq('id', id);
        } catch (e) {
            console.log('Supabase delete failed:', e);
        }
    }
}

function renderAdminProducts() {
    var container = document.getElementById('adminProductsList');
    if (products.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">مفيش منتجات لسه</p>';
        return;
    }

    var html = '<table class="admin-table"><thead><tr><th>صورة</th><th>الاسم</th><th>التصنيف</th><th>الحالة</th><th>الإجراءات</th></tr></thead><tbody>';
    products.forEach(function(p) {
        var statusText = p.status === 'available' ? '<i class="fas fa-check-circle"></i>' : p.status === 'out_of_stock' ? '<i class="fas fa-circle-xmark"></i>' : '<i class="fas fa-clock"></i>';
        html += '<tr>' +
            '<td><img class="product-thumb" src="' + (p.image || PLACEHOLDER_IMG) + '" alt="" ></td>' +
            '<td>' + escapeHtml(p.name) + '</td>' +
            '<td>' + getCategoryName(p.category) + '</td>' +
            '<td>' + statusText + '</td>' +
            '<td class="action-btns">' +
            '<button class="btn-edit" onclick="openProductModal(' + p.id + ')"><i class="fas fa-pen-to-square"></i> تعديل</button>' +
            '<button class="btn-delete" onclick="deleteProduct(' + p.id + ')"><i class="fas fa-trash"></i> مسح</button>' +
            '</td></tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function getCategoryName(cat) {
    var found = categories.find(function(c) { return c.id === cat; });
    return found ? found.name : cat;
}

async function addDelivery() {
    var paymentFile = document.getElementById('paymentFile').files[0];
    var deliveryFile = document.getElementById('deliveryFile').files[0];
    var notes = document.getElementById('deliveryNotes').value.trim();
    var dateInput = document.getElementById('deliveryDate').value;

    if (!paymentFile) { showToast('<i class="fas fa-circle-xmark"></i> ضيف صورة الدفع!', 'error'); return; }
    if (!deliveryFile) { showToast('<i class="fas fa-circle-xmark"></i> ضيف صورة التسليم!', 'error'); return; }

    var overlay = document.getElementById('compressionOverlay');
    var progressBar = document.getElementById('compressionProgress');
    var progressText = document.getElementById('compressionText');
    overlay.classList.add('active');
    progressBar.style.width = '10%';
    progressText.textContent = 'جاري ضغط صورة الدفع...';

    try {
        var paymentCompressed = await compressImage(paymentFile, 1200, 0.85);
        progressBar.style.width = '40%';
        progressText.textContent = 'صورة الدفع: -' + paymentCompressed.reduction + '% | جاري ضغط صورة التسليم...';

        var deliveryCompressed = await compressImage(deliveryFile, 1200, 0.85);
        progressBar.style.width = '70%';
        progressText.textContent = 'صورة التسليم: -' + deliveryCompressed.reduction + '% | جاري الرفع...';

        var paymentUrl = null;
        var deliveryUrl = null;
        var deliveryData = null;

        if (supabaseClient) {
            try {
                paymentUrl = await uploadToSupabaseStorage(paymentCompressed.file, 'payments');
                progressBar.style.width = '85%';
                deliveryUrl = await uploadToSupabaseStorage(deliveryCompressed.file, 'deliveries');
                progressBar.style.width = '95%';

                var result = await supabaseClient.from('deliveries').insert([{
                    payment_image: paymentUrl,
                    delivery_image: deliveryUrl,
                    notes: notes,
                    delivery_date: dateInput || null,
                    created_at: new Date().toISOString()
                }]).select();

                if (result.error) throw result.error;
                deliveryData = result.data[0];
            } catch (supaErr) {
                console.log('Supabase delivery failed, using local:', supaErr);
            }
        }

        if (!deliveryData) {
            var paymentPreview = document.getElementById('paymentPreview');
            var deliveryPreview = document.getElementById('deliveryPreview');
            deliveryData = {
                id: Date.now(),
                payment_image: paymentPreview.src,
                delivery_image: deliveryPreview.src,
                notes: notes,
                delivery_date: dateInput || null,
                created_at: new Date().toISOString(),
                date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            };
        }

        deliveries.unshift(deliveryData);
        
        try {
            localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
        } catch (e) {
            console.warn('localStorage full:', e);
        }

        document.getElementById('deliveryNotes').value = '';
        document.getElementById('deliveryDate').value = '';
        removeImage('paymentFile', 'paymentPreview', 'paymentUpload', 'paymentRemove');
        removeImage('deliveryFile', 'deliveryPreview', 'deliveryUpload', 'deliveryRemove');

        progressBar.style.width = '100%';
        overlay.classList.remove('active');

        renderDeliveries();
        updateStats();
        showToast('<i class="fas fa-check-circle"></i> تم حفظ التسليم بنجاح!', 'success');

    } catch (err) {
        overlay.classList.remove('active');
        console.error(err);
        showToast('<i class="fas fa-circle-xmark"></i> حصل خطأ: ' + (err.message || err), 'error');
    }
}

async function deleteDelivery(id) {
    if (!confirm('متأكد إنك عاوز تمسح التسليم دا؟')) return;

    deliveries = deliveries.filter(function(d) { return d.id !== id; });
    
    try {
        localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
    } catch (e) {
        console.warn('localStorage full:', e);
    }

    renderDeliveries();
    updateStats();
    showToast('<i class="fas fa-trash"></i> تم المسح!', 'success');

    if (supabaseClient) {
        try {
            var delivery = deliveries.find(function(d) { return d.id === id; });
            if (delivery) {
                if (delivery.payment_image) {
                    var paymentPath = delivery.payment_image.split('/').pop();
                    await supabaseClient.storage.from('stackstore').remove(['payments/' + paymentPath]);
                }
                if (delivery.delivery_image) {
                    var deliveryPath = delivery.delivery_image.split('/').pop();
                    await supabaseClient.storage.from('stackstore').remove(['deliveries/' + deliveryPath]);
                }
            }
            await supabaseClient.from('deliveries').delete().eq('id', id);
        } catch (err) {
            console.log('Supabase delivery delete failed:', err);
        }
    }
}

function renderDeliveries() {
    var container = document.getElementById('deliveriesList');
    if (isLoading) return;

    if (deliveries.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon"><i class="fas fa-box"></i></div><h3>لا توجد تسليمات بعد</h3><p>سيتم عرض التسليمات هنا بمجرد إضافتها</p></div>';
        return;
    }

    var sorted = deliveries.slice().sort(function(a, b) {
        var dateA = a.delivery_date ? new Date(a.delivery_date) : new Date(a.created_at);
        var dateB = b.delivery_date ? new Date(b.delivery_date) : new Date(b.created_at);
        return dateB - dateA;
    });

    var html = '<div class="deliveries-grid">';
    sorted.forEach(function(d, i) {
        var displayDate;
        var dateBadge = '';
        if (d.delivery_date) {
            displayDate = new Date(d.delivery_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
            dateBadge = '<span class="date-badge-custom"><i class="fas fa-thumbtack"></i> تاريخ محدد</span>';
        } else {
            displayDate = d.date || new Date(d.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }

        var notesHtml = d.notes ? '<p style="color:var(--text-muted);font-size:0.9rem;margin-top:10px;"><i class="fas fa-pen"></i> ' + escapeHtml(d.notes) + '</p>' : '';
        var adminHtml = isAdmin ? '<div class="card-footer"><button class="btn btn-danger btn-sm" onclick="deleteDelivery(' + d.id + ')"><span><i class="fas fa-trash"></i></span> مسح</button></div>' : '';

        html += '<div class="delivery-card"><div class="card-header"><span class="delivery-number">#' + (sorted.length - i) + '</span><span class="date">' + dateBadge + '<i class="fas fa-calendar-days"></i> ' + displayDate + '</span></div><div class="card-body"><div class="images-row"><div class="img-box" onclick="openImageModal(\'' + d.payment_image + '\')"><img src="' + d.payment_image + '" alt="صورة الدفع" loading="lazy"><div class="img-label"><i class="fas fa-credit-card"></i> الدفع</div></div><div class="img-box" onclick="openImageModal(\'' + d.delivery_image + '\')"><img src="' + d.delivery_image + '" alt="صورة التسليم" loading="lazy"><div class="img-label"><i class="fas fa-paper-plane"></i> التسليم</div></div></div>' + notesHtml + '</div>' + adminHtml + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

async function addPublicReview() {
    var name = document.getElementById('publicReviewerName').value.trim() || 'عميل';
    var text = document.getElementById('publicReviewText').value.trim();

    if (!text) { showToast('<i class="fas fa-circle-xmark"></i> اكتب رأيك الأول!', 'error'); return; }
    if (publicSelectedRating === 0) { showToast('<i class="fas fa-circle-xmark"></i> اختار التقييم بالنجوم!', 'error'); return; }

    var review = {
        id: Date.now(),
        product_id: null,
        name: name,
        text: text,
        rating: publicSelectedRating,
        created_at: new Date().toISOString(),
        date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    reviews.unshift(review);
    
    try {
        localStorage.setItem('stackstore_reviews', JSON.stringify(reviews));
    } catch (e) {
        console.warn('localStorage full:', e);
    }

    document.getElementById('publicReviewerName').value = '';
    document.getElementById('publicReviewText').value = '';
    publicSelectedRating = 0;
    updateStarDisplay('publicStarRating', 0);

    renderReviews();
    updateStats();
    showToast('<i class="fas fa-check-circle"></i> تم إرسال رأيك بنجاح! شكراً لك <i class="fas fa-star"></i>', 'success');

    if (supabaseClient) {
        try {
            await supabaseClient.from('reviews').insert([review]);
        } catch (e) {
            console.log('Supabase review insert failed:', e);
        }
    }
}

async function deleteReview(id) {
    if (!confirm('متأكد إنك عاوز تمسح الرأي دا؟')) return;

    reviews = reviews.filter(function(r) { return r.id !== id; });
    
    try {
        localStorage.setItem('stackstore_reviews', JSON.stringify(reviews));
    } catch (e) {
        console.warn('localStorage full:', e);
    }

    renderReviews();
    if (currentProduct) renderProductReviews();
    updateStats();
    showToast('<i class="fas fa-trash"></i> تم المسح!', 'success');

    if (supabaseClient) {
        try {
            var review = reviews.find(function(r) { return r.id === id; });
            if (review && review.image) {
                var imagePath = review.image.split('/').pop();
                await supabaseClient.storage.from('stackstore').remove(['reviews/' + imagePath]);
            }
            await supabaseClient.from('reviews').delete().eq('id', id);
        } catch (err) {
            console.log('Supabase review delete failed:', err);
        }
    }
}

function renderReviews() {
    var container = document.getElementById('reviewsList');
    if (isLoading) return;

    if (reviews.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon"><i class="fas fa-star"></i></div><h3>لا توجد آراء بعد</h3><p>كن أول من يقيم خدماتنا!</p></div>';
        return;
    }

    var sorted = reviews.slice().sort(function(a, b) {
        return new Date(b.created_at) - new Date(a.created_at);
    });

    var html = '<div class="reviews-grid">';
    sorted.forEach(function(r) {
        var stars = '';
        for (var i = 1; i <= 5; i++) {
            stars += i <= (r.rating || 0) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        var deleteBtn = isAdmin ? '<button class="delete-btn" onclick="deleteReview(' + r.id + ')"><i class="fas fa-trash"></i> مسح</button>' : '';

        html += '<div class="review-card">' + deleteBtn +
            '<div class="review-header">' +
            '<span class="reviewer-name">' + escapeHtml(r.name || 'عميل') + '</span>' +
            '<span class="review-date">' + formatDate(r.created_at) + '</span>' +
            '</div>' +
            '<div class="review-rating">' + stars + '</div>' +
            '<div class="review-text">' + escapeHtml(r.text) + '</div>' +
            '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function renderAdminCategories() {
    var container = document.getElementById('adminCategoriesList');
    if (!container) return;
    if (categories.length <= 1) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">مفيش أقسام إضافية لسه</p>';
        return;
    }
    var html = '<table class="admin-table"><thead><tr><th>الأيقونة</th><th>الاسم</th><th>المعرف</th><th>الإجراءات</th></tr></thead><tbody>';
    categories.forEach(function(cat) {
        if (cat.id === 'all') return;
        html += '<tr>' +
            '<td style="font-size:1.4rem;text-align:center;">' + (cat.icon || '—') + '</td>' +
            '<td style="font-weight:700;">' + escapeHtml(cat.name) + '</td>' +
            '<td><code style="background:var(--bg);padding:4px 10px;border-radius:6px;font-size:0.8rem;color:var(--text-muted);border:1px solid var(--border);">' + cat.id + '</code></td>' +
            '<td class="action-btns">' +
            '<button class="btn-edit" onclick="openCategoryModal(\'' + cat.id + '\')"><i class="fas fa-pen-to-square"></i> تعديل</button>' +
            '<button class="btn-delete" onclick="deleteCategory(\'' + cat.id + '\')"><i class="fas fa-trash"></i> مسح</button>' +
            '</td></tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function openCategoryModal(catId) {
    var isEdit = !!catId;
    var name = '';
    var icon = '';
    if (isEdit) {
        var cat = categories.find(function(c) { return c.id === catId; });
        if (!cat) return;
        name = cat.name;
        icon = cat.icon || '';
    }
    var newName = prompt(isEdit ? 'تعديل اسم القسم:' : 'اسم القسم الجديد:', name);
    if (newName === null) return;
    newName = newName.trim();
    if (!newName) { showToast('<i class="fas fa-circle-xmark"></i> الاسم مطلوب!', 'error'); return; }

    var newIcon = prompt('أيقونة القسم (اختياري):', icon);
    if (newIcon === null) newIcon = '';
    newIcon = newIcon.trim();

    if (isEdit) {
        var idx = categories.findIndex(function(c) { return c.id === catId; });
        if (idx !== -1) {
            categories[idx].name = newName;
            categories[idx].icon = newIcon;
        }
    } else {
        var newId = 'cat_' + Date.now();
        categories.push({ id: newId, name: newName, icon: newIcon });
    }

    try {
        localStorage.setItem('stackstore_categories', JSON.stringify(categories));
    } catch (e) {
        console.warn('localStorage full:', e);
    }

    setupFilters();
    renderAdminCategories();
    renderAdminProducts();
    renderProducts();
    showToast('<i class="fas fa-check-circle"></i> تم حفظ القسم بنجاح!', 'success');

    if (supabaseClient) {
        try {
            if (isEdit) {
                await supabaseClient.from('categories').update({ name: newName, icon: newIcon }).eq('id', catId);
            } else {
                var newCat = categories[categories.length - 1];
                await supabaseClient.from('categories').insert([newCat]);
            }
        } catch (e) {
            console.log('Supabase category sync failed:', e);
        }
    }
}

async function deleteCategory(catId) {
    if (catId === 'all') { showToast('<i class="fas fa-circle-xmark"></i> لا يمكن حذف القسم الافتراضي!', 'error'); return; }
    var productsInCat = products.filter(function(p) { return p.category === catId; });
    if (productsInCat.length > 0) {
        if (!confirm('في ' + productsInCat.length + ' منتج في القسم دا. هيتنقلوا لـ "أخرى". متأكد؟')) return;
        products.forEach(function(p) {
            if (p.category === catId) p.category = 'other';
        });
        try {
            localStorage.setItem('stackstore_products', JSON.stringify(products));
        } catch (e) {
            console.warn('localStorage full:', e);
        }
        if (supabaseClient) {
            try {
                await supabaseClient.from('products').update({ category: 'other' }).eq('category', catId);
            } catch (e) { console.log(e); }
        }
    } else {
        if (!confirm('متأكد إنك عاوز تمسح القسم "' + getCategoryName(catId) + '"؟')) return;
    }
    
    categories = categories.filter(function(c) { return c.id !== catId; });
    
    try {
        localStorage.setItem('stackstore_categories', JSON.stringify(categories));
    } catch (e) {
        console.warn('localStorage full:', e);
    }

    if (supabaseClient) {
        try {
            await supabaseClient.from('categories').delete().eq('id', catId);
        } catch (e) { console.log(e); }
    }
    
    if (currentFilter === catId) {
        currentFilter = 'all';
        document.querySelectorAll('.filter-tab').forEach(function(t) { t.classList.remove('active'); });
        var allTab = document.querySelector('.filter-tab[data-filter="all"]');
        if (allTab) allTab.classList.add('active');
    }
    setupFilters();
    renderProducts();
    renderAdminCategories();
    renderAdminProducts();
    showToast('<i class="fas fa-trash"></i> تم مسح القسم!', 'success');
}

function renderAdminSection() {
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
    document.getElementById('tabAdmin').classList.add('active');
    updateStats();
    renderAdminProducts();
    renderAdminCategories();
    renderAdminDeliveries();
    renderAdminReviews();
    renderAdminTestimonials();
    document.getElementById('admin').classList.add('active');
}

function updateStats() {
    document.getElementById('statProducts').textContent = products.length;
    document.getElementById('statDeliveries').textContent = deliveries.length;
    document.getElementById('statReviews').textContent = reviews.length;
    document.getElementById('statOrders').textContent = deliveries.length;
}

function renderAdminDeliveries() {
    var container = document.getElementById('adminDeliveriesList');
    if (deliveries.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">مفيش تسليمات لسه</p>';
        return;
    }
    var html = '<div class="deliveries-grid">';
    deliveries.forEach(function(d, i) {
        var dateStr = d.delivery_date ? new Date(d.delivery_date).toLocaleDateString('ar-EG') : (d.date || new Date(d.created_at).toLocaleDateString('ar-EG'));
        html += '<div class="delivery-card"><div class="card-header"><span class="delivery-number">#' + (deliveries.length - i) + '</span><span class="date">' + dateStr + '</span></div><div class="card-body"><div class="images-row"><div class="img-box" onclick="openImageModal(\'' + d.payment_image + '\')"><img src="' + d.payment_image + '" alt="صورة الدفع" loading="lazy"><div class="img-label"><i class="fas fa-credit-card"></i> الدفع</div></div><div class="img-box" onclick="openImageModal(\'' + d.delivery_image + '\')"><img src="' + d.delivery_image + '" alt="صورة التسليم" loading="lazy"><div class="img-label"><i class="fas fa-paper-plane"></i> التسليم</div></div></div></div><div class="card-footer"><button class="btn btn-danger btn-sm" onclick="deleteDelivery(' + d.id + ')"><span><i class="fas fa-trash"></i></span> مسح</button></div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function renderAdminReviews() {
    var container = document.getElementById('adminReviewsList');
    if (reviews.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">مفيش آراء لسه</p>';
        return;
    }
    var html = '<div class="reviews-grid">';
    reviews.forEach(function(r) {
        var stars = '';
        for (var i = 1; i <= 5; i++) stars += i <= (r.rating || 0) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        var rDate = r.date || new Date(r.created_at).toLocaleDateString('ar-EG');
        html += '<div class="review-image-card admin-review-card">' +
            '<button class="admin-review-delete-btn" onclick="deleteReview(' + r.id + ')" title="مسح الرأي">' +
            '<span class="del-icon"><i class="fas fa-trash"></i></span>' +
            '<span class="del-text">مسح الرأي</span>' +
            '</button>' +
            '<div class="admin-review-content">' +
            '<div class="admin-review-name">' + escapeHtml(r.name || 'عميل') + '</div>' +
            '<div class="admin-review-stars">' + stars + '</div>' +
            '<div class="admin-review-text">' + escapeHtml(r.text) + '</div>' +
            '<div class="admin-review-date"><i class="fas fa-calendar-days"></i> ' + rDate + '</div>' +
            '</div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function toggleMobileMenu() {
    var drawer = document.getElementById('mobileDrawer');
    var overlay = document.getElementById('drawerOverlay');
    var icon = document.getElementById('hamburgerIcon');
    
    if (!drawer) return;
    
    var isOpen = drawer.classList.contains('active');
    
    if (isOpen) {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        if (icon) icon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    } else {
        drawer.classList.add('active');
        overlay.classList.add('active');
        if (icon) icon.className = 'fas fa-xmark';
        document.body.style.overflow = 'hidden';
    }
}

function checkAdminStatus() {
    if (isAdmin) {
        document.getElementById('adminBadge').classList.add('active');
        document.getElementById('addDeliveryForm').classList.add('active');
        
        // Desktop tab
        var adminTab = document.getElementById('tabAdmin');
        if (adminTab) {
            adminTab.innerHTML = '<i class="fas fa-gear"></i><span>لوحة التحكم</span>';
            adminTab.onclick = function() { showSection('admin'); };
        }
        
        // Mobile drawer button
        var drawerAdminBtn = document.getElementById('drawerAdminBtn');
        if (drawerAdminBtn) {
            drawerAdminBtn.innerHTML = '<i class="fas fa-gear"></i><span>لوحة التحكم</span>';
            drawerAdminBtn.onclick = function() { showSection('admin'); toggleMobileMenu(); };
        }
    }
}

function openAdminLogin() {
    if (isAdmin) { showSection('admin'); return; }
    document.getElementById('adminLoginOverlay').classList.add('active');
    document.getElementById('adminCodeInput').value = '';
    document.getElementById('adminCodeInput').focus();
}

function checkAdminCode() {
    var input = document.getElementById('adminCodeInput').value.trim();
    if (input === ADMIN_CODE) {
        isAdmin = true;
        localStorage.setItem(ADMIN_KEY, 'true');
        document.getElementById('adminLoginOverlay').classList.remove('active');
        checkAdminStatus();
        showToast('<i class="fas fa-check-circle"></i> تم تسجيل الدخول كأدمن!', 'success');
        showSection('admin');
    } else {
        showToast('<i class="fas fa-circle-xmark"></i> كود الأدمن غلط! جرب تاني.', 'error');
        document.getElementById('adminCodeInput').value = '';
        document.getElementById('adminCodeInput').focus();
    }
}

function logoutAdmin() {
    if (!confirm('متأكد إنك عاوز تسجل خروج؟')) return;
    isAdmin = false;
    localStorage.removeItem(ADMIN_KEY);
    document.getElementById('adminBadge').classList.remove('active');
    document.getElementById('addDeliveryForm').classList.remove('active');
    var adminTab = document.getElementById('tabAdmin');
    adminTab.innerHTML = '<i class="fas fa-lock"></i><span>لوحة الأدمن</span>';
    adminTab.onclick = function() { openAdminLogin(); };
    showToast('<i class="fas fa-hand-wave"></i> تم تسجيل الخروج!', 'success');
    showSection('products');
}

function showSection(sectionId, pushState) {
    pushState = pushState !== false;

    // إغلاق قائمة الموبايل تلقائياً لو مفتوحة
    var drawer = document.getElementById('mobileDrawer');
    var overlay = document.getElementById('drawerOverlay');
    var icon = document.getElementById('hamburgerIcon');
    if (drawer && drawer.classList.contains('active')) {
        drawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (icon) icon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    }

    if (sectionId === 'admin' && !isAdmin) { openAdminLogin(); return; }
    
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
    
    var section = document.getElementById(sectionId);
    if (section) section.classList.add('active');
    
    if (sectionId === 'products') document.getElementById('tabProducts').classList.add('active');
    else if (sectionId === 'deliveries') document.getElementById('tabDeliveries').classList.add('active');
    else if (sectionId === 'reviews') document.getElementById('tabReviews').classList.add('active');
    else if (sectionId === 'terms') document.getElementById('tabTerms').classList.add('active');
    else if (sectionId === 'admin') {
        document.getElementById('tabAdmin').classList.add('active');
        renderAdminSection();
    }
    
    if (pushState && sectionId !== 'productDetail') {
        history.pushState({ section: sectionId }, '', '#' + sectionId);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleImageUpload(input, previewId, uploadId, removeId) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        var preview = document.getElementById(previewId);
        var uploadArea = document.getElementById(uploadId);
        var removeBtn = document.getElementById(removeId);
        preview.src = e.target.result;
        preview.classList.add('show');
        uploadArea.classList.add('has-image');
        uploadArea.querySelector('.upload-content').style.display = 'none';
        if (removeBtn) removeBtn.classList.add('show');
    };
    reader.readAsDataURL(file);
}

function removeImage(fileId, previewId, uploadId, removeId) {
    document.getElementById(fileId).value = '';
    var preview = document.getElementById(previewId);
    preview.src = '';
    preview.classList.remove('show');
    var uploadArea = document.getElementById(uploadId);
    uploadArea.classList.remove('has-image');
    var content = uploadArea.querySelector('.upload-content');
    if (content) content.style.display = 'block';
    var removeBtn = document.getElementById(removeId);
    if (removeBtn) removeBtn.classList.remove('show');
}

function openImageModal(src) {
    document.getElementById('modalImage').src = src;
    document.getElementById('imageModal').classList.add('active');
}

function closeModal() {
    document.getElementById('imageModal').classList.remove('active');
}

async function compressImage(file, maxWidth, quality) {
    maxWidth = maxWidth || 1200;
    quality = quality || 0.85;
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                var width = img.width;
                var height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                var canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(function(blob) {
                    if (!blob) { reject(new Error('فشل ضغط الصورة')); return; }
                    var compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
                        type: 'image/jpeg', lastModified: Date.now()
                    });
                    resolve({
                        file: compressedFile,
                        originalSize: file.size,
                        compressedSize: blob.size,
                        reduction: Math.round((1 - blob.size / file.size) * 100)
                    });
                }, 'image/jpeg', quality);
            };
            img.onerror = function() { reject(new Error('فشل تحميل الصورة')); };
            img.src = e.target.result;
        };
        reader.onerror = function() { reject(new Error('فشل قراءة الملف')); };
        reader.readAsDataURL(file);
    });
}

async function uploadToSupabaseStorage(file, folder) {
    if (!supabaseClient) return null;
    var fileName = folder + '/' + Date.now() + '_' + Math.random().toString(36).substring(2, 10) + '.jpg';
    var result = await supabaseClient.storage.from('stackstore').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (result.error) throw result.error;
    var urlResult = supabaseClient.storage.from('stackstore').getPublicUrl(fileName);
    return urlResult.data.publicUrl;
}

function setupDatePicker() {
    var datePickerOverlay = document.getElementById('datePickerOverlay');
    var datePickerGrid = document.getElementById('datePickerGrid');
    var datePickerTitle = document.getElementById('datePickerTitle');
    var deliveryDateInput = document.getElementById('deliveryDate');
    var currentPickerDate = new Date();
    var selectedPickerDate = null;

    function renderDatePicker(year, month) {
        var firstDay = new Date(year, month, 1);
        var lastDay = new Date(year, month + 1, 0);
        var startDay = firstDay.getDay();
        var daysInMonth = lastDay.getDate();
        var prevMonthLastDay = new Date(year, month, 0).getDate();
        var monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
        datePickerTitle.textContent = monthNames[month] + ' ' + year;
        var html = '';
        var today = new Date();
        today.setHours(0,0,0,0);
        for (var i = startDay - 1; i >= 0; i--) {
            html += '<button class="date-picker-day other-month" disabled>' + (prevMonthLastDay - i) + '</button>';
        }
        for (var d = 1; d <= daysInMonth; d++) {
            var btnClass = 'date-picker-day';
            var thisDate = new Date(year, month, d);
            if (thisDate.getTime() === today.getTime()) btnClass += ' today';
            if (selectedPickerDate && thisDate.getTime() === selectedPickerDate.getTime()) btnClass += ' selected';
            html += '<button class="' + btnClass + '" data-day="' + d + '">' + d + '</button>';
        }
        var remaining = (7 - ((startDay + daysInMonth) % 7)) % 7;
        for (var j = 1; j <= remaining; j++) {
            html += '<button class="date-picker-day other-month" disabled>' + j + '</button>';
        }
        datePickerGrid.innerHTML = html;
        datePickerGrid.querySelectorAll('.date-picker-day:not(.other-month):not(.disabled)').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var day = parseInt(this.getAttribute('data-day'));
                selectedPickerDate = new Date(year, month, day);
                var y = selectedPickerDate.getFullYear();
                var m = String(selectedPickerDate.getMonth() + 1).padStart(2, '0');
                var d = String(day).padStart(2, '0');
                deliveryDateInput.value = y + '-' + m + '-' + d;
                var displayDate = selectedPickerDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
                deliveryDateInput.setAttribute('data-display', displayDate);
                deliveryDateInput.classList.add('has-value');
                datePickerOverlay.classList.remove('active');
            });
        });
    }

    document.getElementById('btnOpenDatePicker').addEventListener('click', function() {
        datePickerOverlay.classList.add('active');
        renderDatePicker(currentPickerDate.getFullYear(), currentPickerDate.getMonth());
    });
    document.getElementById('datePrevMonth').addEventListener('click', function() {
        currentPickerDate.setMonth(currentPickerDate.getMonth() - 1);
        renderDatePicker(currentPickerDate.getFullYear(), currentPickerDate.getMonth());
    });
    document.getElementById('dateNextMonth').addEventListener('click', function() {
        currentPickerDate.setMonth(currentPickerDate.getMonth() + 1);
        renderDatePicker(currentPickerDate.getFullYear(), currentPickerDate.getMonth());
    });
    document.getElementById('datePickerClear').addEventListener('click', function() {
        selectedPickerDate = null;
        deliveryDateInput.value = '';
        deliveryDateInput.removeAttribute('data-display');
        deliveryDateInput.classList.remove('has-value');
        datePickerOverlay.classList.remove('active');
    });
    document.getElementById('datePickerToday').addEventListener('click', function() {
        var today = new Date();
        selectedPickerDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        var y = selectedPickerDate.getFullYear();
        var m = String(selectedPickerDate.getMonth() + 1).padStart(2, '0');
        var d = String(selectedPickerDate.getDate()).padStart(2, '0');
        deliveryDateInput.value = y + '-' + m + '-' + d;
        var displayDate = selectedPickerDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
        deliveryDateInput.setAttribute('data-display', displayDate);
        deliveryDateInput.classList.add('has-value');
        datePickerOverlay.classList.remove('active');
    });
    datePickerOverlay.addEventListener('click', function(e) {
        if (e.target === datePickerOverlay) datePickerOverlay.classList.remove('active');
    });
}

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    var toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'info');
    toast.innerHTML = '<span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
}

/* ====== TESTIMONIALS ====== */
function renderTestimonials() {
    var container = document.getElementById('testimonialsCarousel');
    if (!container) return;
    if (testimonials.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;width:100%;padding:30px;">لا توجد صور آراء بعد</p>';
        return;
    }
    var html = '';
    testimonials.forEach(function(t) {
        html += '<div class="testimonial-card" onclick="openImageModal(\'' + t.image + '\')">' +
            '<img src="' + t.image + '" alt="' + escapeHtml(t.name) + '" loading="lazy" onerror="this.style.display=\'none\'">' +
            '</div>';
    });
    container.innerHTML = html;
}

function scrollTestimonials(direction) {
    var container = document.getElementById('testimonialsCarousel');
    if (!container) return;
    container.scrollBy({ left: direction * 300, behavior: 'smooth' });
}

function openTestimonialModal() {
    document.getElementById('testimonialModal').classList.add('active');
}

function closeTestimonialModal() {
    document.getElementById('testimonialModal').classList.remove('active');
    removeImage('testimonialFile', 'testimonialPreview', 'testimonialUpload', 'testimonialRemove');
    document.getElementById('testimonialName').value = '';
}

async function saveTestimonial() {
    var file = document.getElementById('testimonialFile').files[0];
    var name = document.getElementById('testimonialName').value.trim() || 'عميل';
    var preview = document.getElementById('testimonialPreview');
    var image = preview.src && preview.classList.contains('show') ? preview.src : null;
    
    if (!image) { showToast('<i class="fas fa-circle-xmark"></i> ارفع صورة الـ Screenshot الأول!', 'error'); return; }

    var testimonial = {
        id: Date.now(),
        image: image,
        name: name
    };

    testimonials.unshift(testimonial);
    
    try {
        localStorage.setItem('stackstore_testimonials', JSON.stringify(testimonials));
    } catch (e) {
        console.warn('localStorage full:', e);
    }

     renderTestimonials();
    renderAdminTestimonials();

    if (supabaseClient) {
        try {
            var { error } = await supabaseClient.from('testimonials').insert([testimonial]);
            if (error) throw error;
            closeTestimonialModal();
            showToast('<i class="fas fa-check-circle"></i> تم حفظ صورة الرأي!', 'success');
        } catch (e) {
            closeTestimonialModal();
            showToast('<i class="fas fa-triangle-exclamation"></i> تم الحفظ محلياً فقط', 'warning');
        }
    } else {
        closeTestimonialModal();
        showToast('<i class="fas fa-check-circle"></i> تم الحفظ محلياً!', 'success');
    }
}

function renderAdminTestimonials() {
    var container = document.getElementById('adminTestimonialsList');
    if (!container) return;
    if (testimonials.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">مفيش صور لسه</p>';
        return;
    }
    var html = '<div class="deliveries-grid">';
    testimonials.forEach(function(t) {
        html += '<div class="delivery-card">' +
            '<div class="card-body" style="padding:0;">' +
            '<div class="img-box" onclick="openImageModal(\'' + t.image + '\')" style="aspect-ratio:9/16;">' +
            '<img src="' + t.image + '" alt="' + escapeHtml(t.name) + '" loading="lazy">' +
            '</div></div>' +
            '<div class="card-footer" style="justify-content:space-between;align-items:center;">' +
            '<span style="font-weight:700;">' + escapeHtml(t.name) + '</span>' +
            '<button class="btn btn-danger btn-sm" onclick="deleteTestimonial(' + t.id + ')"><i class="fas fa-trash"></i> مسح</button>' +
            '</div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

async function deleteTestimonial(id) {
    if (!confirm('متأكد إنك عاوز تمسح الصورة دي؟')) return;
    
    testimonials = testimonials.filter(function(t) { return t.id !== id; });
    
    try {
        localStorage.setItem('stackstore_testimonials', JSON.stringify(testimonials));
    } catch (e) {
        console.warn('localStorage full:', e);
    }

    renderTestimonials();
    renderAdminTestimonials();
    showToast('<i class="fas fa-trash"></i> تم المسح!', 'success');

    if (supabaseClient) {
        try {
            await supabaseClient.from('testimonials').delete().eq('id', id);
        } catch (e) {
            console.log('Supabase testimonial delete failed:', e);
        }
    }
}

/* ====== MOBILE ENHANCEMENTS ====== */

// Close modals on mobile back button (popstate)
window.addEventListener('popstate', function(e) {
    var activeModals = [
        document.getElementById('adminLoginOverlay'),
        document.getElementById('imageModal'),
        document.getElementById('productModal'),
        document.getElementById('datePickerOverlay')
    ];
    var anyActive = false;
    activeModals.forEach(function(m) {
        if (m && m.classList.contains('active')) {
            m.classList.remove('active');
            anyActive = true;
        }
    });
    if (anyActive) {
        e.preventDefault();
        history.pushState(null, '', location.href);
    }
});

// Push state when opening modals to enable back button close
function pushModalState() {
    if (window.history && window.history.pushState) {
        history.pushState({ modal: true }, '', location.href);
    }
}

// Enhance modal open functions for mobile
var originalOpenAdminLogin = openAdminLogin;
openAdminLogin = function() {
    if (!isAdmin) pushModalState();
    originalOpenAdminLogin();
};

var originalOpenImageModal = openImageModal;
openImageModal = function(src) {
    pushModalState();
    originalOpenImageModal(src);
};

var originalOpenProductModal = openProductModal;
openProductModal = function(productId) {
    pushModalState();
    originalOpenProductModal(productId);
};

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Prevent double-tap zoom on buttons
document.querySelectorAll('button, .nav-tab, .filter-tab, .product-card').forEach(function(el) {
    el.addEventListener('touchstart', function() {}, { passive: true });
});

// Auto-focus search on mobile when tapping search area
var searchInput = document.getElementById('productSearch');
if (searchInput) {
    searchInput.addEventListener('focus', function() {
        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Swipe to close image modal
var imageModal = document.getElementById('imageModal');
if (imageModal) {
    var touchStartY = 0;
    imageModal.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    imageModal.addEventListener('touchend', function(e) {
        var touchEndY = e.changedTouches[0].clientY;
        if (Math.abs(touchEndY - touchStartY) > 80) {
            closeModal();
        }
    }, { passive: true });
}

function toggleFaq(element) {
    var item = element.parentElement;
    var isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(function(faq) {
        faq.classList.remove('active');
    });

    if (!isActive) {
        item.classList.add('active');
    }
}

/* ====== GO TO TOP ====== */
function goToTop() {
    var productsSection = document.getElementById('products');
    if (!productsSection.classList.contains('active')) {
        showSection('products');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== DISABLE IMAGE SAVE (Right-click & Long-press) ======
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG' || (e.target.closest && e.target.closest('img'))) {
        e.preventDefault();
        return false;
    }
});
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

function exportData() {
    var data = {
        products: products,
        categories: categories,
        deliveries: deliveries,
        reviews: reviews,
        testimonials: testimonials,
        exported_at: new Date().toISOString()
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'stackstore-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('<i class="fas fa-check-circle"></i> تم تحميل النسخة الاحتياطية!', 'success');
}

function importData(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
            if (data.products) { products = data.products; localStorage.setItem('stackstore_products', JSON.stringify(products)); }
            if (data.categories) { categories = data.categories; localStorage.setItem('stackstore_categories', JSON.stringify(categories)); }
            if (data.deliveries) { deliveries = data.deliveries; localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries)); }
            if (data.reviews) { reviews = data.reviews; localStorage.setItem('stackstore_reviews', JSON.stringify(reviews)); }
            if (data.testimonials) { testimonials = data.testimonials; localStorage.setItem('stackstore_testimonials', JSON.stringify(testimonials)); }
            renderProducts(); renderAdminProducts(); renderDeliveries(); renderReviews(); renderTestimonials(); renderAdminTestimonials(); updateStats(); setupFilters();
            showToast('<i class="fas fa-check-circle"></i> تم استرجاع البيانات بنجاح!', 'success');
        } catch (err) {
            showToast('<i class="fas fa-circle-xmark"></i> ملف غير صالح!', 'error');
        }
    };
    reader.readAsText(file);
    input.value = '';
}