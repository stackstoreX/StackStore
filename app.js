// ====== TAMM STORE - APP.JS ======
// Speed-First: localStorage = Primary, Supabase = Background Sync

const ADMIN_CODE = 'TAMM9';
const ADMIN_KEY = 'stackstore_admin_device';

const SUPABASE_URL = 'https://itmsrggznasayrtckxgt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bXNyZ2d6bmFzYXlydGNreGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODQxMzMsImV4cCI6MjEwMDY2MDEzM30.FWS3hIbcVhlln-iEKN-8HD0-y7ohwhIDoKZ27xrE4hs';
const WHATSAPP_NUMBER = '201018484572';
const PLACEHOLDER_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%231e293b"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2364748b" font-family="Cairo" font-size="20"%3Eلا توجد صورة%3C/text%3E%3C/svg%3E';

let supabaseClient = null;
let deliveries = [];
let reviewImages = [];
let reviews = [];
let products = [];
let categories = [];
let testimonials = [];
let isAdmin = false;
let isLoading = true;
let syncInProgress = false;
let currentFilter = 'all';
let selectedRating = 0;
let publicSelectedRating = 0;
let currentProduct = null;
let editingProductId = null;

// ====== DEFAULT DATA ======
const defaultCategories = [
    { id: 'all', name: 'الكل', icon: '📦', sort_order: 0 },
    { id: 'streaming', name: 'بث (Streaming)', icon: '🎬', sort_order: 1 },
    { id: 'music', name: 'موسيقى', icon: '🎵', sort_order: 2 },
    { id: 'gaming', name: 'ألعاب', icon: '🎮', sort_order: 3 },
    { id: 'vpn', name: 'VPN', icon: '🔒', sort_order: 4 },
    { id: 'other', name: 'أخرى', icon: '📌', sort_order: 5 }
];

const defaultProducts = [
    {
        id: 1,
        name: 'Netflix Premium',
        description: 'اشتراك Netflix بريميوم - جودة Ultra HD - يدعم 4 شاشات في نفس الوقت',
        image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop',
        detail_image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=500&fit=crop',
        category: 'streaming',
        status: 'available',
        prices: [
            { duration: 'شهر', shared_price: 45, private_price: 70, originalPrice: 90 },
            { duration: '3 شهور', shared_price: 120, private_price: 210, originalPrice: 270 },
            { duration: '6 شهور', shared_price: 220, private_price: 420, originalPrice: 540 }
        ],
        sort_order: 0,
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Spotify Premium',
        description: 'Spotify بريميوم بدون إعلانات - جودة عالية - تحميل offline',
        image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=300&fit=crop',
        detail_image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=500&fit=crop',
        category: 'music',
        status: 'available',
        prices: [
            { duration: 'شهر', shared_price: 25, private_price: 50, originalPrice: 75 },
            { duration: '3 شهور', shared_price: 65, private_price: 150, originalPrice: 225 }
        ],
        sort_order: 1,
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        name: 'ChatGPT Plus',
        description: 'ChatGPT Plus - GPT-4 - DALL-E - أسرع استجابة',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
        detail_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
        category: 'other',
        status: 'available',
        prices: [
            { duration: 'شهر', shared_price: 100, private_price: 200, originalPrice: 250 }
        ],
        sort_order: 2,
        created_at: new Date().toISOString()
    }
];

// ====== INIT ======

// ====== URL SLUG HELPER ======
function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// ====== HASH ROUTER ======
function handleHashRoute() {
    var hash = location.hash;
    if (hash.startsWith('#/product/')) {
        var parts = hash.replace('#/product/', '').split('/');
        var id = parseInt(parts[0]);
        if (!isNaN(id)) {
            var p = products.find(function(x) { return x.id === id; });
            if (p) { showProductDetail(id); return; }
        }
    }
    if (hash === '#/deliveries') { showSection('deliveries'); return; }
    if (hash === '#/reviews') { showSection('reviews'); return; }
    if (hash === '#/terms') { showSection('terms'); return; }
    if (hash === '#/admin') { showSection('admin'); return; }
    // default
    showSection('products');
}


document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Tamm initializing...');
    isAdmin = localStorage.getItem(ADMIN_KEY) === 'true';
    initSupabase();
    setupEventListeners();
    checkAdminStatus();
    await loadData();
    console.log('✅ Tamm ready!');
});

function initSupabase() {
    try {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase ready (background mode)');
        } else {
            console.log('⏳ Waiting for Supabase...');
            setTimeout(initSupabase, 500);
        }
    } catch (e) {
        console.error('❌ Supabase init failed:', e);
        supabaseClient = null;
    }
}

async function loadData() {
    isLoading = true;
    renderSkeletons();
    var hasData = false;
    var tablesMissing = false;

    // STEP 1: Try Supabase client
    if (supabaseClient) {
        try {
            console.log('🔄 Fetching from Supabase via client...');

            var { data: prodData, error: prodError } = await supabaseClient
                .from('products')
                .select('*')
                .order('sort_order', { ascending: true });

            if (prodError) {
                if (prodError.code === 'PGRST205') {
                    console.error('❌ Supabase tables MISSING! Need to run SQL setup.');
                    tablesMissing = true;
                } else {
                    console.error('❌ Supabase products error:', prodError.code, prodError.message);
                }
            } else if (Array.isArray(prodData) && prodData.length > 0) {
                products = prodData;
                hasData = true;
                console.log('✅ Loaded', products.length, 'products from Supabase');
            }

            if (!tablesMissing) {
                var { data: catData, error: catError } = await supabaseClient
                    .from('categories')
                    .select('*')
                    .order('sort_order', { ascending: true });

                if (catError) console.error('❌ categories error:', catError.message);
                else if (Array.isArray(catData) && catData.length > 0) categories = catData;

                var { data: delData, error: delError } = await supabaseClient
                    .from('deliveries')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (delError) console.error('❌ deliveries error:', delError.message);
                else if (Array.isArray(delData)) deliveries = delData;

                var { data: revData, error: revError } = await supabaseClient
                    .from('reviews')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (revError) console.error('❌ reviews error:', revError.message);
                else if (Array.isArray(revData)) reviews = revData;

                var { data: testData, error: testError } = await supabaseClient
                    .from('testimonials')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (testError) console.error('❌ testimonials error:', testError.message);
                else if (Array.isArray(testData)) testimonials = testData;
            }

        } catch (err) {
            console.warn('⚠️ Supabase client fetch failed:', err.message);
        }
    }

    window._supabaseTablesMissing = tablesMissing;

    // STEP 2: If no Supabase data, try localStorage
    if (!hasData) {
        console.log('📦 Trying localStorage...');
        var cachedProducts = localStorage.getItem('stackstore_products');
        var cachedCategories = localStorage.getItem('stackstore_categories');
        var cachedDeliveries = localStorage.getItem('stackstore_deliveries');
        var cachedReviews = localStorage.getItem('stackstore_reviews');
        var cachedTestimonials = localStorage.getItem('stackstore_testimonials');
        var cachedReviewImages = localStorage.getItem('stackstore_review_images');

        if (cachedProducts) { try { products = JSON.parse(cachedProducts); hasData = true; } catch(e) { products = []; } }
        if (cachedCategories) { try { categories = JSON.parse(cachedCategories); } catch(e) { categories = []; } }
        if (cachedDeliveries) { try { deliveries = JSON.parse(cachedDeliveries); } catch(e) { deliveries = []; } }
        if (cachedReviews) { try { reviews = JSON.parse(cachedReviews); } catch(e) { reviews = []; } }
        if (cachedTestimonials) { try { testimonials = JSON.parse(cachedTestimonials); } catch(e) { testimonials = []; } }
        if (cachedReviewImages) { try { reviewImages = JSON.parse(cachedReviewImages); } catch(e) { reviewImages = []; } }
    }

    // STEP 3: If still no data, use defaults
    if (!hasData && products.length === 0) {
        console.log('📌 Using default data');
        products = JSON.parse(JSON.stringify(defaultProducts));
        categories = JSON.parse(JSON.stringify(defaultCategories));
    }

    // Save everything to localStorage for offline use
    try {
        localStorage.setItem('stackstore_products', JSON.stringify(products));
        localStorage.setItem('stackstore_categories', JSON.stringify(categories));
        localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
        localStorage.setItem('stackstore_reviews', JSON.stringify(reviews));
        localStorage.setItem('stackstore_testimonials', JSON.stringify(testimonials));
        localStorage.setItem('stackstore_review_images', JSON.stringify(reviewImages));
    } catch(e) {}

    products.forEach(function(p, i) { if (typeof p.sort_order !== 'number') p.sort_order = i; });
    products.sort(function(a, b) { return a.sort_order - b.sort_order; });
    categories.forEach(function(c, i) { if (typeof c.sort_order !== 'number') c.sort_order = i; });
    categories.sort(function(a, b) { return a.sort_order - b.sort_order; });

    isLoading = false;
    renderProducts();
    setupFilters();
    renderDeliveries();
    renderReviews();
    renderReviewImages();
    renderTestimonials();
    updateStats();
}

async function backgroundSyncFromSupabase() {
    if (!supabaseClient) { showToast('❌ Supabase مش متاح', 'error'); return; }
    if (window._supabaseTablesMissing) {
        showToast('⚠️ جداول Supabase ناقصة! شغل SQL script الأول', 'warning');
        return;
    }

    syncInProgress = true;
    showToast('🔄 جاري المزامنة مع السحابة...', 'info');

    try {
        var { data: prodData, error: prodError } = await supabaseClient
            .from('products').select('*').order('sort_order', { ascending: true });
        if (prodError) throw prodError;
        if (Array.isArray(prodData) && prodData.length > 0) {
            products = prodData;
            products.forEach(function(p, i) { if (typeof p.sort_order !== 'number') p.sort_order = i; });
            products.sort(function(a, b) { return a.sort_order - b.sort_order; });
            localStorage.setItem('stackstore_products', JSON.stringify(products));
            renderProducts(); updateStats();
        }

        var { data: catData, error: catError } = await supabaseClient
            .from('categories').select('*').order('sort_order', { ascending: true });
        if (catError) throw catError;
        if (Array.isArray(catData) && catData.length > 0) {
            categories = catData;
            localStorage.setItem('stackstore_categories', JSON.stringify(categories));
            setupFilters();
        }

        var { data: delData, error: delError } = await supabaseClient
            .from('deliveries').select('*').order('created_at', { ascending: false });
        if (delError) throw delError;
        if (Array.isArray(delData)) {
            deliveries = delData;
            localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
            renderDeliveries(); updateStats();
        }

        var { data: revData, error: revError } = await supabaseClient
            .from('reviews').select('*').order('created_at', { ascending: false });
        if (revError) throw revError;
        if (Array.isArray(revData)) {
            reviews = revData;
            localStorage.setItem('stackstore_reviews', JSON.stringify(reviews));
            renderReviews(); updateStats();
        }

        var { data: testData, error: testError } = await supabaseClient
            .from('testimonials').select('*').order('created_at', { ascending: false });
        if (testError) throw testError;
        if (Array.isArray(testData)) {
            testimonials = testData;
            localStorage.setItem('stackstore_testimonials', JSON.stringify(testimonials));
            renderTestimonials();
        }

        showToast('✅ تم المزامنة بنجاح!', 'success');
    } catch (err) {
        console.warn('⏱️ Background sync failed:', err.message);
        showToast('❌ فشل المزامنة: ' + err.message, 'error');
    } finally {
        syncInProgress = false;
    }
}

async function syncToSupabase(table, record) {
    if (!supabaseClient) return null;
    try {
        var cleanRecord = Object.assign({}, record);
        delete cleanRecord.date;        // local-only formatted string, not in DB

        var result = await supabaseClient.from(table).insert([cleanRecord]).select();
        if (result.error) throw result.error;
        if (result.data && result.data[0]) {
            console.log('✅ Saved to Supabase:', table, 'id:', result.data[0].id);
            return result.data[0].id;
        }
        return null;
    } catch (err) {
        console.warn('❌ Supabase save failed:', err.message, '| Table:', table, '| Code:', err.code);
        return null;
    }
}

async function deleteFromSupabase(table, id) {
    if (!supabaseClient) return;
    try {
        var result = await supabaseClient.from(table).delete().eq('id', id);
        if (result.error) throw result.error;
        console.log('✅ Deleted from Supabase:', table, id);
    } catch (err) {
        console.warn('❌ Supabase delete failed:', err.message);
    }
}

async function manualSyncFromCloud() {
    if (!supabaseClient) { showToast('❌ Supabase مش متاح حالياً', 'error'); return; }
    showToast('🔄 جاري المزامنة مع السحابة...', 'info');
    await backgroundSyncFromSupabase();
    showToast('✅ تم المزامنة بنجاح!', 'success');
}

function exportData() {
    var data = {
        products: products, categories: categories, deliveries: deliveries,
        reviews: reviews, testimonials: testimonials, reviewImages: reviewImages,
        exported_at: new Date().toISOString()
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'tamm-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('✅ تم تحميل النسخة الاحتياطية!', 'success');
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
            if (data.deliveries && Array.isArray(data.deliveries)) { 
                var existingIds = new Set(deliveries.map(function(d) { return d.id; }));
                data.deliveries.forEach(function(d) { 
                    if (!existingIds.has(d.id)) deliveries.unshift(d); 
                });
                localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries)); 
            }
            if (data.reviews) { reviews = data.reviews; localStorage.setItem('stackstore_reviews', JSON.stringify(reviews)); }
            if (data.testimonials) { testimonials = data.testimonials; localStorage.setItem('stackstore_testimonials', JSON.stringify(testimonials)); }
            if (data.reviewImages) { reviewImages = data.reviewImages; localStorage.setItem('stackstore_review_images', JSON.stringify(reviewImages)); }
            renderProducts(); renderAdminProducts(); renderDeliveries(); renderReviews(); renderTestimonials(); renderAdminTestimonials(); updateStats(); setupFilters();
            showToast('✅ تم استرجاع البيانات بنجاح!', 'success');
        } catch (err) { showToast('❌ ملف غير صالح!', 'error'); }
    };
    reader.readAsText(file);
    input.value = '';
}

function renderSkeletons() {
    var container = document.getElementById('productsGrid');
    if (!container) return;
    container.innerHTML = '<div class="products-skeleton">' +
        '<div class="skeleton-card"><div class="skeleton img"></div><div class="skeleton title"></div><div class="skeleton price"></div></div>' +
        '<div class="skeleton-card"><div class="skeleton img"></div><div class="skeleton title"></div><div class="skeleton price"></div></div>' +
        '<div class="skeleton-card"><div class="skeleton img"></div><div class="skeleton title"></div><div class="skeleton price"></div></div>' +
        '<div class="skeleton-card"><div class="skeleton img"></div><div class="skeleton title"></div><div class="skeleton price"></div></div>' +
        '</div>';
}

function setupEventListeners() {
    var paymentUpload = document.getElementById('paymentUpload');
    var deliveryUpload = document.getElementById('deliveryUpload');
    var reviewUpload = document.getElementById('reviewUpload');
    var paymentFile = document.getElementById('paymentFile');
    var deliveryFile = document.getElementById('deliveryFile');
    var reviewFile = document.getElementById('reviewFile');
    var paymentRemove = document.getElementById('paymentRemove');
    var deliveryRemove = document.getElementById('deliveryRemove');
    var reviewRemove = document.getElementById('reviewRemove');

    if (paymentUpload) {
        paymentUpload.addEventListener('click', function(e) {
            if (e.target !== paymentRemove) paymentFile.click();
        });
    }
    if (deliveryUpload) {
        deliveryUpload.addEventListener('click', function(e) {
            if (e.target !== deliveryRemove) deliveryFile.click();
        });
    }
    if (reviewUpload) {
        reviewUpload.addEventListener('click', function(e) {
            if (e.target !== reviewRemove) reviewFile.click();
        });
    }

    if (paymentFile) {
        paymentFile.addEventListener('change', function() {
            handleImageUpload(this, 'paymentPreview', 'paymentUpload', 'paymentRemove');
        });
    }
    if (deliveryFile) {
        deliveryFile.addEventListener('change', function() {
            handleImageUpload(this, 'deliveryPreview', 'deliveryUpload', 'deliveryRemove');
        });
    }
    if (reviewFile) {
        reviewFile.addEventListener('change', function() {
            handleImageUpload(this, 'reviewPreview', 'reviewUpload', 'reviewRemove');
        });
    }

    if (paymentRemove) {
        paymentRemove.addEventListener('click', function(e) {
            e.stopPropagation(); removeImage('paymentFile', 'paymentPreview', 'paymentUpload', 'paymentRemove');
        });
    }
    if (deliveryRemove) {
        deliveryRemove.addEventListener('click', function(e) {
            e.stopPropagation(); removeImage('deliveryFile', 'deliveryPreview', 'deliveryUpload', 'deliveryRemove');
        });
    }
    if (reviewRemove) {
        reviewRemove.addEventListener('click', function(e) {
            e.stopPropagation(); removeImage('reviewFile', 'reviewPreview', 'reviewUpload', 'reviewRemove');
        });
    }

    setupUpload('productImageUpload', 'productImageFile', 'productImagePreview', 'productImageUpload', 'productImageRemove');
    setupUpload('productDetailImageUpload', 'productDetailImageFile', 'productDetailImagePreview', 'productDetailImageUpload', 'productDetailImageRemove');
    setupUpload('testimonialUpload', 'testimonialFile', 'testimonialPreview', 'testimonialUpload', 'testimonialRemove');

    setupDatePicker();

    document.querySelectorAll('.nav-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var section = this.getAttribute('data-section');
            if (section === 'admin') openAdminLogin();
            else showSection(section);
        });
    });

    var btnSaveDelivery = document.getElementById('btnSaveDelivery');
    if (btnSaveDelivery) btnSaveDelivery.addEventListener('click', addDelivery);

    var btnSaveReview = document.getElementById('btnSaveReview');
    if (btnSaveReview) btnSaveReview.addEventListener('click', addReviewImage);

    var btnSavePublicReview = document.getElementById('btnSavePublicReview');
    if (btnSavePublicReview) btnSavePublicReview.addEventListener('click', addPublicReview);

    var btnSaveProduct = document.getElementById('btnSaveProduct');
    if (btnSaveProduct) btnSaveProduct.addEventListener('click', saveProduct);

    var btnSaveTestimonial = document.getElementById('btnSaveTestimonial');
    if (btnSaveTestimonial) btnSaveTestimonial.addEventListener('click', saveTestimonial);

    var btnAdminLogin = document.getElementById('btnAdminLogin');
    if (btnAdminLogin) btnAdminLogin.addEventListener('click', checkAdminCode);

    var adminCodeInput = document.getElementById('adminCodeInput');
    if (adminCodeInput) {
        adminCodeInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') checkAdminCode(); });
    }

    var btnBackFromLogin = document.getElementById('btnBackFromLogin');
    if (btnBackFromLogin) {
        btnBackFromLogin.addEventListener('click', function() {
            document.getElementById('adminLoginOverlay').classList.remove('active');
        });
    }

    var btnModalClose = document.getElementById('btnModalClose');
    if (btnModalClose) btnModalClose.addEventListener('click', closeModal);

    var imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', function(e) { if (e.target === this) closeModal(); });
    }

    var productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', function() { renderProducts(); });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.getElementById('adminLoginOverlay').classList.remove('active');
            document.getElementById('imageModal').classList.remove('active');
            document.getElementById('productModal').classList.remove('active');
            document.getElementById('datePickerOverlay').classList.remove('active');
            document.getElementById('testimonialModal').classList.remove('active');
        }
    });

    setupStarRatings();

    window.addEventListener('popstate', function(e) {
        var activeModals = [
            document.getElementById('adminLoginOverlay'),
            document.getElementById('imageModal'),
            document.getElementById('productModal'),
            document.getElementById('datePickerOverlay'),
            document.getElementById('testimonialModal')
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
            if (window.history && window.history.pushState) {
                history.pushState(null, '', location.href);
            }
        } else if (document.getElementById('productDetail').classList.contains('active')) {
            showSection('products');
        }
    });

    window.addEventListener('hashchange', handleHashRoute);

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

    document.querySelectorAll('button, .nav-tab, .filter-tab, .product-card').forEach(function(el) {
        el.addEventListener('touchstart', function() {}, { passive: true });
    });

    if (productSearch) {
        productSearch.addEventListener('focus', function() {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
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

function setupDatePicker() {
    var datePickerOverlay = document.getElementById('datePickerOverlay');
    var datePickerGrid = document.getElementById('datePickerGrid');
    var datePickerTitle = document.getElementById('datePickerTitle');
    var deliveryDateInput = document.getElementById('deliveryDate');
    if (!datePickerOverlay || !datePickerGrid) return;

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
        var today = new Date(); today.setHours(0,0,0,0);

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

    var btnOpenDatePicker = document.getElementById('btnOpenDatePicker');
    if (btnOpenDatePicker) {
        btnOpenDatePicker.addEventListener('click', function() {
            datePickerOverlay.classList.add('active');
            renderDatePicker(currentPickerDate.getFullYear(), currentPickerDate.getMonth());
        });
    }
    var datePrevMonth = document.getElementById('datePrevMonth');
    if (datePrevMonth) {
        datePrevMonth.addEventListener('click', function() {
            currentPickerDate.setMonth(currentPickerDate.getMonth() - 1);
            renderDatePicker(currentPickerDate.getFullYear(), currentPickerDate.getMonth());
        });
    }
    var dateNextMonth = document.getElementById('dateNextMonth');
    if (dateNextMonth) {
        dateNextMonth.addEventListener('click', function() {
            currentPickerDate.setMonth(currentPickerDate.getMonth() + 1);
            renderDatePicker(currentPickerDate.getFullYear(), currentPickerDate.getMonth());
        });
    }
    var datePickerClear = document.getElementById('datePickerClear');
    if (datePickerClear) {
        datePickerClear.addEventListener('click', function() {
            selectedPickerDate = null;
            deliveryDateInput.value = '';
            deliveryDateInput.removeAttribute('data-display');
            deliveryDateInput.classList.remove('has-value');
            datePickerOverlay.classList.remove('active');
        });
    }
    var datePickerToday = document.getElementById('datePickerToday');
    if (datePickerToday) {
        datePickerToday.addEventListener('click', function() {
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
    }
    datePickerOverlay.addEventListener('click', function(e) {
        if (e.target === datePickerOverlay) datePickerOverlay.classList.remove('active');
    });
}

function handleImageUpload(input, previewId, uploadId, removeId) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        var preview = document.getElementById(previewId);
        var uploadArea = document.getElementById(uploadId);
        var removeBtn = document.getElementById(removeId);
        if (!preview || !uploadArea) return;
        preview.src = e.target.result;
        preview.classList.add('show');
        uploadArea.classList.add('has-image');
        var content = uploadArea.querySelector('.upload-content');
        if (content) content.style.display = 'none';
        if (removeBtn) removeBtn.classList.add('show');
    };
    reader.readAsDataURL(file);
}

function removeImage(fileId, previewId, uploadId, removeId) {
    var fileInput = document.getElementById(fileId);
    var preview = document.getElementById(previewId);
    var uploadArea = document.getElementById(uploadId);
    var removeBtn = document.getElementById(removeId);
    if (fileInput) fileInput.value = '';
    if (preview) {
        preview.src = '';
        preview.classList.remove('show');
    }
    if (uploadArea) {
        uploadArea.classList.remove('has-image');
        var content = uploadArea.querySelector('.upload-content');
        if (content) content.style.display = 'block';
    }
    if (removeBtn) removeBtn.classList.remove('show');
}

function openImageModal(src) {
    var modalImage = document.getElementById('modalImage');
    var imageModal = document.getElementById('imageModal');
    if (modalImage) modalImage.src = src;
    if (imageModal) imageModal.classList.add('active');
    if (window.history && window.history.pushState) {
        history.pushState({ modal: true }, '', location.href);
    }
}

function closeModal() {
    var imageModal = document.getElementById('imageModal');
    if (imageModal) imageModal.classList.remove('active');
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
    if (!container) return;
    var searchInput = document.getElementById('productSearch');
    var search = searchInput ? searchInput.value.toLowerCase() : '';

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
            var prevShared = prev.shared_price || prev.price || Infinity;
            var prevPrivate = prev.private_price || prev.price || Infinity;
            var currShared = curr.shared_price || curr.price || Infinity;
            var currPrivate = curr.private_price || curr.price || Infinity;
            var prevMin = Math.min(prevShared, prevPrivate);
            var currMin = Math.min(currShared, currPrivate);
            return prevMin < currMin ? prev : curr;
        }) : null;

        var displayPrice = 0;
        var displayOriginal = 0;
        var discount = 0;
        if (bestPrice) {
            var shared = bestPrice.shared_price || bestPrice.price || Infinity;
            var priv = bestPrice.private_price || bestPrice.price || Infinity;
            displayPrice = Math.min(shared, priv);
            if (displayPrice === Infinity) displayPrice = 0;
            displayOriginal = bestPrice.originalPrice || bestPrice.original_price || 0;
            discount = displayOriginal && displayPrice ? Math.round((1 - displayPrice / displayOriginal) * 100) : 0;
        }
        var imgSrc = p.image || PLACEHOLDER_IMG;

        html += '<div class="product-card-wrapper">' +
            '<div class="product-card" onclick="showProductDetail(' + p.id + ')">' +
                (discount > 0 ? '<div class="card-discount-badge">خصم %' + discount + '</div>' : '') +
                '<img class="product-card-image" src="' + imgSrc + '" alt="' + p.name + '" loading="lazy" onerror="this.src=PLACEHOLDER_IMG">' +
            '</div>' +
            '<div class="product-info-below">' +
                '<button class="card-action-btn" onclick="event.stopPropagation(); showProductDetail(' + p.id + ')">فعل اشتراكك</button>' +
                '<div class="card-title-bottom">' + escapeHtml(p.name) + '</div>' +
                '<div class="card-price-row">' +
                    (displayOriginal ? '<span class="original-price">' + displayOriginal + ' ج.م</span>' : '') +
                    (bestPrice ? '<span class="sale-price">' + displayPrice + ' ج.م</span>' : '') +
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

    var slug = slugify(p.name);
    if (window.history && window.history.pushState) {
        history.pushState({ section: 'productDetail', productId: productId }, '', '#/product/' + productId + '/' + slug);
    }

    var statusClass = p.status || 'available';
    var statusText = statusClass === 'available' ? '<i class="fas fa-check-circle"></i> متاح' : statusClass === 'out_of_stock' ? '<i class="fas fa-circle-xmark"></i> نفذت الكمية' : '<i class="fas fa-clock"></i> قريباً';
    var imgSrc = p.image || PLACEHOLDER_IMG;

    // Build durations horizontal selector
    var durationsHtml = '';
    var priceDisplayHtml = '';
    if (p.prices && p.prices.length > 0) {
        // Durations pills
        var pills = '<div class="duration-pills">';
        var pills = '<div class="duration-pills" id="durationPills">';
        selectedDurationIdx = 0;
        // نختار أول مدة متاحة للـ مشترك (الافتراضي)
        for (var fi = 0; fi < p.prices.length; fi++) {
            if (p.prices[fi].shared_price || p.prices[fi].price) {
                selectedDurationIdx = fi;
                break;
            }
        }
        p.prices.forEach(function(pr, idx) {
            var activeClass = idx === selectedDurationIdx ? ' active' : '';
            pills += '<button class="duration-pill' + activeClass + '" data-idx="' + idx + '" onclick="selectDuration(' + idx + ')">' + escapeHtml(pr.duration) + '</button>';
        });
        pills += '</div>';

        // Type toggle (Shared vs Private)
        var toggle = '<div class="type-toggle">' +
            '<button class="type-btn active" data-type="shared" onclick="selectType(' + "'" + 'shared' + "'" + ')">' +
            '<span><i class="fas fa-users"></i></span>' +
            '<span>مشترك</span>' +
            '</button>' +
            '<button class="type-btn" data-type="private" onclick="selectType(' + "'" + 'private' + "'" + ')">' +
            '<span><i class="fas fa-user-shield"></i></span>' +
            '<span>خاص</span>' +
            '</button>' +
            '</div>';

        // Price display card
        var firstPrice = p.prices[0];
        var sharedPrice = firstPrice.shared_price || firstPrice.price || 0;
        var privatePrice = firstPrice.private_price || firstPrice.price || 0;
        var originalPrice = firstPrice.originalPrice || firstPrice.original_price || 0;
        var discount = originalPrice ? Math.round((1 - sharedPrice / originalPrice) * 100) : 0;

        priceDisplayHtml = '<div class="price-display-card" id="priceDisplayCard">' +
            (discount > 0 ? '<div class="price-discount-badge">وفر ' + discount + '%</div>' : '') +
            '<div class="price-main-row">' +
            '<div class="price-type-label" id="priceTypeLabel"><i class="fas fa-users"></i> اشتراك مشترك</div>' +
            '<div class="price-value-row">' +
            '<span class="price-current" id="priceCurrent">' + sharedPrice + '</span>' +
            '<span class="price-currency">ج.م</span>' +
            '</div>' +
            (originalPrice ? '<div class="price-original-row"><span class="price-original-line" id="priceOriginal">' + originalPrice + ' ج.م</span></div>' : '') +
            '</div>' +
            '<div class="price-duration-label" id="priceDurationLabel">' + escapeHtml(firstPrice.duration) + '</div>' +
            '</div>';

        durationsHtml = '<div class="durations-section">' + toggle + priceDisplayHtml + pills + '</div>';
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
        '<div class="card-title"><span class="icon"><i class="fas fa-coins"></i></span>اختر مدة الاشتراك</div>' +
        durationsHtml +
        '<button class="order-btn" ' + orderDisabled + ' onclick="orderProduct(' + p.id + ')">' + orderText + '</button>' +
        '</div>';

    var detailContent = document.getElementById('productDetailContent');
    if (detailContent) detailContent.innerHTML = html;
    renderProductReviews();

    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    var productDetail = document.getElementById('productDetail');
    if (productDetail) productDetail.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Globals for selected duration/type
var selectedDurationIdx = 0;
var selectedType = 'shared';

function selectDuration(idx) {
    if (!currentProduct || !currentProduct.prices[idx]) return;
    var pr = currentProduct.prices[idx];
    var hasPrice = selectedType === 'shared' ? (pr.shared_price || pr.price) : (pr.private_price || pr.price);
    if (!hasPrice) return; // مينفعش تختار مدة مالهاش سعر للنوع الحالي
    
    selectedDurationIdx = idx;
    document.querySelectorAll('.duration-pill').forEach(function(btn, i) {
        if (i === idx) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    updatePriceDisplay();
}

function selectType(type) {
    selectedType = type;
    document.querySelectorAll('.type-btn').forEach(function(btn) {
        if (btn.getAttribute('data-type') === type) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    // لو المدة الحالية مالهاش سعر للنوع الجديد، نروح لأول مدة متاحة
    if (currentProduct && currentProduct.prices[selectedDurationIdx]) {
        var pr = currentProduct.prices[selectedDurationIdx];
        var hasPrice = type === 'shared' ? (pr.shared_price || pr.price) : (pr.private_price || pr.price);
        if (!hasPrice) {
            for (var i = 0; i < currentProduct.prices.length; i++) {
                var checkPr = currentProduct.prices[i];
                var checkHas = type === 'shared' ? (checkPr.shared_price || checkPr.price) : (checkPr.private_price || checkPr.price);
                if (checkHas) {
                    selectedDurationIdx = i;
                    document.querySelectorAll('.duration-pill').forEach(function(btn, bi) {
                        if (bi === i) btn.classList.add('active');
                        else btn.classList.remove('active');
                    });
                    break;
                }
            }
        }
    }
    updatePriceDisplay();
}

function updatePriceDisplay() {
    if (!currentProduct || !currentProduct.prices || !currentProduct.prices[selectedDurationIdx]) return;
    var pr = currentProduct.prices[selectedDurationIdx];
    var price = selectedType === 'shared' ? (pr.shared_price || pr.price || 0) : (pr.private_price || pr.price || 0);
    var hasPrice = selectedType === 'shared' ? (pr.shared_price || pr.price) : (pr.private_price || pr.price);
    var original = pr.originalPrice || pr.original_price || 0;
    var discount = original && hasPrice ? Math.round((1 - price / original) * 100) : 0;

    var priceCurrent = document.getElementById('priceCurrent');
    var priceOriginal = document.getElementById('priceOriginal');
    var priceTypeLabel = document.getElementById('priceTypeLabel');
    var priceDurationLabel = document.getElementById('priceDurationLabel');
    var priceDisplayCard = document.getElementById('priceDisplayCard');
    var orderBtn = document.querySelector('#productDetail .order-btn');

    if (!hasPrice) {
        if (priceCurrent) {
            priceCurrent.innerHTML = '<span style="font-size:1.4rem;color:var(--danger);">غير متوفر</span>';
        }
        if (priceOriginal) priceOriginal.style.display = 'none';
        if (priceDurationLabel) priceDurationLabel.textContent = pr.duration;
        if (orderBtn) {
            orderBtn.disabled = true;
            orderBtn.style.opacity = '0.5';
            orderBtn.style.cursor = 'not-allowed';
            orderBtn.innerHTML = '<i class="fas fa-ban"></i> غير متوفر لهذه المدة';
        }
    } else {
        if (priceCurrent) {
            priceCurrent.innerHTML = price;
            priceCurrent.style.fontSize = '';
        }
        if (priceOriginal) {
            priceOriginal.style.display = '';
            priceOriginal.textContent = original + ' ج.م';
        }
        if (priceDurationLabel) priceDurationLabel.textContent = pr.duration;
        if (orderBtn && currentProduct.status === 'available') {
            orderBtn.disabled = false;
            orderBtn.style.opacity = '';
            orderBtn.style.cursor = '';
            orderBtn.innerHTML = '<i class="fas fa-cart-shopping"></i> اطلب الآن عبر واتساب';
        }
    }

    if (priceTypeLabel) {
        if (selectedType === 'shared') {
            priceTypeLabel.innerHTML = '<i class="fas fa-users"></i> اشتراك مشترك';
        } else {
            priceTypeLabel.innerHTML = '<i class="fas fa-user-shield"></i> اشتراك خاص';
        }
    }

    // Update pills availability (شيل علامة غير المتاح من المدد التانية)
    document.querySelectorAll('.duration-pill').forEach(function(btn) {
        var idx = parseInt(btn.getAttribute('data-idx'));
        var pData = currentProduct.prices[idx];
        var btnHasPrice = selectedType === 'shared' ? (pData.shared_price || pData.price) : (pData.private_price || pData.price);
        if (!btnHasPrice) {
            btn.classList.add('unavailable');
        } else {
            btn.classList.remove('unavailable');
        }
    });

    // Update discount badge
    if (priceDisplayCard) {
        var existingBadge = priceDisplayCard.querySelector('.price-discount-badge');
        if (existingBadge) existingBadge.remove();
        if (discount > 0 && hasPrice) {
            var badge = document.createElement('div');
            badge.className = 'price-discount-badge';
            badge.textContent = 'وفر ' + discount + '%';
            priceDisplayCard.insertBefore(badge, priceDisplayCard.firstChild);
        }
    }
}

function orderProduct(productId) {
    var p = products.find(function(x) { return x.id === productId; });
    if (!p || p.status !== 'available') return;

    var selectedPrice = p.prices && p.prices[selectedDurationIdx] ? p.prices[selectedDurationIdx] : null;
    if (!selectedPrice) return;

    var price = selectedType === 'shared' ? (selectedPrice.shared_price || selectedPrice.price || 0) : (selectedPrice.private_price || selectedPrice.price || 0);
    var duration = selectedPrice.duration || '';
    var typeLabel = selectedType === 'shared' ? 'مشترك' : 'خاص';

    var msg = 'مرحباً Tamm Store!%0A%0Aأنا مهتم بشراء: ' + encodeURIComponent(p.name) +
        '%0Aالمدة: ' + encodeURIComponent(duration) +
        '%0Aالنوع: ' + encodeURIComponent(typeLabel) +
        '%0Aالسعر: ' + price + ' ج.م' +
        '%0A%0Aأرجو التواصل معي للتفاصيل.';
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + msg, '_blank');
}

function renderProductReviews() {
    var container = document.getElementById('productReviewsList');
    if (!container || !currentProduct) return;

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
    var nameInput = document.getElementById('reviewerName');
    var textInput = document.getElementById('reviewerText');
    var name = nameInput ? nameInput.value.trim() : 'عميل';
    var text = textInput ? textInput.value.trim() : '';
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

    if (nameInput) nameInput.value = '';
    if (textInput) textInput.value = '';
    selectedRating = 0;
    updateStarDisplay('starRating', 0);

    renderProductReviews();
    renderReviews();
    updateStats();
    showToast('<i class="fas fa-check-circle"></i> تم إرسال رأيك بنجاح! شكراً لك <i class="fas fa-star"></i>', 'success');

    if (supabaseClient) {
        syncToSupabase('reviews', review);
    }
}

function openProductModal(productId) {
    editingProductId = productId || null;
    var title = document.getElementById('productModalTitle');
    if (title) title.textContent = productId ? 'تعديل منتج' : 'منتج جديد';

    var prodName = document.getElementById('prodName');
    var prodDesc = document.getElementById('prodDesc');
    var prodImageUrl = document.getElementById('prodImageUrl');
    var prodCategory = document.getElementById('prodCategory');
    var prodStatus = document.getElementById('prodStatus');
    var pricesContainer = document.getElementById('pricesContainer');
    var prodDetailImageUrl = document.getElementById('prodDetailImageUrl');

    if (productId) {
        var p = products.find(function(x) { return x.id === productId; });
        if (!p) return;
        if (prodName) prodName.value = p.name;
        if (prodDesc) prodDesc.value = p.description || '';
        if (prodImageUrl) prodImageUrl.value = p.image || '';
        if (prodCategory) {
            prodCategory.innerHTML = '';
            categories.forEach(function(cat) {
                if (cat.id === 'all') return;
                var opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = (cat.icon ? cat.icon + ' ' : '') + cat.name;
                prodCategory.appendChild(opt);
            });
            prodCategory.value = p.category || (categories[1] ? categories[1].id : 'other');
        }
        if (prodStatus) prodStatus.value = p.status || 'available';

        if (pricesContainer) {
            pricesContainer.innerHTML = '';
            if (p.prices && p.prices.length > 0) {
                p.prices.forEach(function(pr) {
                    addPriceRow(pr.duration, pr.shared_price, pr.private_price, pr.originalPrice);
                });
            } else {
                addPriceRow();
            }
        }

        var productImagePreview = document.getElementById('productImagePreview');
        if (p.image && productImagePreview) {
            productImagePreview.src = p.image;
            productImagePreview.classList.add('show');
            var productImageUpload = document.getElementById('productImageUpload');
            if (productImageUpload) {
                productImageUpload.classList.add('has-image');
                var content = productImageUpload.querySelector('.upload-content');
                if (content) content.style.display = 'none';
            }
            var productImageRemove = document.getElementById('productImageRemove');
            if (productImageRemove) productImageRemove.classList.add('show');
        }
        if (prodDetailImageUrl) prodDetailImageUrl.value = p.detail_image || '';
        var productDetailImagePreview = document.getElementById('productDetailImagePreview');
        if (p.detail_image && productDetailImagePreview) {
            productDetailImagePreview.src = p.detail_image;
            productDetailImagePreview.classList.add('show');
            var productDetailImageUpload = document.getElementById('productDetailImageUpload');
            if (productDetailImageUpload) {
                productDetailImageUpload.classList.add('has-image');
                var content2 = productDetailImageUpload.querySelector('.upload-content');
                if (content2) content2.style.display = 'none';
            }
            var productDetailImageRemove = document.getElementById('productDetailImageRemove');
            if (productDetailImageRemove) productDetailImageRemove.classList.add('show');
        }
    } else {
        if (prodName) prodName.value = '';
        if (prodDesc) prodDesc.value = '';
        if (prodImageUrl) prodImageUrl.value = '';
        if (prodCategory) {
            prodCategory.innerHTML = '';
            categories.forEach(function(cat) {
                if (cat.id === 'all') return;
                var opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = (cat.icon ? cat.icon + ' ' : '') + cat.name;
                prodCategory.appendChild(opt);
            });
            prodCategory.value = categories[1] ? categories[1].id : 'other';
        }
        if (prodStatus) prodStatus.value = 'available';
        if (pricesContainer) {
            pricesContainer.innerHTML = '';
            addPriceRow();
        }
        removeImage('productImageFile', 'productImagePreview', 'productImageUpload', 'productImageRemove');
        if (prodDetailImageUrl) prodDetailImageUrl.value = '';
        removeImage('productDetailImageFile', 'productDetailImagePreview', 'productDetailImageUpload', 'productDetailImageRemove');
    }

    var productModal = document.getElementById('productModal');
    if (productModal) productModal.classList.add('active');
    if (window.history && window.history.pushState) {
        history.pushState({ modal: true }, '', location.href);
    }
}

function closeProductModal() {
    var productModal = document.getElementById('productModal');
    if (productModal) productModal.classList.remove('active');
    editingProductId = null;
}

function addPriceRow(duration, sharedPrice, privatePrice, originalPrice) {
    var container = document.getElementById('pricesContainer');
    if (!container) return;
    var row = document.createElement('div');
    row.className = 'price-row';
    row.innerHTML = '<input type="text" class="price-duration" placeholder="المدة" value="' + (duration || '') + '">' +
        '<input type="number" class="price-shared" placeholder="سعر مشترك" value="' + (sharedPrice || '') + '">' +
        '<input type="number" class="price-private" placeholder="سعر خاص" value="' + (privatePrice || '') + '">' +
        '<input type="number" class="price-original" placeholder="السعر قبل" value="' + (originalPrice || '') + '">' +
        '<button class="btn btn-danger btn-sm" onclick="removePriceRow(this)"><i class="fas fa-trash"></i></button>';
    container.appendChild(row);
}

function removePriceRow(btn) {
    var row = btn.parentElement;
    var container = document.getElementById('pricesContainer');
    if (container && container.children.length > 1) {
        row.remove();
    } else {
        row.querySelectorAll('input').forEach(function(inp) { inp.value = ''; });
    }
}

async function saveProduct() {
    var prodName = document.getElementById('prodName');
    var prodDesc = document.getElementById('prodDesc');
    var prodImageUrl = document.getElementById('prodImageUrl');
    var prodCategory = document.getElementById('prodCategory');
    var prodStatus = document.getElementById('prodStatus');

    var name = prodName ? prodName.value.trim() : '';
    var desc = prodDesc ? prodDesc.value.trim() : '';
    var imageUrl = prodImageUrl ? prodImageUrl.value.trim() : '';
    var category = prodCategory ? prodCategory.value : 'other';
    var status = prodStatus ? prodStatus.value : 'available';

    if (!name) { showToast('<i class="fas fa-circle-xmark"></i> أدخل اسم المنتج!', 'error'); return; }

    var image = imageUrl;
    var preview = document.getElementById('productImagePreview');
    if (preview && preview.src && preview.classList.contains('show') && preview.src.startsWith('data:')) {
        image = preview.src;
    }

    var detailImageUrl = document.getElementById('prodDetailImageUrl');
    var detailImage = detailImageUrl ? detailImageUrl.value.trim() : '';
    var detailPreview = document.getElementById('productDetailImagePreview');
    if (detailPreview && detailPreview.src && detailPreview.classList.contains('show') && detailPreview.src.startsWith('data:')) {
        detailImage = detailPreview.src;
    }

    var prices = [];
    document.querySelectorAll('.price-row').forEach(function(row) {
        var duration = row.querySelector('.price-duration');
        var shared = row.querySelector('.price-shared');
        var privatePrice = row.querySelector('.price-private');
        var original = row.querySelector('.price-original');
        if (duration && duration.value.trim()) {
            prices.push({
                duration: duration.value.trim(),
                shared_price: parseFloat(shared && shared.value ? shared.value : 0) || null,
                private_price: parseFloat(privatePrice && privatePrice.value ? privatePrice.value : 0) || null,
                originalPrice: parseFloat(original && original.value ? original.value : 0) || null
            });
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
            productData.sort_order = products[idx].sort_order;
            products[idx] = productData;
        }
    } else {
        productData.id = Date.now();
        productData.sort_order = products.length;
        products.unshift(productData);
    }

    try {
        localStorage.setItem('stackstore_products', JSON.stringify(products));
    } catch (e) {
        console.warn('localStorage full, skipping local save:', e);
    }

    renderProducts();
    renderAdminProducts();
    updateStats();

    if (supabaseClient) {
        try {
            if (editingProductId) {
                var result = await supabaseClient.from('products').update(productData).eq('id', editingProductId);
                if (result.error) throw result.error;
            } else {
                var result2 = await supabaseClient.from('products').insert([productData]);
                if (result2.error) throw result2.error;
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
    if (!container) return;
    if (products.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">مفيش منتجات لسه</p>';
        return;
    }

    var html = '<p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:10px;"><i class="fas fa-lightbulb"></i> اسحب الصفوف عشان ترتب المنتجات. الترتيب هيتطبق على الموقع فوراً.</p>';
    html += '<table class="admin-table" id="adminProductsTable"><thead><tr><th style="width:30px;">⇅</th><th>صورة</th><th>الاسم</th><th>التصنيف</th><th>الحالة</th><th>الإجراءات</th></tr></thead><tbody>';
    products.forEach(function(p, idx) {
        var statusText = p.status === 'available' ? '<i class="fas fa-check-circle"></i>' : p.status === 'out_of_stock' ? '<i class="fas fa-circle-xmark"></i>' : '<i class="fas fa-clock"></i>';
        html += '<tr draggable="true" data-id="' + p.id + '" data-index="' + idx + '" class="sortable-row">' +
            '<td class="drag-handle" style="cursor:grab;color:var(--text-muted);text-align:center;"><i class="fas fa-grip-lines"></i></td>' +
            '<td><img class="product-thumb" src="' + (p.image || PLACEHOLDER_IMG) + '" alt=""></td>' +
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
    setupDragAndDrop('adminProductsTable', products, 'stackstore_products');
}

function getCategoryName(cat) {
    var found = categories.find(function(c) { return c.id === cat; });
    return found ? found.name : cat;
}

async function addDelivery() {
    var paymentFile = document.getElementById('paymentFile').files[0];
    var deliveryFile = document.getElementById('deliveryFile').files[0];
    var notes = document.getElementById('deliveryNotes');
    var dateInput = document.getElementById('deliveryDate');

    if (!paymentFile) { showToast('❌ ضيف صورة الدفع!', 'error'); return; }
    if (!deliveryFile) { showToast('❌ ضيف صورة التسليم!', 'error'); return; }

    var overlay = document.getElementById('compressionOverlay');
    var progressBar = document.getElementById('compressionProgress');
    var progressText = document.getElementById('compressionText');
    if (overlay) overlay.classList.add('active');
    if (progressBar) progressBar.style.width = '10%';
    if (progressText) progressText.textContent = 'جاري ضغط صورة الدفع...';

    try {
        var paymentCompressed = await compressImage(paymentFile, 1200, 0.85);
        if (progressBar) progressBar.style.width = '40%';
        if (progressText) progressText.textContent = 'صورة الدفع: -' + paymentCompressed.reduction + '% | جاري ضغط صورة التسليم...';

        var deliveryCompressed = await compressImage(deliveryFile, 1200, 0.85);
        if (progressBar) progressBar.style.width = '70%';
        if (progressText) progressText.textContent = 'صورة التسليم: -' + deliveryCompressed.reduction + '% | جاري الحفظ...';

        var paymentReader = new FileReader();
        var deliveryReader = new FileReader();

        var paymentBase64 = await new Promise(function(resolve) {
            paymentReader.onload = function(e) { resolve(e.target.result); };
            paymentReader.readAsDataURL(paymentCompressed.file);
        });

        var deliveryBase64 = await new Promise(function(resolve) {
            deliveryReader.onload = function(e) { resolve(e.target.result); };
            deliveryReader.readAsDataURL(deliveryCompressed.file);
        });

        var newDelivery = {
            id: Date.now(),
            payment_image: paymentBase64,
            delivery_image: deliveryBase64,
            notes: notes ? notes.value.trim() : '',
            delivery_date: dateInput && dateInput.value ? dateInput.value : null,
            created_at: new Date().toISOString(),
            date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };

        deliveries.unshift(newDelivery);
        localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));

        if (progressBar) progressBar.style.width = '90%';
        if (progressText) progressText.textContent = 'تم الحفظ محلياً...';

        if (supabaseClient) {
            try {
                var paymentUrl = await uploadToSupabaseStorage(paymentCompressed.file, 'payments');
                var deliveryUrl = await uploadToSupabaseStorage(deliveryCompressed.file, 'deliveries');

                var record = {
                    id: newDelivery.id,
                    payment_image: paymentUrl,
                    delivery_image: deliveryUrl,
                    notes: newDelivery.notes,
                    delivery_date: newDelivery.delivery_date,
                    created_at: newDelivery.created_at
                };

                var remoteId = await syncToSupabase('deliveries', record);
                if (remoteId) {
                    newDelivery.id = remoteId;
                    newDelivery.payment_image = paymentUrl;
                    newDelivery.delivery_image = deliveryUrl;
                    localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
                    console.log('✅ Delivery synced to Supabase with id:', remoteId);
                }
            } catch (supaErr) { 
                console.warn('⚠️ Supabase upload failed:', supaErr.message); 
            }
        }

        if (notes) notes.value = '';
        if (dateInput) dateInput.value = '';
        removeImage('paymentFile', 'paymentPreview', 'paymentUpload', 'paymentRemove');
        removeImage('deliveryFile', 'deliveryPreview', 'deliveryUpload', 'deliveryRemove');

        if (progressBar) progressBar.style.width = '100%';
        if (overlay) overlay.classList.remove('active');
        renderDeliveries();
        showToast('✅ تم حفظ التسليم بنجاح!', 'success');

    } catch (err) {
        if (overlay) overlay.classList.remove('active');
        console.error(err);
        showToast('❌ حصل خطأ: ' + (err.message || err), 'error');
    }
}

async function deleteDelivery(id) {
    if (!confirm('متأكد إنك عاوز تمسح التسليم دا؟')) return;

    var deliveryToDelete = deliveries.find(function(d) { return d.id === id; });
    deliveries = deliveries.filter(function(d) { return d.id !== id; });
    localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
    renderDeliveries();
    showToast('🗑️ تم المسح!', 'success');

    if (supabaseClient && deliveryToDelete) {
        try {
            if (deliveryToDelete.payment_image && deliveryToDelete.payment_image.includes('supabase')) {
                var paymentPath = deliveryToDelete.payment_image.split('/').pop();
                await supabaseClient.storage.from('stackstore').remove(['payments/' + paymentPath]);
            }
            if (deliveryToDelete.delivery_image && deliveryToDelete.delivery_image.includes('supabase')) {
                var deliveryPath = deliveryToDelete.delivery_image.split('/').pop();
                await supabaseClient.storage.from('stackstore').remove(['deliveries/' + deliveryPath]);
            }
            var result = await supabaseClient.from('deliveries').delete().eq('id', id);
            if (result.error && deliveryToDelete.created_at) {
                await supabaseClient.from('deliveries').delete().eq('created_at', deliveryToDelete.created_at);
            }
        } catch (err) { console.warn('Supabase cleanup failed:', err.message); }
    }
}

function formatArabicDate(dateStr, includeTime) {
    if (!dateStr) return '';
    var date = new Date(dateStr);
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    if (includeTime) { options.hour = '2-digit'; options.minute = '2-digit'; }
    return date.toLocaleDateString('ar-EG', options);
}

function renderDeliveries() {
    var container = document.getElementById('deliveriesList');
    if (!container) return;
    if (isLoading) return;
    if (deliveries.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon">📦</div><h3>لا توجد تسليمات بعد</h3><p>سيتم عرض التسليمات هنا بمجرد إضافتها</p></div>';
        return;
    }
    var sorted = deliveries.slice().sort(function(a, b) {
        var dateA = a.delivery_date ? new Date(a.delivery_date) : new Date(a.created_at);
        var dateB = b.delivery_date ? new Date(b.delivery_date) : new Date(b.created_at);
        return dateB - dateA;
    });
    var html = '<div class="deliveries-grid">';
    for (var i = 0; i < sorted.length; i++) {
        var d = sorted[i];
        var displayDate, dateBadge = '';
        if (d.delivery_date) {
            displayDate = new Date(d.delivery_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
            dateBadge = '<span class="date-badge-custom">📌 تاريخ محدد</span>';
        } else {
            displayDate = d.date || new Date(d.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
        var notesHtml = d.notes ? '<p style="color:var(--text-muted);font-size:0.9rem;margin-top:10px;">📝 ' + escapeHtml(d.notes) + '</p>' : '';
        var adminHtml = isAdmin ? '<div class="card-footer"><button class="btn btn-danger btn-sm" onclick="deleteDelivery(' + d.id + ')"><span>🗑️</span> مسح</button></div>' : '';
        html += '<div class="delivery-card"><div class="card-header"><span class="delivery-number">#' + (sorted.length - i) + '</span><span class="date">' + dateBadge + '📅 ' + displayDate + '</span></div><div class="card-body"><div class="images-row"><div class="img-box" onclick="openImageModal(' + "'" + d.payment_image + "'" + ')"><img src="' + d.payment_image + '" alt="صورة الدفع" loading="lazy"><div class="img-label">💳 الدفع</div></div><div class="img-box" onclick="openImageModal(' + "'" + d.delivery_image + "'" + ')"><img src="' + d.delivery_image + '" alt="صورة التسليم" loading="lazy"><div class="img-label">📤 التسليم</div></div></div>' + notesHtml + '</div>' + adminHtml + '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
}

async function addPublicReview() {
    var nameInput = document.getElementById('publicReviewerName');
    var textInput = document.getElementById('publicReviewText');
    var name = nameInput ? nameInput.value.trim() : 'عميل';
    var text = textInput ? textInput.value.trim() : '';

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

    if (nameInput) nameInput.value = '';
    if (textInput) textInput.value = '';
    publicSelectedRating = 0;
    updateStarDisplay('publicStarRating', 0);

    renderReviews();
    updateStats();
    showToast('<i class="fas fa-check-circle"></i> تم إرسال رأيك بنجاح! شكراً لك <i class="fas fa-star"></i>', 'success');

    if (supabaseClient) {
        syncToSupabase('reviews', review);
    }
}

async function deleteReview(id) {
    if (!confirm('متأكد إنك عاوز تمسح الرأي دا؟')) return;

    var reviewToDelete = reviews.find(function(r) { return r.id === id; });
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

    if (supabaseClient && reviewToDelete) {
        try {
            if (reviewToDelete.image && reviewToDelete.image.includes('supabase')) {
                var imagePath = reviewToDelete.image.split('/').pop();
                await supabaseClient.storage.from('stackstore').remove(['reviews/' + imagePath]);
            }
            // Try delete by id first, if that fails try by created_at as fallback
            var result = await supabaseClient.from('reviews').delete().eq('id', id);
            if (result.error && reviewToDelete.created_at) {
                await supabaseClient.from('reviews').delete().eq('created_at', reviewToDelete.created_at);
            }
        } catch (err) {
            console.log('Supabase review delete failed:', err);
        }
    }
}

function renderReviews() {
    var container = document.getElementById('reviewsList');
    if (!container) return;
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
    var html = '<p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:10px;"><i class="fas fa-lightbulb"></i> اسحب الصفوف عشان ترتب الأقسام. "الكل" ثابت في الأول.</p>';
    html += '<table class="admin-table" id="adminCategoriesTable"><thead><tr><th style="width:30px;">⇅</th><th>الأيقونة</th><th>الاسم</th><th>المعرف</th><th>الإجراءات</th></tr></thead><tbody>';
    categories.forEach(function(cat, idx) {
        if (cat.id === 'all') return;
        html += '<tr draggable="true" data-id="' + cat.id + '" data-index="' + idx + '" class="sortable-row">' +
            '<td class="drag-handle" style="cursor:grab;color:var(--text-muted);text-align:center;"><i class="fas fa-grip-lines"></i></td>' +
            '<td style="font-size:1.4rem;text-align:center;">' + (cat.icon || '—') + '</td>' +
            '<td style="font-weight:700;">' + escapeHtml(cat.name) + '</td>' +
            '<td><code style="background:var(--bg);padding:4px 10px;border-radius:6px;font-size:0.8rem;color:var(--text-muted);border:1px solid var(--border);">' + cat.id + '</code></td>' +
            '<td class="action-btns">' +
            '<button class="btn-edit" onclick="openCategoryModal(' + "'" + cat.id + "'" + ')"><i class="fas fa-pen-to-square"></i> تعديل</button>' +
            '<button class="btn-delete" onclick="deleteCategory(' + "'" + cat.id + "'" + ')"><i class="fas fa-trash"></i> مسح</button>' +
            '</td></tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
    setupDragAndDrop('adminCategoriesTable', categories, 'stackstore_categories', true);
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
        categories.push({ id: newId, name: newName, icon: newIcon, sort_order: categories.length });
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

async function addReviewImage() {
    var file = document.getElementById('reviewFile').files[0];
    if (!file) { showToast('❌ ضيف صورة الرأي!', 'error'); return; }

    var overlay = document.getElementById('compressionOverlay');
    var progressBar = document.getElementById('compressionProgress');
    var progressText = document.getElementById('compressionText');
    if (overlay) overlay.classList.add('active');
    if (progressBar) progressBar.style.width = '20%';
    if (progressText) progressText.textContent = 'جاري ضغط الصورة...';

    try {
        var compressed = await compressImage(file, 1200, 0.85);
        if (progressBar) progressBar.style.width = '50%';
        if (progressText) progressText.textContent = 'تم الضغط: -' + compressed.reduction + '% | جاري الحفظ...';

        var reader = new FileReader();
        var base64 = await new Promise(function(resolve) {
            reader.onload = function(e) { resolve(e.target.result); };
            reader.readAsDataURL(compressed.file);
        });

        var newReview = {
            id: Date.now(), image: base64, created_at: new Date().toISOString(),
            date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
        };

        reviewImages.unshift(newReview);
        localStorage.setItem('stackstore_review_images', JSON.stringify(reviewImages));

        if (progressBar) progressBar.style.width = '80%';
        if (progressText) progressText.textContent = 'تم الحفظ محلياً...';

        if (supabaseClient) {
            try {
                var imageUrl = await uploadToSupabaseStorage(compressed.file, 'reviews');
                var result = await supabaseClient.from('reviews').insert([{ image: imageUrl, created_at: newReview.created_at }]).select();
                if (!result.error && result.data) {
                    newReview.id = result.data[0].id;
                    newReview.image = imageUrl;
                    localStorage.setItem('stackstore_review_images', JSON.stringify(reviewImages));
                }
            } catch (supaErr) { console.warn('⚠️ Supabase upload failed:', supaErr.message); }
        }

        removeImage('reviewFile', 'reviewPreview', 'reviewUpload', 'reviewRemove');
        if (progressBar) progressBar.style.width = '100%';
        if (overlay) overlay.classList.remove('active');
        renderReviewImages();
        showToast('✅ تم حفظ صورة الرأي بنجاح!', 'success');

    } catch (err) {
        if (overlay) overlay.classList.remove('active');
        console.error(err);
        showToast('❌ حصل خطأ: ' + (err.message || err), 'error');
    }
}

async function deleteReviewImage(id) {
    if (!confirm('متأكد إنك عاوز تمسح صورة الرأي دي؟')) return;

    var reviewToDelete = reviewImages.find(function(r) { return r.id === id; });
    reviewImages = reviewImages.filter(function(r) { return r.id !== id; });
    localStorage.setItem('stackstore_review_images', JSON.stringify(reviewImages));
    renderReviewImages();
    showToast('🗑️ تم المسح!', 'success');

    if (supabaseClient && reviewToDelete) {
        try {
            if (reviewToDelete.image && reviewToDelete.image.includes('supabase')) {
                var imagePath = reviewToDelete.image.split('/').pop();
                await supabaseClient.storage.from('stackstore').remove(['reviews/' + imagePath]);
            }
            await supabaseClient.from('reviews').delete().eq('id', id);
        } catch (err) { console.warn('Supabase cleanup failed:', err.message); }
    }
}

function renderReviewImages() {
    var container = document.getElementById('reviewsList');
    if (!container) return;
    if (isLoading) return;
    if (reviewImages.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon">⭐</div><h3>لا توجد صور آراء بعد</h3><p>سيتم عرض صور آراء العملاء هنا</p></div>';
        return;
    }
    var sorted = reviewImages.slice().sort(function(a, b) { return new Date(b.created_at) - new Date(a.created_at); });
    var html = '<div class="reviews-grid">';
    for (var i = 0; i < sorted.length; i++) {
        var r = sorted[i];
        var dateStr = r.date || new Date(r.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
        var deleteBtn = isAdmin ? '<button class="delete-btn" onclick="deleteReviewImage(' + r.id + ')" style="opacity:1;">🗑️ مسح</button>' : '';
        html += '<div class="review-image-card">' + deleteBtn + '<img class="review-img" src="' + r.image + '" alt="رأي عميل" onclick="openImageModal(' + "'" + r.image + "'" + ')" loading="lazy"><div class="review-info"><span class="reviewer-name">⭐ رأي عميل</span><span class="review-date">📅 ' + dateStr + '</span></div></div>';
    }
    html += '</div>';
    container.innerHTML = html;
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
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'info');
    toast.innerHTML = '<span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3000);
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
        html += '<div class="testimonial-card" onclick="openImageModal(' + "'" + t.image + "'" + ')">' +
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
    var modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.add('active');
        if (window.history && window.history.pushState) {
            history.pushState({ modal: true }, '', location.href);
        }
    }
}

function closeTestimonialModal() {
    var modal = document.getElementById('testimonialModal');
    if (modal) modal.classList.remove('active');
    removeImage('testimonialFile', 'testimonialPreview', 'testimonialUpload', 'testimonialRemove');
    var testimonialName = document.getElementById('testimonialName');
    if (testimonialName) testimonialName.value = '';
}

async function saveTestimonial() {
    var file = document.getElementById('testimonialFile').files[0];
    var nameInput = document.getElementById('testimonialName');
    var name = nameInput ? nameInput.value.trim() : 'عميل';
    var preview = document.getElementById('testimonialPreview');
    var image = preview && preview.src && preview.classList.contains('show') ? preview.src : null;

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
        var remoteId = await syncToSupabase('testimonials', testimonial);
        if (remoteId) {
            closeTestimonialModal();
            showToast('<i class="fas fa-check-circle"></i> تم حفظ صورة الرأي في السحابة!', 'success');
        } else {
            closeTestimonialModal();
            showToast('<i class="fas fa-triangle-exclamation"></i> تم الحفظ محلياً فقط - Supabase غير متاح', 'warning');
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
            '<div class="img-box" onclick="openImageModal(' + "'" + t.image + "'" + ')" style="aspect-ratio:9/16;">' +
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

/* ====== SUPABASE HEALTH & MIGRATION ====== */

async function checkSupabaseHealth() {
    if (!supabaseClient) return { ok: false, error: 'Supabase client not ready' };
    try {
        var { error } = await supabaseClient.from('products').select('id', { head: true, count: 'exact' });
        if (error && error.code === 'PGRST205') return { ok: false, error: 'Tables missing', code: 'PGRST205' };
        if (error) return { ok: false, error: error.message, code: error.code };
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

async function migrateAllToSupabase() {
    if (!supabaseClient) { showToast('❌ Supabase مش متاح', 'error'); return; }

    var health = await checkSupabaseHealth();
    if (!health.ok && health.code === 'PGRST205') {
        showToast('⚠️ لسّه الجداول ناقصة! نفّذ SQL script في Supabase الأول', 'error');
        return;
    }
    if (!health.ok) {
        showToast('❌ مشكلة في Supabase: ' + health.error, 'error');
        return;
    }

    showToast('🚀 جاري نقل البيانات المحلية للسحابة...', 'info');
    var migrated = 0;

    // Migrate products
    if (products.length > 0) {
        try {
            var { error } = await supabaseClient.from('products').upsert(products, { onConflict: 'id' });
            if (error) throw error;
            migrated += products.length;
        } catch (e) { console.warn('Products migration failed:', e.message); }
    }

    // Migrate categories
    if (categories.length > 0) {
        try {
            var { error } = await supabaseClient.from('categories').upsert(categories, { onConflict: 'id' });
            if (error) throw error;
            migrated += categories.length;
        } catch (e) { console.warn('Categories migration failed:', e.message); }
    }

    // Migrate deliveries
    if (deliveries.length > 0) {
        try {
            var cleanDeliveries = deliveries.map(function(d) {
                var copy = Object.assign({}, d);
                delete copy.date;
                return copy;
            });
            var { error } = await supabaseClient.from('deliveries').upsert(cleanDeliveries, { onConflict: 'id' });
            if (error) throw error;
            migrated += deliveries.length;
        } catch (e) { console.warn('Deliveries migration failed:', e.message); }
    }

    // Migrate reviews
    if (reviews.length > 0) {
        try {
            var cleanReviews = reviews.map(function(r) {
                var copy = Object.assign({}, r);
                delete copy.date;
                return copy;
            });
            var { error } = await supabaseClient.from('reviews').upsert(cleanReviews, { onConflict: 'id' });
            if (error) throw error;
            migrated += reviews.length;
        } catch (e) { console.warn('Reviews migration failed:', e.message); }
    }

    // Migrate testimonials
    if (testimonials.length > 0) {
        try {
            var { error } = await supabaseClient.from('testimonials').upsert(testimonials, { onConflict: 'id' });
            if (error) throw error;
            migrated += testimonials.length;
        } catch (e) { console.warn('Testimonials migration failed:', e.message); }
    }

    showToast('✅ تم نقل ' + migrated + ' سجل لـ Supabase!', 'success');
    console.log('🚀 Migration complete:', migrated, 'records');

    // Refresh from cloud to confirm
    setTimeout(backgroundSyncFromSupabase, 1000);
}

/* ====== ADMIN & NAVIGATION ====== */
function renderAdminSection() {
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
    var tabAdmin = document.getElementById('tabAdmin');
    if (tabAdmin) tabAdmin.classList.add('active');

    var adminSection = document.getElementById('admin');
    if (!adminSection) return;

    // Show Supabase status warning if tables missing
    var statusHtml = '';
    if (window._supabaseTablesMissing) {
        statusHtml = '<div class="card" style="border-color:var(--danger);background:rgba(239,68,68,0.1);">' +
            '<div class="card-title" style="color:var(--danger);"><i class="fas fa-triangle-exclamation"></i> تنبيه: جداول Supabase ناقصة!</div>' +
            '<p style="margin-bottom:15px;">المنتجات والأقسام والآراء مش هتتحفظ في السحابة لحد ما تنشئ الجداول. شغل SQL script في Supabase SQL Editor.</p>' +
            '<button class="btn btn-primary" onclick="migrateAllToSupabase()" style="width:100%;justify-content:center;">' +
            '<span><i class="fas fa-cloud-arrow-up"></i></span><span>نقل البيانات المحلية للسحابة</span>' +
            '</button></div>';
    } else {
        statusHtml = '<div class="card" style="border-color:var(--success);background:rgba(34,197,94,0.08);">' +
            '<div class="card-title" style="color:var(--success);"><i class="fas fa-check-circle"></i> Supabase متصل</div>' +
            '<p>كل البيانات بتتزامن مع السحابة.</p>' +
            '<button class="btn btn-primary" onclick="backgroundSyncFromSupabase()" style="width:100%;justify-content:center;">' +
            '<span><i class="fas fa-rotate"></i></span><span>مزامنة يدوية</span>' +
            '</button></div>';
    }

    // Insert status banner at top of admin section
    var existingStatus = document.getElementById('adminStatusBanner');
    if (!existingStatus) {
        var banner = document.createElement('div');
        banner.id = 'adminStatusBanner';
        adminSection.insertBefore(banner, adminSection.firstChild);
    }
    document.getElementById('adminStatusBanner').innerHTML = statusHtml;

    renderAdminProducts();
    renderAdminCategories();
    renderAdminDeliveries();
    renderAdminReviews();
    renderAdminTestimonials();

    adminSection.classList.add('active');
}

function logoutAdmin() {
    if (!confirm('متأكد إنك عاوز تسجل خروج؟ هتحتاج تدخل الكود تاني.')) return;
    isAdmin = false;
    localStorage.removeItem(ADMIN_KEY);
    var adminBadge = document.getElementById('adminBadge');
    if (adminBadge) adminBadge.classList.remove('active');
    var addDeliveryForm = document.getElementById('addDeliveryForm');
    if (addDeliveryForm) addDeliveryForm.classList.remove('active');

    var adminTab = document.getElementById('tabAdmin');
    if (adminTab) {
        adminTab.innerHTML = '<span class="icon">🔐</span><span>لوحة الأدمن</span>';
    }

    showToast('👋 تم تسجيل الخروج!', 'success');
    showSection('products');
    renderDeliveries();
    renderReviewImages();
}

function updateStats() {
    var statProducts = document.getElementById('statProducts');
    var statDeliveries = document.getElementById('statDeliveries');
    var statReviews = document.getElementById('statReviews');
    var statOrders = document.getElementById('statOrders');
    if (statProducts) statProducts.textContent = products.length;
    if (statDeliveries) statDeliveries.textContent = deliveries.length;
    if (statReviews) statReviews.textContent = reviews.length;
    if (statOrders) statOrders.textContent = deliveries.length;
}

function renderAdminDeliveries() {
    var container = document.getElementById('adminDeliveriesList');
    if (!container) return;
    if (deliveries.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">مفيش تسليمات لسه</p>';
        return;
    }
    var html = '<div class="deliveries-grid">';
    deliveries.forEach(function(d, i) {
        var dateStr = d.delivery_date ? new Date(d.delivery_date).toLocaleDateString('ar-EG') : (d.date || new Date(d.created_at).toLocaleDateString('ar-EG'));
        html += '<div class="delivery-card"><div class="card-header"><span class="delivery-number">#' + (deliveries.length - i) + '</span><span class="date">' + dateStr + '</span></div><div class="card-body"><div class="images-row"><div class="img-box" onclick="openImageModal(' + "'" + d.payment_image + "'" + ')"><img src="' + d.payment_image + '" alt="صورة الدفع" loading="lazy"><div class="img-label"><i class="fas fa-credit-card"></i> الدفع</div></div><div class="img-box" onclick="openImageModal(' + "'" + d.delivery_image + "'" + ')"><img src="' + d.delivery_image + '" alt="صورة التسليم" loading="lazy"><div class="img-label"><i class="fas fa-paper-plane"></i> التسليم</div></div></div></div><div class="card-footer"><button class="btn btn-danger btn-sm" onclick="deleteDelivery(' + d.id + ')"><span><i class="fas fa-trash"></i></span> مسح</button></div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function renderAdminReviews() {
    var container = document.getElementById('adminReviewsList');
    if (!container) return;
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
        if (overlay) overlay.classList.remove('active');
        if (icon) icon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    } else {
        drawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
        if (icon) icon.className = 'fas fa-xmark';
        document.body.style.overflow = 'hidden';
    }
}

function checkAdminStatus() {
    if (isAdmin) {
        var adminBadge = document.getElementById('adminBadge');
        if (adminBadge) adminBadge.classList.add('active');
        var addDeliveryForm = document.getElementById('addDeliveryForm');
        if (addDeliveryForm) addDeliveryForm.classList.add('active');
        var adminTab = document.getElementById('tabAdmin');
        if (adminTab) {
            adminTab.innerHTML = '<span class="icon">⚙️</span><span>لوحة التحكم</span>';
        }
    }
}

function openAdminLogin() {
    if (isAdmin) { showSection('admin'); return; }
    var overlay = document.getElementById('adminLoginOverlay');
    if (overlay) overlay.classList.add('active');
    var input = document.getElementById('adminCodeInput');
    if (input) {
        input.value = '';
        input.focus();
    }
}

function checkAdminCode() {
    var input = document.getElementById('adminCodeInput');
    var code = input ? input.value.trim() : '';
    if (code === ADMIN_CODE) {
        isAdmin = true;
        localStorage.setItem(ADMIN_KEY, 'true');
        var overlay = document.getElementById('adminLoginOverlay');
        if (overlay) overlay.classList.remove('active');
        checkAdminStatus();
        showToast('✅ تم تسجيل الدخول كأدمن! الجهاز دايماً هيفضل أدمن.', 'success');
        showSection('products');
    } else {
        showToast('❌ كود الأدمن غلط! جرب تاني.', 'error');
        if (input) {
            input.value = '';
            input.focus();
        }
    }
}

function showSection(sectionId) {
    if (sectionId === 'admin' && !isAdmin) { openAdminLogin(); return; }

    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });

    if (sectionId === 'admin') {
        renderAdminSection();
        if (window.history && window.history.pushState) {
            history.pushState({ section: 'admin' }, '', '#/admin');
        }
        return;
    }

    var section = document.getElementById(sectionId);
    if (section) section.classList.add('active');

    var tabMap = {
        'products': 'tabProducts',
        'deliveries': 'tabDeliveries',
        'reviews': 'tabReviews',
        'terms': 'tabTerms'
    };
    var tabId = tabMap[sectionId];
    if (tabId) {
        var tab = document.getElementById(tabId);
        if (tab) tab.classList.add('active');
    }

    var drawer = document.getElementById('mobileDrawer');
    if (drawer && drawer.classList.contains('active')) {
        toggleMobileMenu();
    }

    if (window.history && window.history.pushState) {
        var hashMap = {
            'products': '#/products',
            'deliveries': '#/deliveries',
            'reviews': '#/reviews',
            'terms': '#/terms'
        };
        if (hashMap[sectionId]) {
            history.pushState({ section: sectionId }, '', hashMap[sectionId]);
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToTop() {
    var productsSection = document.getElementById('products');
    if (productsSection && !productsSection.classList.contains('active')) {
        showSection('products');
    } else {
        if (window.history && window.history.pushState) {
            history.pushState({ section: 'products' }, '', '#/products');
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleFaq(element) {
    var item = element.parentElement;
    if (!item) return;
    var isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(function(faq) {
        faq.classList.remove('active');
    });

    if (!isActive) {
        item.classList.add('active');
    }
}

/* ====== STATUS BADGE STYLES (DYNAMIC) ====== */
// CSS classes for status badges are in style.css
// This section ensures JS adds correct classes

/* ====== SWIPE TO CLOSE IMAGE MODAL ====== */
(function() {
    var imageModal = document.getElementById('imageModal');
    if (!imageModal) return;
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
})();

/* ====== DRAWER ADMIN BUTTON SYNC ====== */
function syncDrawerAdminButton() {
    var drawerAdminBtn = document.getElementById('drawerAdminBtn');
    if (!drawerAdminBtn) return;
    if (isAdmin) {
        drawerAdminBtn.onclick = function() { showSection('admin'); toggleMobileMenu(); };
        drawerAdminBtn.innerHTML = '<i class="fas fa-cog"></i><span>لوحة التحكم</span>';
    } else {
        drawerAdminBtn.onclick = function() { openAdminLogin(); toggleMobileMenu(); };
        drawerAdminBtn.innerHTML = '<i class="fas fa-lock"></i><span>لوحة الأدمن</span>';
    }
}

/* ====== INIT DRAWER SYNC ====== */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(syncDrawerAdminButton, 100);
});

/* ====== SAFE LOCALSTORAGE CLEAR (ADMIN ONLY) ====== */
function clearAllData() {
    if (!isAdmin) { showToast('❌ محتاج تكون أدمن!', 'error'); return; }
    if (!confirm('⚠️ هتمسح كل البيانات من الجهاز دا! متأكد؟')) return;
    
    localStorage.removeItem('stackstore_products');
    localStorage.removeItem('stackstore_categories');
    localStorage.removeItem('stackstore_deliveries');
    localStorage.removeItem('stackstore_reviews');
    localStorage.removeItem('stackstore_testimonials');
    localStorage.removeItem('stackstore_review_images');
    
    products = JSON.parse(JSON.stringify(defaultProducts));
    categories = JSON.parse(JSON.stringify(defaultCategories));
    deliveries = [];
    reviews = [];
    testimonials = [];
    reviewImages = [];
    
    renderProducts();
    setupFilters();
    renderDeliveries();
    renderReviews();
    renderReviewImages();
    renderTestimonials();
    updateStats();
    
    showToast('🗑️ تم مسح كل البيانات المحلية!', 'success');
}

/* ====== FIX: ENSURE SECTIONS SHOW ON FIRST LOAD ====== */
(function() {
    // Handle initial hash route
    if (location.hash && location.hash !== '#/' && location.hash !== '') {
        handleHashRoute();
    } else {
        // Make sure products section is visible on first load
        var productsSection = document.getElementById('products');
        if (productsSection && !productsSection.classList.contains('active')) {
            document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
            productsSection.classList.add('active');
        }
        var tabProducts = document.getElementById('tabProducts');
        if (tabProducts && !tabProducts.classList.contains('active')) {
            document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
            tabProducts.classList.add('active');
        }
        if (window.history && window.history.replaceState) {
            history.replaceState({ section: 'products' }, '', '#/products');
        }
    }
})();

/* ====== NETWORK STATUS INDICATOR ====== */
window.addEventListener('online', function() {
    console.log('🌐 Back online');
    if (supabaseClient) backgroundSyncFromSupabase();
});
window.addEventListener('offline', function() {
    console.log('📴 Offline mode - using localStorage');
});

/* ====== PERFORMANCE: LAZY LOAD IMAGES ====== */
if ('IntersectionObserver' in window) {
    var imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            document.querySelectorAll('img[data-src]').forEach(function(img) {
                imageObserver.observe(img);
            });
        }, 500);
    });
}

/* ====== ERROR HANDLING WRAPPER ====== */
window.onerror = function(msg, url, line) {
    console.warn('⚠️ JS Error:', msg, 'at line', line);
    return true;
};

/* ====== CONSOLE WELCOME ====== */
console.log('%c🔥 Tamm Store', 'font-size:24px;font-weight:bold;color:#3b82f6;');
console.log('%cLocal-first | Supabase sync | Admin: STACK9', 'font-size:12px;color:#64748b;');

/* ====== FINAL SAFETY CHECKS & INIT ====== */

// Ensure all critical DOM elements exist before operations
function safeGet(id) {
    var el = document.getElementById(id);
    return el || null;
}

// Re-init on page visibility change (mobile back button fix)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && supabaseClient && !syncInProgress) {
        setTimeout(backgroundSyncFromSupabase, 1000);
    }
});

// Auto-save backup every 5 minutes (admin only)
setInterval(function() {
    if (isAdmin && products.length > 0) {
        try {
            localStorage.setItem('stackstore_auto_backup', JSON.stringify({
                products: products,
                categories: categories,
                deliveries: deliveries,
                reviews: reviews,
                testimonials: testimonials,
                timestamp: new Date().toISOString()
            }));
        } catch(e) {}
    }
}, 300000); // 5 minutes

// Preload critical images
window.addEventListener('load', function() {
    var preloadImages = ['logo.png', 'hero-banner.png'];
    preloadImages.forEach(function(src) {
        var img = new Image();
        img.src = src;
    });
});

// Fix: Ensure body scroll is restored if modal gets stuck
setInterval(function() {
    var anyModalOpen = document.querySelectorAll('.modal-overlay.active, .admin-login-overlay.active, .date-picker-overlay.active').length > 0;
    var drawerOpen = document.getElementById('mobileDrawer') && document.getElementById('mobileDrawer').classList.contains('active');
    if (!anyModalOpen && !drawerOpen && document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
    }
}, 2000);

// Version check
console.log('📦 Tamm Store v2.0 - All fixes applied');

/* ====== DRAG & DROP SORTING ====== */
function setupDragAndDrop(tableId, array, storageKey, skipFirst) {
    var table = document.getElementById(tableId);
    if (!table) return;
    var tbody = table.querySelector('tbody');
    if (!tbody) return;

    var draggedRow = null;
    var rows = tbody.querySelectorAll('tr');

    rows.forEach(function(row) {
        row.addEventListener('dragstart', function(e) {
            draggedRow = this;
            this.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
        });

        row.addEventListener('dragend', function() {
            this.style.opacity = '';
            draggedRow = null;
            updateSortOrder(tbody, array, storageKey, skipFirst);
        });

        row.addEventListener('dragover', function(e) {
            e.preventDefault();
            if (this === draggedRow) return;
            var rect = this.getBoundingClientRect();
            var midY = rect.top + rect.height / 2;
            if (e.clientY < midY) {
                tbody.insertBefore(draggedRow, this);
            } else {
                tbody.insertBefore(draggedRow, this.nextSibling);
            }
        });
    });
}

function updateSortOrder(tbody, array, storageKey, skipFirst) {
    var rows = tbody.querySelectorAll('tr');
    var offset = skipFirst ? 1 : 0;
    var newOrder = [];

    rows.forEach(function(row, index) {
        var id = row.getAttribute('data-id');
        var item = array.find(function(x) {
            return String(x.id) === String(id);
        });
        if (item) {
            item.sort_order = index + offset;
            newOrder.push(item);
        }
    });

    // Merge with items not in table (like "all" category)
    array.forEach(function(item) {
        var exists = newOrder.find(function(x) { return String(x.id) === String(item.id); });
        if (!exists) newOrder.push(item);
    });

    // Sort by sort_order
    newOrder.sort(function(a, b) { return a.sort_order - b.sort_order; });

    // Update the original array
    if (storageKey === 'stackstore_products') {
        products = newOrder;
    } else if (storageKey === 'stackstore_categories') {
        categories = newOrder;
    }

    // Save to localStorage
    try {
        localStorage.setItem(storageKey, JSON.stringify(newOrder));
    } catch(e) {}

    // Sync to Supabase
    if (supabaseClient && !window._supabaseTablesMissing) {
        var tableName = storageKey === 'stackstore_products' ? 'products' : 'categories';
        newOrder.forEach(function(item) {
            supabaseClient.from(tableName).update({ sort_order: item.sort_order }).eq('id', item.id).then(function(r) {
                if (r.error) console.warn('Sort sync failed for', item.id);
            });
        });
    }

    showToast('<i class="fas fa-check-circle"></i> تم تحديث الترتيب!', 'success');

    // Re-render affected sections
    if (storageKey === 'stackstore_products') {
        renderProducts();
    } else if (storageKey === 'stackstore_categories') {
        setupFilters();
        renderProducts();
    }
}

// ====== IMPORT FROM STACK STORE ======
function importFromStackStore() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(event) {
            try {
                var data = JSON.parse(event.target.result);
                var imported = 0;
                
                if (data.deliveries) {
                    var oldDeliveries = JSON.parse(data.deliveries);
                    var currentDeliveries = JSON.parse(localStorage.getItem('stackstore_deliveries') || '[]');
                    oldDeliveries.forEach(function(d) {
                        var exists = currentDeliveries.find(function(cd) { return cd.id === d.id; });
                        if (!exists) {
                            currentDeliveries.unshift(d);
                            imported++;
                        }
                    });
                    localStorage.setItem('stackstore_deliveries', JSON.stringify(currentDeliveries));
                    deliveries = currentDeliveries;
                }
                
                if (data.reviews) {
                    var oldReviews = JSON.parse(data.reviews);
                    var currentReviews = JSON.parse(localStorage.getItem('stackstore_review_images') || '[]');
                    oldReviews.forEach(function(r) {
                        var exists = currentReviews.find(function(cr) { return cr.id === r.id; });
                        if (!exists) {
                            currentReviews.unshift(r);
                            imported++;
                        }
                    });
                    localStorage.setItem('stackstore_review_images', JSON.stringify(currentReviews));
                    reviewImages = currentReviews;
                }
                
                renderDeliveries();
                renderReviewImages();
                updateStats();
                showToast('✅ تم استيراد ' + imported + ' عنصر من Stack Store! ريفرش الصفحة.', 'success');
            } catch(err) {
                showToast('❌ ملف غير صالح!', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Auto-add import button in admin settings
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (isAdmin) {
            var adminSection = document.getElementById('admin');
            if (adminSection) {
                var cards = adminSection.querySelectorAll('.card');
                var settingsCard = cards[cards.length - 1];
                if (settingsCard) {
                    var importBtn = document.createElement('button');
                    importBtn.className = 'btn btn-success';
                    importBtn.style.cssText = 'width:100%;justify-content:center;margin-top:10px;';
                    importBtn.innerHTML = '<span><i class="fas fa-file-import"></i></span><span>استيراد من Stack Store</span>';
                    importBtn.onclick = importFromStackStore;
                    var firstBtn = settingsCard.querySelector('button');
                    if (firstBtn) firstBtn.parentNode.insertBefore(importBtn, firstBtn.nextSibling);
                }
            }
        }
    }, 2500);
});

// ====== END OF APP.JS ======