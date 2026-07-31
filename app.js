
async function hashPassword(pwd) {
  const enc = new TextEncoder().encode(pwd);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function uploadToSupabaseStorage(file, folder) {
    if (!supabaseClient || !file) return null;
    try {
        var ext = file.name.split('.').pop() || 'jpg';
        if (ext.length > 5 || !/^[a-zA-Z0-9]+$/.test(ext)) ext = 'jpg';
        var fileName = Date.now() + '_' + Math.random().toString(36).substring(2, 10) + '.' + ext;
        var result = await supabaseClient.storage.from('products').upload(folder + '/' + fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'image/jpeg'
        });
        if (result.error) throw result.error;
        var urlResult = supabaseClient.storage.from('products').getPublicUrl(folder + '/' + fileName);
        return urlResult.data.publicUrl;
    } catch (e) {
        console.warn('❌ فشل رفع الصورة:', e.message);
        return null;
    }
}

// 🛡️ Obfuscated config loader
(function(){
var _0=window._0||{},_u=_0.a||'',_k=_0.b||'',_w=_0.c||'',_m=_0.d||'',_p=_0.e||'',_x=_0.f||'';
try{delete window._0;}catch(e){window._0=undefined;}
window._$=function(i){return[_u,_k,_w,_m,_p,_x][i]||''};
})();
var SUPABASE_URL=window._$(0),SUPABASE_ANON_KEY=window._$(1),WHATSAPP_NUMBER=window._$(2);

// 🏭 Default deliveries (pre-loaded)
var DEFAULT_DELIVERIES = [{"id":31,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784946192686_hu01pwv4.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784946193705_o4tvp61b.jpg","notes":"","created_at":"2026-07-25T02:23:14.357","delivery_date":null},{"id":30,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784946063499_gon4t3q7.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784946064077_vaay4wfn.jpg","notes":"","created_at":"2026-07-25T02:21:04.474","delivery_date":null},{"id":29,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784847535194_zg12ktcg.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784847535738_br00glct.jpg","notes":"","created_at":"2026-07-23T22:58:56.167","delivery_date":null},{"id":28,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784828143111_jb41pj48.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784828143668_v5vgoenh.jpg","notes":"","created_at":"2026-07-23T17:35:43.966","delivery_date":null},{"id":27,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684902626_gqjwps4d.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684903301_257liwaw.jpg","notes":"","created_at":"2026-07-22T01:48:24.565","delivery_date":null},{"id":25,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684762867_5sqokkwn.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684763838_5nxtmwkv.jpg","notes":"","created_at":"2026-07-22T01:46:04.982","delivery_date":null},{"id":24,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684743585_ukul2roh.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684744597_b0zma31l.jpg","notes":"","created_at":"2026-07-22T01:45:45.683","delivery_date":null},{"id":23,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684712120_ueae6jtn.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684713047_chl4x50w.jpg","notes":"","created_at":"2026-07-22T01:45:14.03","delivery_date":null},{"id":22,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684699476_x15arwaw.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684700259_itsxkkuo.jpg","notes":"","created_at":"2026-07-22T01:45:01.142","delivery_date":null},{"id":21,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684683217_1hxvug7w.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684684022_xtg124sd.jpg","notes":"","created_at":"2026-07-22T01:44:45.31","delivery_date":null},{"id":19,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684651407_kmqdo10c.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684652509_qpsaew88.jpg","notes":"","created_at":"2026-07-22T01:44:13.711","delivery_date":null},{"id":18,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684639660_msxs8d9z.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684640592_1q82bmdg.jpg","notes":"","created_at":"2026-07-22T01:44:01.733","delivery_date":null},{"id":17,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684623364_35tfmbp7.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684624305_yzeg80td.jpg","notes":"","created_at":"2026-07-22T01:43:45.329","delivery_date":null},{"id":16,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684610158_ez9tobx9.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684611230_lcnov4oj.jpg","notes":"","created_at":"2026-07-22T01:43:32.162","delivery_date":null},{"id":15,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684585396_g03enqk0.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684586447_2axkrtsb.jpg","notes":"","created_at":"2026-07-22T01:43:07.458","delivery_date":null},{"id":14,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684550445_viu3mb0s.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684551226_av3xh9a7.jpg","notes":"","created_at":"2026-07-22T01:42:32.192","delivery_date":null},{"id":13,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684525892_prapwf35.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684526827_y3hbiq6t.jpg","notes":"","created_at":"2026-07-22T01:42:08.049","delivery_date":null},{"id":12,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684506793_pztrricp.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684507549_m8efb8zx.jpg","notes":"","created_at":"2026-07-22T01:41:49.087","delivery_date":null},{"id":11,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684491015_rvwxrcsm.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684491865_yt1t3gr4.jpg","notes":"","created_at":"2026-07-22T01:41:32.813","delivery_date":null},{"id":10,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684468495_t49xi1fa.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684469971_d7oyf7gt.jpg","notes":"","created_at":"2026-07-22T01:41:10.992","delivery_date":null},{"id":9,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684449984_q2u85pzk.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684450843_fxtukyn2.jpg","notes":"","created_at":"2026-07-22T01:40:52.031","delivery_date":null},{"id":8,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684432602_te919erj.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684433809_gwzeqbpl.jpg","notes":"","created_at":"2026-07-22T01:40:34.769","delivery_date":null},{"id":7,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684399679_vj0jnh5p.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684400418_ls4vn3fm.jpg","notes":"","created_at":"2026-07-22T01:40:01.371","delivery_date":null},{"id":6,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684378863_k6ere7wo.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684379595_0o8nzhym.jpg","notes":"","created_at":"2026-07-22T01:39:40.57","delivery_date":null},{"id":5,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684359401_6uffc5ku.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684360450_4ljjwpsp.jpg","notes":"","created_at":"2026-07-22T01:39:21.578","delivery_date":null},{"id":4,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684342990_48n4kb0p.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684344273_hj4qmtuc.jpg","notes":"","created_at":"2026-07-22T01:39:05.365","delivery_date":null},{"id":3,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684324105_cve4qswo.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684324987_jwbyukg7.jpg","notes":"","created_at":"2026-07-22T01:38:46.039","delivery_date":null},{"id":2,"payment_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/payments/1784684295433_b3pmb6al.jpg","delivery_image":"https://vakfdtxobojpvkiiscdx.supabase.co/storage/v1/object/public/stackstore/deliveries/1784684296831_yohyzfis.jpg","notes":"","created_at":"2026-07-22T01:38:17.707","delivery_date":null}];

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

function mergeWithLocal(localArray, remoteArray, idField) {
    idField = idField || 'id';
    if (!Array.isArray(remoteArray) || remoteArray.length === 0) return localArray || [];
    var result = (localArray || []).slice();
    var existingIds = new Set(result.map(function(x) { return x[idField]; }));
    remoteArray.forEach(function(item) {
        if (item && item[idField] !== undefined && !existingIds.has(item[idField])) {
            result.push(item);
            existingIds.add(item[idField]);
        }
    });
    result.sort(function(a, b) {
        var dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        var dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
    });
    return result;
}

function showSkeleton(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<div class="products-skeleton">' +
        '<div class="skeleton-card"><div class="img skeleton"></div><div class="title skeleton"></div><div class="price skeleton"></div></div>' +
        '<div class="skeleton-card"><div class="img skeleton"></div><div class="title skeleton"></div><div class="price skeleton"></div></div>' +
        '<div class="skeleton-card"><div class="img skeleton"></div><div class="title skeleton"></div><div class="price skeleton"></div></div>' +
        '</div>';
}

async function initProducts() {
    var container = document.getElementById('productsGrid');
    if (container) {
        container.innerHTML = '<div class="products-skeleton">' +
            '<div class="skeleton-card"><div class="img skeleton"></div><div class="title skeleton"></div><div class="price skeleton"></div></div>' +
            '<div class="skeleton-card"><div class="img skeleton"></div><div class="title skeleton"></div><div class="price skeleton"></div></div>' +
            '<div class="skeleton-card"><div class="img skeleton"></div><div class="title skeleton"></div><div class="price skeleton"></div></div>' +
            '<div class="skeleton-card"><div class="img skeleton"></div><div class="title skeleton"></div><div class="price skeleton"></div></div>' +
            '</div>';
    }

    var loadedFromSupabase = false;

    if (supabaseClient) {
        try {
            var { data: prodData, error: prodError } = await supabaseClient
                .from('products').select('*').order('sort_order', { ascending: true });
            if (prodError) {
                console.error('❌ Supabase products error:', prodError);
            } else {
                products = prodData || [];
                // 🔄 Preserve local sort_order after Supabase fetch
                var localProds = localStorage.getItem('stackstore_products');
                if (localProds) {
                    try {
                        var localData = JSON.parse(localProds);
                        var sortMap = {};
                        localData.forEach(function(lp) {
                            if (typeof lp.sort_order === 'number') sortMap[lp.id] = lp.sort_order;
                        });
                        products.forEach(function(p) {
                            if (sortMap[p.id] !== undefined) p.sort_order = sortMap[p.id];
                        });
                    } catch(e) {}
                }
                var cleanProducts = products.map(function(p) {
                    var c = Object.assign({}, p);
                    if (c.image && typeof c.image === 'string' && c.image.startsWith('data:')) c.image = '';
                    if (c.detail_image && typeof c.detail_image === 'string' && c.detail_image.startsWith('data:')) c.detail_image = '';
                    return c;
                });
                try {
                    localStorage.setItem('stackstore_products', JSON.stringify(cleanProducts));
                } catch (e) {
                    console.warn('⚠️ localStorage full, clearing old data...');
                    localStorage.clear();
                    localStorage.setItem('stackstore_products', JSON.stringify(cleanProducts));
                }
                loadedFromSupabase = true;
                console.log('✅ Products from Supabase:', products.length);
            }
            var { data: catData, error: catError } = await supabaseClient
                .from('categories').select('*').order('sort_order', { ascending: true });
            if (catError) {
                console.error('❌ Supabase categories error:', catError);
            } else {
                categories = catData || [];
                // 🔄 Preserve local category sort_order after Supabase fetch
                var localCats = localStorage.getItem('stackstore_categories');
                if (localCats) {
                    try {
                        var localCatData = JSON.parse(localCats);
                        var catSortMap = {};
                        localCatData.forEach(function(lc) {
                            if (typeof lc.sort_order === 'number') catSortMap[lc.id] = lc.sort_order;
                        });
                        categories.forEach(function(c) {
                            if (catSortMap[c.id] !== undefined) c.sort_order = catSortMap[c.id];
                        });
                    } catch(e) {}
                }
                if (!categories.find(function(c){ return c.id === 'all'; })) {
                    categories.unshift({ id: 'all', name: 'الكل', icon: '📦', sort_order: 0 });
                }
                localStorage.setItem('stackstore_categories', JSON.stringify(categories));
                console.log('✅ Categories from Supabase:', categories.length);
            }
        } catch (e) { console.warn('Supabase fetch failed:', e.message); }
    }

    if (!loadedFromSupabase) {
        var cp = localStorage.getItem('stackstore_products');
        if (cp) try { products = JSON.parse(cp); } catch(e){ products = []; }
        var cc = localStorage.getItem('stackstore_categories');
        if (cc) try { categories = JSON.parse(cc); } catch(e){ categories = []; }
    }

    if (!Array.isArray(products)) products = [];
    if (!Array.isArray(categories) || categories.length === 0) {
        categories = [{ id: 'all', name: 'الكل', icon: '📦', sort_order: 0 }];
    }

    products.forEach(function(p,i){ if(typeof p.sort_order !== 'number') p.sort_order = i; });
    products.sort(function(a,b){ return a.sort_order - b.sort_order; });
    categories.forEach(function(c,i){ if(typeof c.sort_order !== 'number') c.sort_order = i; });
    categories.sort(function(a,b){ return a.sort_order - b.sort_order; });

    renderProducts(); setupFilters(); updateStats();
}

async function checkSupabaseWriteAccess() {
    if (!supabaseClient) { showToast('❌ Supabase مش متصل', 'error'); return; }
    try {
        var test = await supabaseClient.from('products').insert([{ name: '__test__', category: 'other', status: 'available', prices: [], created_at: new Date().toISOString() }]).select();
        if (test.error) throw test.error;
        await supabaseClient.from('products').delete().eq('name', '__test__');
        showToast('✅ Supabase شغال ومفتوح للكتابة!', 'success');
    } catch (err) {
        showToast('❌ مشكلة في الكتابة: ' + err.message, 'error');
        console.error('RLS/Write error:', err);
    }
}

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

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
    showSection('products');
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Tamm Hybrid initializing...');
    isAdmin = localStorage.getItem(window._$(5)) === 'true';
    initSupabase();
    setupEventListeners();
    checkAdminStatus();
    await initProducts();
    showSkeleton('deliveriesList');
    showSkeleton('reviewsList');
    await loadDynamicData();
    console.log('✅ Tamm Hybrid ready!');
    // 🛡️ Security: Hide config from window after initialization
    try {
        if (window.CONFIG) {
            Object.freeze(window.CONFIG);
            var _cfg = window.CONFIG;
            delete window.CONFIG;
            (function(){ return _cfg; })();
        }
    } catch(e) {}

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

async function loadDynamicData() {
    isLoading = true;
    var tablesMissing = false;

    if (supabaseClient) {
        try {
            console.log('🔄 Fetching dynamic data from Supabase...');

            var { data: delData, error: delError } = await supabaseClient
                .from('deliveries')
                .select('*')
                .order('created_at', { ascending: false });

            if (delError) {
                if (delError.code === 'PGRST205') tablesMissing = true;
                else console.error('❌ deliveries error:', delError.message);
            } else if (Array.isArray(delData) && delData.length > 0) {
                deliveries = mergeWithLocal(deliveries, delData);
                console.log('✅ Loaded', delData.length, 'new deliveries from Supabase. Total:', deliveries.length);
            }

            var { data: revData, error: revError } = await supabaseClient
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (revError) console.error('❌ reviews error:', revError.message);
            else if (Array.isArray(revData) && revData.length > 0) {
                reviews = mergeWithLocal(reviews, revData);
            }

            var { data: testData, error: testError } = await supabaseClient
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (testError) console.error('❌ testimonials error:', testError.message);
            else if (Array.isArray(testData) && testData.length > 0) {
                testimonials = mergeWithLocal(testimonials, testData);
            }

        } catch (err) {
            console.warn('⚠️ Supabase dynamic fetch failed:', err.message);
        }
    }

    window._supabaseTablesMissing = tablesMissing;

    var cachedDeliveries = localStorage.getItem('stackstore_deliveries');
    var cachedReviews = localStorage.getItem('stackstore_reviews');
    var cachedTestimonials = localStorage.getItem('stackstore_testimonials');
    var cachedReviewImages = localStorage.getItem('stackstore_review_images');

    if (cachedDeliveries && deliveries.length === 0) {
        try { deliveries = JSON.parse(cachedDeliveries); } catch(e) { deliveries = []; }
    }
    if (cachedReviews && reviews.length === 0) {
        try { reviews = JSON.parse(cachedReviews); } catch(e) { reviews = []; }
    }
    if (cachedTestimonials && testimonials.length === 0) {
        try { testimonials = JSON.parse(cachedTestimonials); } catch(e) { testimonials = []; }
    }
    if (cachedReviewImages) {
        try { reviewImages = JSON.parse(cachedReviewImages); } catch(e) { reviewImages = []; }
    }

    // 🏭 Inject default deliveries if none exist
    if (deliveries.length === 0 && typeof DEFAULT_DELIVERIES !== 'undefined' && DEFAULT_DELIVERIES.length > 0) {
        deliveries = DEFAULT_DELIVERIES.slice();
        try {
            localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
            console.log('✅ Loaded', deliveries.length, 'default deliveries');
        } catch(e) {}
    }

    try {
        localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
        localStorage.setItem('stackstore_reviews', JSON.stringify(reviews));
        localStorage.setItem('stackstore_testimonials', JSON.stringify(testimonials));
        localStorage.setItem('stackstore_review_images', JSON.stringify(reviewImages));
    } catch(e) {}

    isLoading = false;
    renderDeliveries();
    renderReviews();
    renderTestimonials();
    updateStats();
}

async function backgroundSyncFromSupabase() {
    if (!supabaseClient) { console.log('❌ Supabase مش متاح'); return; }
    if (window._supabaseTablesMissing) {
        console.log('⚠️ جداول Supabase ناقصة! شغل SQL script الأول');
        return;
    }

    syncInProgress = true;
    console.log('🔄 جاري المزامنة مع السحابة...');

    try {
        var { data: delData, error: delError } = await supabaseClient
            .from('deliveries').select('*').order('created_at', { ascending: false });
        if (delError) throw delError;
        if (Array.isArray(delData) && delData.length > 0) {
            deliveries = mergeWithLocal(deliveries, delData);
            localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
            renderDeliveries(); updateStats();
        }

        var { data: revData, error: revError } = await supabaseClient
            .from('reviews').select('*').order('created_at', { ascending: false });
        if (revError) throw revError;
        if (Array.isArray(revData) && revData.length > 0) {
            reviews = mergeWithLocal(reviews, revData);
            localStorage.setItem('stackstore_reviews', JSON.stringify(reviews));
            renderReviews(); updateStats();
        }

        var { data: testData, error: testError } = await supabaseClient
            .from('testimonials').select('*').order('created_at', { ascending: false });
        if (testError) throw testError;
        if (Array.isArray(testData) && testData.length > 0) {
            testimonials = mergeWithLocal(testimonials, testData);
            localStorage.setItem('stackstore_testimonials', JSON.stringify(testimonials));
            renderTestimonials();
        }

        console.log('✅ تم المزامنة بنجاح!');
    } catch (err) {
        console.warn('⏱️ Background sync failed:', err.message);
        console.log('❌ فشل المزامنة:', err.message);
    } finally {
        syncInProgress = false;
    }
}

async function syncToSupabase(table, record) {
    if (!supabaseClient) return null;
    try {
        var cleanRecord = Object.assign({}, record);
        delete cleanRecord.date;

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
    if (!supabaseClient) { console.log('❌ Supabase مش متاح حالياً'); return; }
    console.log('🔄 جاري المزامنة مع السحابة...');
    await backgroundSyncFromSupabase();
    console.log('✅ تم المزامنة بنجاح!');
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

async function transferImage(imageUrl, folder) {
    if (!supabaseClient || !imageUrl) return null;
    try {
        if (!imageUrl.includes('supabase.co')) return imageUrl;

        console.log('🔄 جاري نقل صورة:', imageUrl.split('/').pop());

        var response = await fetch(imageUrl);
        if (!response.ok) throw new Error('فشل تحميل الصورة');

        var blob = await response.blob();
        var ext = imageUrl.split('.').pop().split('?')[0] || 'jpg';
        if (ext.length > 5 || !/^[a-zA-Z0-9]+$/.test(ext)) ext = 'jpg';

        var fileName = Date.now() + '_' + Math.random().toString(36).substring(2, 10) + '.' + ext;
        var file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });

        var result = await supabaseClient.storage.from('products').upload(folder + '/' + fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
        });

        if (result.error) throw result.error;

        var urlResult = supabaseClient.storage.from('products').getPublicUrl(folder + '/' + fileName);
        console.log('✅ تم نقل الصورة:', urlResult.data.publicUrl);
        return urlResult.data.publicUrl;

    } catch (e) {
        console.warn('⚠️ فشل نقل الصورة، هنستخدم القديمة:', e.message);
        return imageUrl;
    }
}

async function importData(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = async function(e) {
        try {
            var data = JSON.parse(e.target.result);
            var importedD = 0, importedR = 0;
            var uploadedImages = 0;

            if (data.deliveries && Array.isArray(data.deliveries) && data.deliveries.length > 0) {
                console.log('📦 جاري استيراد ' + data.deliveries.length + ' تسليم...');

                for (var i = 0; i < data.deliveries.length; i++) {
                    var d = data.deliveries[i];

                    var exists = deliveries.find(function(x) { 
                        return x.id === d.id || (x.created_at && x.created_at === d.created_at); 
                    });
                    if (exists) {
                        console.log('⏭️ تسليم #' + (i+1) + ' موجود بالفعل');
                        continue;
                    }

                    showToast('⬆️ جاري نقل تسليم ' + (i+1) + '/' + data.deliveries.length + '...', 'info');

                    if (d.payment_image) {
                        var newPayment = await transferImage(d.payment_image, 'payments');
                        if (newPayment !== d.payment_image) uploadedImages++;
                        d.payment_image = newPayment;
                    }

                    if (d.delivery_image) {
                        var newDelivery = await transferImage(d.delivery_image, 'deliveries');
                        if (newDelivery !== d.delivery_image) uploadedImages++;
                        d.delivery_image = newDelivery;
                    }

                    if (supabaseClient) {
                        var clean = Object.assign({}, d);
                        delete clean.id;
                        delete clean.date;

                        var res = await supabaseClient.from('deliveries').insert([clean]).select();
                        if (!res.error && res.data && res.data[0]) {
                            d.id = res.data[0].id;
                            console.log('✅ تسليم #' + (i+1) + ' اتحفظ في Supabase');
                        } else if (res.error) {
                            console.warn('⚠️ فشل حفظ تسليم #' + (i+1) + ' في Supabase:', res.error.message);
                        }
                    }

                    deliveries.unshift(d);
                    importedD++;
                }

                localStorage.setItem('stackstore_deliveries', JSON.stringify(deliveries));
            }

            if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
                console.log('⭐ جاري استيراد ' + data.reviews.length + ' صورة رأي...');

                for (var j = 0; j < data.reviews.length; j++) {
                    var r = data.reviews[j];

                    var existsR = reviewImages.find(function(x) { return x.id === r.id; });
                    if (existsR) continue;

                    if (r.image) {
                        var newImg = await transferImage(r.image, 'reviews');
                        if (newImg !== r.image) uploadedImages++;
                        r.image = newImg;
                    }

                    if (supabaseClient) {
                        var cleanR = Object.assign({}, r);
                        delete cleanR.id;
                        delete cleanR.date;

                        var resR = await supabaseClient.from('reviews').insert([cleanR]).select();
                        if (!resR.error && resR.data && resR.data[0]) {
                            r.id = resR.data[0].id;
                        }
                    }

                    reviewImages.unshift(r);
                    importedR++;
                }

                localStorage.setItem('stackstore_review_images', JSON.stringify(reviewImages));
            }

            renderDeliveries();
            renderReviewImages();
            updateStats();

            showToast(
                '✅ تم الاستيراد! ' + importedD + ' تسليم و ' + importedR + ' صورة رأي. ' +
                '(' + uploadedImages + ' صورة رُفعت على السيرفر الجديد)',
                'success'
            );

            console.log('🎉 انتهى الاستيراد:', importedD, 'تسليم |', importedR, 'رأي |', uploadedImages, 'صورة مرفوعة');

        } catch (err) { 
            console.error('❌ خطأ في الاستيراد:', err);
            showToast('❌ ملف غير صالح أو حصل خطأ!', 'error'); 
        }
    };
    reader.readAsText(file);
    input.value = '';
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
    if (btnAdminLogin) btnAdminLogin.addEventListener('click', loginAdmin);

    var adminPasswordInput = document.getElementById('adminPassword');
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') loginAdmin(); });
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

    var durationsHtml = '';
    var priceDisplayHtml = '';

    selectedDurationIdx = 0;
    selectedType = 'shared';

    if (p.prices && p.prices.length > 0) {
        var bestOption = null;
        var bestPrice = Infinity;

        p.prices.forEach(function(pr, idx) {
            var shared = pr.shared_price || pr.price || 0;
            var priv = pr.private_price || pr.price || 0;

            if (shared > 0 && shared < bestPrice) {
                bestPrice = shared;
                bestOption = { idx: idx, type: 'shared', price: shared, duration: pr.duration };
            }
            if (priv > 0 && priv < bestPrice) {
                bestPrice = priv;
                bestOption = { idx: idx, type: 'private', price: priv, duration: pr.duration };
            }
        });

        if (!bestOption) {
            bestOption = { idx: 0, type: 'shared', price: 0, duration: p.prices[0].duration };
        }

        selectedDurationIdx = bestOption.idx;
        selectedType = bestOption.type;

        var pills = '<div class="duration-pills" id="durationPills">';
        p.prices.forEach(function(pr, idx) {
            var activeClass = idx === selectedDurationIdx ? ' active' : '';
            pills += '<button class="duration-pill' + activeClass + '" data-idx="' + idx + '" onclick="selectDuration(' + idx + ')">' + escapeHtml(pr.duration) + '</button>';
        });
        pills += '</div>';

        var sharedActive = selectedType === 'shared' ? ' active' : '';
        var privateActive = selectedType === 'private' ? ' active' : '';

        var toggle = '<div class="type-toggle">' +
            '<button class="type-btn' + sharedActive + '" data-type="shared" onclick="selectType(' + "'" + 'shared' + "'" + ')">' +
            '<span><i class="fas fa-users"></i></span>' +
            '<span>مشترك</span>' +
            '</button>' +
            '<button class="type-btn' + privateActive + '" data-type="private" onclick="selectType(' + "'" + 'private' + "'" + ')">' +
            '<span><i class="fas fa-user-shield"></i></span>' +
            '<span>خاص</span>' +
            '</button>' +
            '</div>';

        var selectedPrice = p.prices[selectedDurationIdx];
        var displayPrice = selectedType === 'shared' 
            ? (selectedPrice.shared_price || selectedPrice.price || 0) 
            : (selectedPrice.private_price || selectedPrice.price || 0);
        var originalPrice = selectedPrice.originalPrice || selectedPrice.original_price || 0;
        var discount = originalPrice && displayPrice > 0 ? Math.round((1 - displayPrice / originalPrice) * 100) : 0;

        var typeLabel = selectedType === 'shared' 
            ? '<i class="fas fa-users"></i> اشتراك مشترك' 
            : '<i class="fas fa-user-shield"></i> اشتراك خاص';

        priceDisplayHtml = '<div class="price-display-card" id="priceDisplayCard">' +
            (discount > 0 ? '<div class="price-discount-badge">وفر ' + discount + '%</div>' : '') +
            '<div class="price-main-row">' +
            '<div class="price-type-label" id="priceTypeLabel">' + typeLabel + '</div>' +
            '<div class="price-value-row">' +
            '<span class="price-current" id="priceCurrent">' + displayPrice + '</span>' +
            '<span class="price-currency">ج.م</span>' +
            '</div>' +
            (originalPrice ? '<div class="price-original-row"><span class="price-original-line" id="priceOriginal">' + originalPrice + ' ج.م</span></div>' : '') +
            '</div>' +
            '<div class="price-duration-label" id="priceDurationLabel">' + escapeHtml(selectedPrice.duration) + '</div>' +
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

var selectedDurationIdx = 0;
var selectedType = 'shared';

function selectDuration(idx) {
    if (!currentProduct || !currentProduct.prices[idx]) return;
    var pr = currentProduct.prices[idx];
    var hasPrice = selectedType === 'shared' ? (pr.shared_price || pr.price) : (pr.private_price || pr.price);
    if (!hasPrice) return;

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
    if (currentProduct && currentProduct.prices[selectedDurationIdx]) {
        var pr = currentProduct.prices[selectedDurationIdx];
        var hasPrice = type === 'shared' ? (pr.shared_price || pr.price) : (pr.private_price || pr.price);
        if (!hasPrice) {
            var found = false;
            for (var i = 0; i < currentProduct.prices.length; i++) {
                var checkPr = currentProduct.prices[i];
                var checkHas = type === 'shared' ? (checkPr.shared_price || checkPr.price) : (checkPr.private_price || checkPr.price);
                if (checkHas) {
                    selectedDurationIdx = i;
                    document.querySelectorAll('.duration-pill').forEach(function(btn, bi) {
                        if (bi === i) btn.classList.add('active');
                        else btn.classList.remove('active');
                    });
                    found = true;
                    break;
                }
            }
            if (!found) {
                showToast('<i class="fas fa-circle-info"></i> هذا النوع غير متوفر في أي مدة', 'info');
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
    var discount = original && hasPrice && price > 0 ? Math.round((1 - price / original) * 100) : 0;

    var priceCurrent = document.getElementById('priceCurrent');
    var priceOriginal = document.getElementById('priceOriginal');
    var priceTypeLabel = document.getElementById('priceTypeLabel');
    var priceDurationLabel = document.getElementById('priceDurationLabel');
    var priceDisplayCard = document.getElementById('priceDisplayCard');
    var orderBtn = document.querySelector('#productDetail .order-btn');

    if (!hasPrice || price <= 0) {
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

    if (!price || price <= 0) {
        showToast('<i class="fas fa-circle-xmark"></i> السعر غير متوفر لهذا النوع/المدة!', 'error');
        return;
    }

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

function stripBase64FromProducts(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(function(p) {
        var copy = Object.assign({}, p);
        if (copy.image && typeof copy.image === 'string' && copy.image.startsWith('data:')) copy.image = '';
        if (copy.detail_image && typeof copy.detail_image === 'string' && copy.detail_image.startsWith('data:')) copy.detail_image = '';
        return copy;
    });
}

function safeSaveProducts() {
    var clean = stripBase64FromProducts(products);
    var json = JSON.stringify(clean);
    try {
        localStorage.setItem('stackstore_products', json);
        return true;
    } catch (e) {
        console.warn('⚠️ localStorage full! Cleaning all old data...');
        try {
            localStorage.removeItem('stackstore_deliveries');
            localStorage.removeItem('stackstore_reviews');
            localStorage.removeItem('stackstore_testimonials');
            localStorage.removeItem('stackstore_review_images');
            localStorage.setItem('stackstore_products', json);
            return true;
        } catch (e2) {
            console.error('❌ Still full, trying clear all...');
            try {
                localStorage.clear();
                localStorage.setItem('stackstore_products', json);
                return true;
            } catch (e3) {
                return false;
            }
        }
    }
}

async function saveProduct() {
    var btn = document.getElementById('btnSaveProduct');
    var originalBtnHtml = btn ? btn.innerHTML : '';

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i></span><span>جاري الحفظ...</span>';
        }

        var prodName = document.getElementById('prodName');
        var prodDesc = document.getElementById('prodDesc');
        var prodImageUrl = document.getElementById('prodImageUrl');
        var prodCategory = document.getElementById('prodCategory');
        var prodStatus = document.getElementById('prodStatus');

        var name = prodName ? prodName.value.trim() : '';
        var desc = prodDesc ? prodDesc.value.trim() : '';
        var category = prodCategory ? prodCategory.value : 'other';
        var status = prodStatus ? prodStatus.value : 'available';

        if (!name) { showToast('<i class="fas fa-circle-xmark"></i> أدخل اسم المنتج!', 'error'); return; }

        var image = prodImageUrl ? prodImageUrl.value.trim() : '';
        var imageFile = document.getElementById('productImageFile').files[0];

        if (imageFile && supabaseClient && window.supabase) {
                try {
                showToast('<i class="fas fa-cloud-arrow-up"></i> جاري رفع الصورة...', 'info');
                var uploadedUrl = await uploadToSupabaseStorage(imageFile, 'products');
                if (uploadedUrl) image = uploadedUrl;
            } catch (e) {
                console.warn('❌ فشل رفع الصورة:', e);
                image = '';
            }
        } else if (imageFile && !supabaseClient) {
            image = '';
            showToast('<i class="fas fa-triangle-exclamation"></i> لا يوجد اتصال بالسحابة - الصورة لن تُحفظ', 'warning');
        }

        var detailImage = '';
        var prodDetailImageUrl = document.getElementById('prodDetailImageUrl');
        if (prodDetailImageUrl) detailImage = prodDetailImageUrl.value.trim();

        var detailFile = document.getElementById('productDetailImageFile').files[0];
        if (detailFile && supabaseClient) {
            try {
                var uploadedDetail = await uploadToSupabaseStorage(detailFile, 'products');
                if (uploadedDetail) detailImage = uploadedDetail;
            } catch (e) {
                detailImage = '';
            }
        } else if (detailFile && !supabaseClient) {
            detailImage = '';
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

        var isNew = false;
        var localId;

        if (editingProductId) {
            var idx = products.findIndex(function(p) { return p.id === editingProductId; });
            if (idx !== -1) {
                productData.id = editingProductId;
                productData.created_at = products[idx].created_at;
                productData.sort_order = products[idx].sort_order;
                products[idx] = productData;
                localId = editingProductId;
            }
        } else {
            isNew = true;
            localId = Date.now();
            while (products.find(function(p) { return p.id === localId; })) {
                localId = Date.now() + Math.floor(Math.random() * 1000);
            }
            productData.id = localId;
            productData.sort_order = products.length;
            products.unshift(productData);
        }

        safeSaveProducts();

        renderProducts();
        renderAdminProducts();
        updateStats();
        closeProductModal();

        if (prodName) prodName.value = '';
        if (prodDesc) prodDesc.value = '';
        if (prodImageUrl) prodImageUrl.value = '';
        if (prodDetailImageUrl) prodDetailImageUrl.value = '';
        var pricesContainer = document.getElementById('pricesContainer');
        if (pricesContainer) {
            pricesContainer.innerHTML = '';
            addPriceRow();
        }
        removeImage('productImageFile', 'productImagePreview', 'productImageUpload', 'productImageRemove');
        removeImage('productDetailImageFile', 'productDetailImagePreview', 'productDetailImageUpload', 'productDetailImageRemove');
        editingProductId = null;

        showToast('<i class="fas fa-check-circle"></i> تم حفظ المنتج بنجاح!', 'success');

        if (supabaseClient) {
            try {
                var syncData = Object.assign({}, productData);
                if (isNew) delete syncData.id;

                var result;
                if (editingProductId) {
                    result = await supabaseClient.from('products').update(syncData).eq('id', editingProductId);
                } else {
                    result = await supabaseClient.from('products').insert([syncData]).select();
                }

                if (result.error) throw result.error;

                if (isNew && result.data && result.data[0]) {
                    var supaId = result.data[0].id;
                    var pidx = products.findIndex(function(p) { return p.id === localId; });
                    if (pidx !== -1) {
                        products[pidx].id = supaId;
                        safeSaveProducts();
                    }
                }
                showToast('<i class="fas fa-cloud"></i> تم المزامنة مع السحابة!', 'success');
            } catch (err) {
                console.error('❌ Supabase sync failed:', err);
                showToast('<i class="fas fa-triangle-exclamation"></i> فشلت المزامنة: ' + err.message, 'error');
            }
        }

    } catch (err) {
        console.error('❌ Error in saveProduct:', err);
        showToast('<i class="fas fa-circle-xmark"></i> حصل خطأ: ' + err.message, 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalBtnHtml || '<span><i class="fas fa-floppy-disk"></i></span><span>حفظ المنتج</span>';
        }
    }
}

async function deleteProduct(id) {
    if (!confirm('متأكد إنك عاوز تمسح المنتج دا؟')) return;

    products = products.filter(function(p) { return p.id !== id; });
    localStorage.setItem('stackstore_products', JSON.stringify(products));
    renderProducts();
    renderAdminProducts();
    updateStats();
    showToast('<i class="fas fa-trash"></i> تم مسح المنتج!', 'success');

    if (supabaseClient) {
        try {
            var result = await supabaseClient.from('products').delete().eq('id', id);
            if (result.error) throw result.error;
            console.log('✅ Product deleted from Supabase');
            showToast('<i class="fas fa-cloud"></i> تم المزامنة مع السحابة!', 'success');
        } catch (err) {
            console.error('❌ Failed to delete product from Supabase:', err);
            showToast('<i class="fas fa-triangle-exclamation"></i> فشلت المزامنة: ' + err.message, 'error');
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

    var newId;
    if (isEdit) {
        var idx = categories.findIndex(function(c) { return c.id === catId; });
        if (idx !== -1) {
            categories[idx].name = newName;
            categories[idx].icon = newIcon;
            newId = catId;
        }
    } else {
        newId = 'cat_' + Date.now();
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
            var result;
            if (isEdit) {
                result = await supabaseClient.from('categories').update({ name: newName, icon: newIcon }).eq('id', catId);
            } else {
                result = await supabaseClient.from('categories').insert([{ id: newId, name: newName, icon: newIcon, sort_order: categories.length - 1 }]);
            }
            if (result.error) throw result.error;
            console.log('✅ Category synced to Supabase');
            showToast('<i class="fas fa-cloud"></i> تم المزامنة مع السحابة!', 'success');
        } catch (err) {
            console.error('❌ Failed to sync category to Supabase:', err);
            showToast('<i class="fas fa-triangle-exclamation"></i> فشلت المزامنة: ' + err.message, 'error');
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
    } else {
        if (!confirm('متأكد إنك عاوز تمسح القسم "' + getCategoryName(catId) + '"؟')) return;
    }

    categories = categories.filter(function(c) { return c.id !== catId; });

    try {
        localStorage.setItem('stackstore_categories', JSON.stringify(categories));
        localStorage.setItem('stackstore_products', JSON.stringify(products));
    } catch (e) {
        console.warn('localStorage full:', e);
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

    if (supabaseClient) {
        try {
            var result = await supabaseClient.from('categories').delete().eq('id', catId);
            if (result.error) throw result.error;
            var result2 = await supabaseClient.from('products').update({ category: 'other' }).eq('category', catId);
            if (result2.error) throw result2.error;
            console.log('✅ Category deleted from Supabase');
            showToast('<i class="fas fa-cloud"></i> تم المزامنة مع السحابة!', 'success');
        } catch (err) {
            console.error('❌ Failed to delete category from Supabase:', err);
            showToast('<i class="fas fa-triangle-exclamation"></i> فشلت المزامنة: ' + err.message, 'error');
        }
    }
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
    if (!reviewImages || reviewImages.length === 0) return;
    var container = document.getElementById('reviewImagesContainer');
    if (!container) return;
    if (isLoading) return;
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
            console.log('✅ تم حفظ صورة الرأي في السحابة!');
        } else {
            closeTestimonialModal();
            console.log('⚠️ تم الحفظ محلياً فقط - Supabase غير متاح');
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

function renderAdminSection() {
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
    var tabAdmin = document.getElementById('tabAdmin');
    if (tabAdmin) tabAdmin.classList.add('active');

    var adminSection = document.getElementById('admin');
    if (!adminSection) return;

    var statusHtml = '';
    if (window._supabaseTablesMissing) {
        statusHtml = '<div class="card" style="border-color:var(--danger);background:rgba(239,68,68,0.1);">' +
            '<div class="card-title" style="color:var(--danger);"><i class="fas fa-triangle-exclamation"></i> تنبيه: جداول Supabase ناقصة!</div>' +
            '<p style="margin-bottom:15px;">التسليمات والآراء مش هتتحفظ في السحابة لحد ما تنشئ الجداول. شغل SQL script في Supabase SQL Editor.</p>' +
            '<button class="btn btn-primary" onclick="migrateAllToSupabase()" style="width:100%;justify-content:center;">' +
            '<span><i class="fas fa-cloud-arrow-up"></i></span><span>نقل البيانات المحلية للسحابة</span>' +
            '</button></div>';
    } else {
        statusHtml = '<div class="card" style="border-color:var(--success);background:rgba(34,197,94,0.08);">' +
            '<div class="card-title" style="color:var(--success);"><i class="fas fa-check-circle"></i> Supabase متصل</div>' +
            '<p>البيانات الديناميكية بتتزامن مع السحابة.</p>' +
            '<button class="btn btn-primary" onclick="backgroundSyncFromSupabase()" style="width:100%;justify-content:center;">' +
            '<span><i class="fas fa-rotate"></i></span><span>مزامنة يدوية</span>' +
            '</button></div>';
    }

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
    if (!confirm('متأكد إنك عاوز تسجل خروج؟ هتحتاج تدخل البيانات تاني.')) return;
    isAdmin = false;
    localStorage.removeItem(window._$(5));
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
    var emailInput = document.getElementById('adminEmail');
    if (emailInput) { emailInput.value = ''; emailInput.focus(); }
    var passInput = document.getElementById('adminPassword');
    if (passInput) passInput.value = '';
}

async function loginAdmin() {
  const email = document.getElementById('adminEmail')?.value.trim();
  const pwd = document.getElementById('adminPassword')?.value.trim();
  const inputHash = await hashPassword(pwd);

  if (email === window._$(3) && inputHash === window._$(4)) {
    isAdmin = true;
    localStorage.setItem(window._$(5), 'true');
    document.getElementById('adminLoginOverlay').classList.remove('active');
    checkAdminStatus();
    showToast('✅ تم تسجيل الدخول!', 'success');
    showSection('products');
  } else {
    showToast('❌ البيانات غلط!', 'error');
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

async function checkSupabaseHealth() {
    if (!supabaseClient) return { ok: false, error: 'Supabase client not ready' };
    try {
        var { error } = await supabaseClient.from('deliveries').select('id', { head: true, count: 'exact' });
        if (error && error.code === 'PGRST205') return { ok: false, error: 'Tables missing', code: 'PGRST205' };
        if (error) return { ok: false, error: error.message, code: error.code };
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

async function migrateAllToSupabase() {
    if (!supabaseClient) { console.log('❌ Supabase مش متاح'); return; }

    var health = await checkSupabaseHealth();
    if (!health.ok && health.code === 'PGRST205') {
        console.log('⚠️ لسّه الجداول ناقصة! نفّذ SQL script في Supabase الأول');
        return;
    }
    if (!health.ok) {
        console.log('❌ مشكلة في Supabase:', health.error);
        return;
    }

    console.log('🚀 جاري نقل البيانات المحلية للسحابة...');
    var migrated = 0;

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

    if (testimonials.length > 0) {
        try {
            var { error } = await supabaseClient.from('testimonials').upsert(testimonials, { onConflict: 'id' });
            if (error) throw error;
            migrated += testimonials.length;
        } catch (e) { console.warn('Testimonials migration failed:', e.message); }
    }

    console.log('✅ تم نقل ' + migrated + ' سجل لـ Supabase!');
    console.log('🚀 Migration complete:', migrated, 'records');
    setTimeout(function() { console.log('🔄 Visibility changed, syncing...'); backgroundSyncFromSupabase(); }, 1000);
}

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

    array.forEach(function(item) {
        var exists = newOrder.find(function(x) { return String(x.id) === String(item.id); });
        if (!exists) newOrder.push(item);
    });

    newOrder.sort(function(a, b) { return a.sort_order - b.sort_order; });

    if (storageKey === 'stackstore_products') {
        products = newOrder;
        renderProducts();
    } else if (storageKey === 'stackstore_categories') {
        categories = newOrder;
        setupFilters();
        renderProducts();
    }

    try {
        localStorage.setItem(storageKey, JSON.stringify(newOrder));
    } catch(e) {}

    showToast('<i class="fas fa-check-circle"></i> تم تحديث الترتيب!', 'success');
}

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

function clearAllData() {
    if (!isAdmin) { showToast('❌ محتاج تكون أدمن!', 'error'); return; }
    if (!confirm('⚠️ هتمسح كل البيانات الديناميكية من الجهاز دا! متأكد؟')) return;

    localStorage.removeItem('stackstore_deliveries');
    localStorage.removeItem('stackstore_reviews');
    localStorage.removeItem('stackstore_testimonials');
    localStorage.removeItem('stackstore_review_images');

    deliveries = [];
    reviews = [];
    testimonials = [];
    reviewImages = [];

    renderDeliveries();
    renderReviews();
    renderTestimonials();
    updateStats();

    showToast('🗑️ تم مسح كل البيانات المحلية!', 'success');
}

window.addEventListener('online', function() {
    console.log('🌐 Back online');
    if (supabaseClient) { console.log('🌐 Back online, syncing...'); backgroundSyncFromSupabase(); }
});
window.addEventListener('offline', function() {
    console.log('📴 Offline mode - using localStorage');
});

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

window.onerror = function(msg, url, line) {
    console.warn('⚠️ JS Error:', msg, 'at line', line);
    return true;
};

console.log('%c🔥 Tamm Store', 'font-size:24px;font-weight:bold;color:#3b82f6;');
console.log('%cHybrid Mode | Products: Static ⚡ | Dynamic: Supabase', 'font-size:12px;color:#64748b;');

function safeGet(id) {
    var el = document.getElementById(id);
    return el || null;
}

document.addEventListener('visibilitychange', function() {
    if (!document.hidden && supabaseClient && !syncInProgress) {
        setTimeout(function() { console.log('🔄 Visibility changed, syncing...'); backgroundSyncFromSupabase(); }, 1000);
    }
});

setInterval(function() {
    if (isAdmin && products.length > 0) {
        try {
            localStorage.setItem('stackstore_auto_backup', JSON.stringify({
                deliveries: deliveries,
                reviews: reviews,
                testimonials: testimonials,
                timestamp: new Date().toISOString()
            }));
        } catch(e) {}
    }
}, 300000);

window.addEventListener('load', function() {
    var preloadImages = ['logo.png', 'hero-banner.png'];
    preloadImages.forEach(function(src) {
        var img = new Image();
        img.src = src;
    });
});

setInterval(function() {
    var anyModalOpen = document.querySelectorAll('.modal-overlay.active, .admin-login-overlay.active, .date-picker-overlay.active').length > 0;
    var drawerOpen = document.getElementById('mobileDrawer') && document.getElementById('mobileDrawer').classList.contains('active');
    if (!anyModalOpen && !drawerOpen && document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
    }
}, 2000);

console.log('📦 Tamm Store Hybrid v3.0 - All fixes applied');