// إخفاء شاشة التحميل بعد تحميل الصفحة
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';
  });
  
  // عرض نافذة المنتج
  function showProductModal(imgSrc, title, description, stock, price) {
    document.getElementById('modal-image').src = imgSrc;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = description;
    document.getElementById('modal-stock').textContent = stock;
    document.getElementById('modal-price').textContent = price;
  
    document.getElementById('product-modal').classList.remove('hidden');
  }
  
  // إغلاق النافذة
  function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
  }

const firebaseConfig = {
  apiKey: "AIzaSyBhGAPKDreUd_9B-YXbZqksjRY5fIofE00",
  authDomain: "pawer-bank.firebaseapp.com",
  databaseURL: "https://pawer-bank-default-rtdb.firebaseio.com",
  projectId: "pawer-bank",
  storageBucket: "pawer-bank.firebasestorage.app",
  messagingSenderId: "1018796657725",
  appId: "1:1018796657725:web:82b0a0e1e21c9e32a42e54",
  measurementId: "G-J392KF17SG"
};

firebase.initializeApp(firebaseConfig);

// استخدام قاعدة البيانات
const db = firebase.database();









// إعدادات Cloudinary (غيّرهم إلى إعداداتك)
const cloudName = 'dykt0mfx9'; 
const uploadPreset = 'PowerBank'; 

// دالة رفع الصورة إلى Cloudinary
async function uploadImageToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.secure_url;  // رابط الصورة بعد الرفع
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// عنصر النموذج
const form = document.getElementById('add-product-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('product-name').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const imageInput = document.getElementById('product-image');

  if (imageInput.files.length === 0) {
    alert('يرجى اختيار صورة المنتج');
    return;
  }

  const file = imageInput.files[0];

  // رفع الصورة إلى Cloudinary
  const imageUrl = await uploadImageToCloudinary(file);

  if (!imageUrl) {
    alert('حدث خطأ أثناء رفع الصورة');
    return;
  }

  // تحضير بيانات المنتج
  const productData = {
    name,
    description,
    price,
    imageUrl,
    status: 'pending',     // وضع حالة المعلق
    createdAt: Date.now()
  };

  // حفظ بيانات المنتج في جدول "products_processing" في Firebase Realtime Database
  firebase.database().ref('products_processing').push(productData)
    .then(() => {
      alert('تم إرسال المنتج بنجاح للمراجعة.');
      form.reset();
    })
    .catch((error) => {
      alert('حدث خطأ أثناء حفظ المنتج: ' + error.message);
    });
});










// store


// المرجع إلى مكان عرض المنتجات في المتجر
const storeContainer = document.querySelector('.store-container');

// جلب المنتجات المقبولة من Firebase
firebase.database().ref('products_accepted').on('value', snapshot => {
  storeContainer.innerHTML = ''; // تفريغ القديم

  snapshot.forEach(childSnapshot => {
    const product = childSnapshot.val();

    // إنشاء بطاقة المنتج
    const productCard = document.createElement('div');
    productCard.classList.add('product');
    productCard.innerHTML = `
      <img class="product__image" src="${product.imageUrl}" alt="صورة المنتج">
      <span class="product__price">${product.price} SK</span>
      <h1 class="product__title">${product.name}</h1>
      <hr />
      <p>${product.description}</p>
      <a href="#" class="product__btn btn">طلب</a>
    `;

    storeContainer.appendChild(productCard);
  });
});