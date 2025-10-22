// --- Firebase Integration ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, writeBatch, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// --- Firebase Configuration ---
// IMPORTANT: This configuration was taken from your App.tsx file.
// Ensure it's correct for your Firebase project.
const firebaseConfig = {
    apiKey: "AIzaSyDhpKeJGxEPl5PkMna3fh4aA689xTisgvs",
    authDomain: "biomgsb.firebaseapp.com",
    projectId: "biomgsb",
    storageBucket: "biomgsb.appspot.com",
    messagingSenderId: "261287635103",
    appId: "1:261287635103:web:53a964e245d3dab2db9aaa",
    measurementId: "G-G4CHVJJ99M"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const teamCollection = collection(db, "teamMembers");

// --- Default Data & Constants ---
const DEFAULT_TEAM_MEMBERS = [
    { name: 'ALLY', phone: '0176007172', role: 'Team Specialist', image: null },
    { name: 'IREEN', phone: '0173744553', role: 'Team Specialist', image: null },
    { name: 'JIHA', phone: '0174044557', role: 'Team Specialist', image: null },
    { name: 'AYU', phone: '0143839682', role: 'Team Specialist', image: null },
    { name: 'LISA', phone: '01110516455', role: 'Team Specialist', image: null },
    { name: 'FASYA', phone: '0143839582', role: 'Team Specialist', image: null },
    { name: 'LIEN', phone: '0162659190', role: 'Team Specialist', image: null },
    { name: 'ECA', phone: '01116179190', role: 'Team Specialist', image: null },
    { name: 'FARAH', phone: '0146499190', role: 'Team Specialist', image: null },
    { name: 'FIFI', phone: '0168019190', role: 'Team Specialist', image: null },
    { name: 'FIKRIE', phone: '0103602036', role: 'Team Media', image: 'https://i.imgur.com/4SkS9k0.png' }
];

let teamMembers = [];
let scrollObserver: IntersectionObserver | null = null;

const SLIDER_IMAGES_ROW1 = [
    'https://i.imgur.com/6eeSRLT.jpeg', 'https://i.imgur.com/5TrcDNr.jpeg', 'https://i.imgur.com/I1LjYMI.jpeg',
    'https://i.imgur.com/vJOr7fn.jpeg', 'https://i.imgur.com/faJCS7z.jpeg'
];
const SLIDER_IMAGES_ROW2 = [
    'https://i.imgur.com/fuhTQ74.jpeg', 'https://i.imgur.com/ckGimJl.jpeg', 'https://i.imgur.com/36zJKGo.jpeg',
    'https://i.imgur.com/ZCegcGC.jpeg', 'https://i.imgur.com/fLG14ZC.jpeg'
];
const COLORS = [
    'bg-red-200 text-red-700', 'bg-orange-200 text-orange-700', 'bg-amber-200 text-amber-700', 'bg-yellow-200 text-yellow-700',
    'bg-lime-200 text-lime-700', 'bg-green-200 text-green-700', 'bg-emerald-200 text-emerald-700', 'bg-teal-200 text-teal-700',
    'bg-cyan-200 text-cyan-700', 'bg-sky-200 text-sky-700', 'bg-blue-200 text-blue-700', 'bg-indigo-200 text-indigo-700',
    'bg-violet-200 text-violet-700', 'bg-purple-200 text-purple-700', 'bg-fuchsia-200 text-fuchsia-700', 'bg-pink-200 text-pink-700',
    'bg-rose-200 text-rose-700'
];

// --- Error Handling ---
function showGlobalError(title, detailsHtml) {
    const banner = document.getElementById('globalErrorBanner');
    const titleEl = document.getElementById('globalErrorTitle');
    const messageEl = document.getElementById('globalErrorMessage');
    const closeBtn = document.getElementById('closeErrorBanner');

    if (!banner || !titleEl || !messageEl || !closeBtn) return;

    titleEl.textContent = title;
    messageEl.innerHTML = detailsHtml;
    banner.classList.remove('hidden');

    closeBtn.onclick = () => {
        banner.classList.add('hidden');
    };
}

function handleFirestoreError(error, action) {
    console.error(`Error ${action}:`, error);

    let title = `Failed to ${action}`;
    let detailsHtml = `An unexpected error occurred. Please check your internet connection and try again.`;

    if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
        title = "Permission Error with Database";
        detailsHtml = `
            <p class="mb-2">The app couldn't access the data, which is a common issue after deploying to a new website like GitHub Pages.</p>
            <p class="font-semibold">Here's how to fix it in your Firebase Console:</p>
            <ol class="list-decimal list-inside mt-2 space-y-1">
                <li><strong>Authorize Domain:</strong> Go to <strong>Authentication > Settings > Authorized domains</strong> and add your GitHub Pages URL (e.g., <strong>${window.location.hostname}</strong>).</li>
                <li><strong>Check Firestore Rules:</strong> Go to <strong>Firestore Database > Rules</strong>. For a public directory, you need to allow anyone to read the data. A safe rule could be:
                    <pre class="bg-red-50 text-xs p-2 rounded mt-1 font-mono"><code>service cloud.firestore {
  match /databases/{database}/documents {
    match /teamMembers/{docId} {
      allow read: if true;
      allow write: if false; // Protects data
    }
  }
}</code></pre>
                </li>
            </ol>
        `;
    }

    showGlobalError(title, detailsHtml);

    const teamGrid = document.getElementById('teamGrid');
    if (teamGrid) {
        teamGrid.innerHTML = `
            <div class="col-span-full text-center py-10 bg-red-100/50 rounded-lg border border-red-200">
                <h3 class="font-semibold text-red-700">Failed to Load Team Members</h3>
                <p class="text-red-600 text-sm mt-1">See the error banner at the top for details on how to fix this.</p>
            </div>
        `;
    }
     const adminList = document.getElementById('adminTeamList');
     const adminSection = document.getElementById('adminSection');
    if (adminList && adminSection && !adminSection.classList.contains('hidden')) {
         adminList.innerHTML = `<p class="text-center text-red-600 p-4 bg-red-100/50 rounded-lg">Failed to load data. See the error banner at the top for help.</p>`;
    }
}


// --- Data Persistence (Firestore) ---
async function seedInitialData() {
    console.log("Database is empty. Seeding with default team members...");
    const batch = writeBatch(db);
    DEFAULT_TEAM_MEMBERS.forEach(member => {
        const newDocRef = doc(teamCollection);
        batch.set(newDocRef, member);
    });
    await batch.commit();
}

function listenForTeamChanges() {
    onSnapshot(teamCollection, (snapshot) => {
        teamMembers = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        renderAllMembers(searchInput.value);
        
        const adminSection = document.getElementById('adminSection');
        if (adminSection && !adminSection.classList.contains('hidden')) {
            renderAdminList();
        }
    }, (error) => {
        handleFirestoreError(error, "connect to the database");
    });
}

// --- Rendering Functions ---
function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash % COLORS.length)];
}

function createMemberCard(member) {
    const initial = member.name.charAt(0).toUpperCase();
    const colorClasses = getAvatarColor(member.name);
    const avatarHtml = member.image
        ? `<img src="${member.image}" alt="${member.name}" class="w-10 h-10 rounded-full object-cover flex-shrink-0">`
        : `<div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses}">
               <span class="font-semibold text-base">${initial}</span>
           </div>`;
    return `
        <div class="bg-white/25 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/30 hover-scale scroll-fade-in">
            <div class="flex items-center space-x-3 mb-4">
                ${avatarHtml}
                <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-1">
                        <h3 class="text-xs font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">${member.name}</h3>
                        <svg class="w-4 h-4 text-blue-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                    </div>
                    <p class="text-xs text-gray-500">${member.role}</p>
                </div>
            </div>
            <button class="w-full text-gray-800 font-medium py-2 px-3 text-xs rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 hover:border-green-400 hover:bg-green-100/50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                data-action="contact" data-phone="${member.phone}" data-name="${member.name}" data-image="${member.image || ''}">
                <svg class="w-4 h-4 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
                <span class="pointer-events-none">Contact</span>
            </button>
        </div>
    `;
}

function renderAllMembers(searchTerm = '') {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredMembers = teamMembers.filter(member =>
        (member.name?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
        (member.role?.toLowerCase() || '').includes(lowerCaseSearchTerm)
    );

    if (filteredMembers.length > 0) {
        teamGrid.innerHTML = filteredMembers.map(createMemberCard).join('');
        observeElements(teamGrid); // Observe newly rendered member cards
    } else {
        teamGrid.innerHTML = `
            <div class="col-span-full text-center py-10">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 class="mt-2 text-sm font-semibold text-gray-900">No members found</h3>
                <p class="mt-1 text-sm text-gray-500">
                    ${searchTerm ? "Try adjusting your search." : "No team members have been added yet."}
                </p>
            </div>
        `;
    }
}


function renderAdminList() {
    const adminList = document.getElementById('adminTeamList');
    if (!adminList) return;

    if (teamMembers.length === 0) {
        adminList.innerHTML = `
            <div class="text-center py-10 px-4 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/40">
                <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 0115 9.75v6.038m-3.75-6.808A3.75 3.75 0 019 9.75v6.038m-3.75-6.808A3.75 3.75 0 013 9.75v6.038m12-6.808v-3a3 3 0 00-3-3H9a3 3 0 00-3 3v3m15 9.75a3 3 0 01-3 3H6a3 3 0 01-3-3v-3a3 3 0 013-3h12a3 3 0 013 3v3z" />
                </svg>
                <h3 class="mt-2 text-lg font-semibold text-gray-800">Your Team is Empty</h3>
                <p class="mt-1 text-sm text-gray-600">Get started by adding your first team member.</p>
                <button data-action="add-first-member" class="mt-6 inline-flex items-center rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600">
                    <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Add First Member
                </button>
            </div>
        `;
        return;
    }

    adminList.innerHTML = teamMembers.map((member) => {
        const initial = member.name.charAt(0).toUpperCase();
        const colorClasses = getAvatarColor(member.name);
        const avatarHtml = member.image
            ? `<img src="${member.image}" alt="${member.name}" class="w-10 h-10 rounded-full object-cover flex-shrink-0">`
            : `<div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses}">
                   <span class="font-semibold text-base">${initial}</span>
               </div>`;

        return `
            <div class="bg-white/50 backdrop-blur-lg rounded-xl p-3 flex items-center justify-between shadow-md border border-white/30">
                <div class="flex items-center space-x-3 min-w-0">
                    ${avatarHtml}
                    <div class="min-w-0">
                        <p class="font-semibold text-sm text-gray-800 truncate">${member.name}</p>
                        <p class="text-xs text-gray-600 truncate">${member.role}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2 flex-shrink-0">
                    <button data-action="edit" data-id="${member.id}" class="p-2 rounded-full hover:bg-blue-100/50 transition-colors text-blue-600" aria-label="Edit ${member.name}">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                    </button>
                    <button data-action="delete" data-id="${member.id}" class="p-2 rounded-full hover:bg-red-100/50 transition-colors text-red-600" aria-label="Delete ${member.name}">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" /></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderSkeletonLoader() {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;
    const skeletonCard = `
        <div class="bg-white/25 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/30 skeleton-pulse scroll-fade-in">
            <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-gray-300/50"></div>
                <div class="flex-1 min-w-0 space-y-2">
                    <div class="h-3 bg-gray-300/50 rounded"></div>
                    <div class="h-2 bg-gray-300/50 rounded w-3/4"></div>
                </div>
            </div>
            <div class="w-full h-8 bg-gray-300/50 rounded-xl"></div>
        </div>
    `;
    teamGrid.innerHTML = Array(6).fill(skeletonCard).join('');
    observeElements(teamGrid); // Observe skeleton loaders
}


function renderSliders() {
    const swiperWrapper1 = document.getElementById('swiperWrapper1');
    const swiperWrapper2 = document.getElementById('swiperWrapper2');

    const createSlide = (src, alt) => `
        <div class="swiper-slide">
            <div class="w-full aspect-[1/1.414] bg-white/30 rounded-2xl overflow-hidden shadow-lg border border-white/20">
                <img src="${src}" class="w-full h-full object-cover" loading="lazy" alt="${alt}">
            </div>
        </div>
    `;

    if (swiperWrapper1) {
        swiperWrapper1.innerHTML = SLIDER_IMAGES_ROW1.map(src => createSlide(src, "Koleksi RT")).join('');
    }
    if (swiperWrapper2) {
        swiperWrapper2.innerHTML = SLIDER_IMAGES_ROW2.map(src => createSlide(src, "Koleksi Rantai")).join('');
    }
}

// --- UI & Interaction ---
function initSwipers() {
    // @ts-ignore
    new Swiper(".mySwiper1", { slidesPerView: 2, spaceBetween: 16, loop: true, centeredSlides: true, speed: 600, autoplay: { delay: 2000, disableOnInteraction: false }, slidesPerGroup: 1, allowTouchMove: true });
    // @ts-ignore
    new Swiper(".mySwiper2", { slidesPerView: 2, spaceBetween: 16, loop: true, centeredSlides: true, speed: 600, autoplay: { delay: 2000, disableOnInteraction: false, reverseDirection: true }, slidesPerGroup: 1, allowTouchMove: true });
}

function contactMember(phone, name, image) {
    showConfirmationPopup(phone, name, image);
}

function closePopup() {
    const popup = document.querySelector('.confirmation-popup, .member-form-popup');
    if (popup) {
        popup.remove();
    }
}

function openWhatsApp(phone, name) {
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '6' + formattedPhone;
    } else if (!formattedPhone.startsWith('60')) {
        formattedPhone = '60' + formattedPhone;
    }
    const message = encodeURIComponent(`Hi ${name}, I would like to get in touch with you.`);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    closePopup();
}

function showConfirmationPopup(phone, name, image) {
    closePopup();
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in confirmation-popup';
    
    const imagePlaceholderHtml = image
        ? `<img src="${image}" alt="${name}" class="w-36 h-36 rounded-2xl object-cover mx-auto mb-5 border border-white/50 shadow-inner">`
        : `<div class="w-36 h-36 bg-gray-200/70 rounded-2xl flex items-center justify-center mx-auto mb-5 overflow-hidden border border-white/50 shadow-inner">
                <svg class="w-16 h-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </div>`;

    popup.innerHTML = `
        <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl border border-white/50">
            ${imagePlaceholderHtml}
            <div class="text-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Contact ${name}?</h3>
                <p class="text-gray-600 text-sm">You will be redirected to WhatsApp to start a conversation.</p>
            </div>
            <div class="flex space-x-3">
                <button data-action="close-popup" class="flex-1 px-4 py-3 text-gray-700 bg-white/50 font-medium border border-gray-300/70 rounded-xl hover:bg-gray-100/50 transition-colors">Cancel</button>
                <button data-action="open-whatsapp" data-phone="${phone}" data-name="${name}" class="flex-1 px-4 py-3 bg-green-500 font-medium text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">Yes, Contact</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function switchTab(selectedTab) {
    const mainContentContainer = document.getElementById('mainContentContainer');
    const pageHeader = document.getElementById('pageHeader');
    const mainTabsContainer = document.getElementById('mainTabsContainer');
    const homeSection = document.getElementById('homeSection');
    const mediaSection = document.getElementById('mediaSection');
    const webmobileSection = document.getElementById('webmobileSection');
    const adminSection = document.getElementById('adminSection');
    const homeTab = document.getElementById('homeTab');
    const mediaTab = document.getElementById('mediaTab');
    const topHomeTab = document.getElementById('topHomeTab');
    const topWebmobileTab = document.getElementById('topWebmobileTab');
    const topAdminTab = document.getElementById('topAdminTab');

    const activeMainTabClasses = 'bg-amber-400 text-amber-900 shadow-lg';
    const inactiveMainTabClasses = 'bg-white/30 text-gray-700 hover:bg-white/40';
    const baseMainTabClasses = 'flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200';
    const activeTopNavClasses = 'font-semibold text-amber-600';
    const inactiveTopNavClasses = 'font-medium text-gray-600 hover:text-amber-600';
    const baseTopNavClasses = 'text-sm transition-colors';

    mainContentContainer.classList.add('pt-8', 'pb-8');
    pageHeader.classList.remove('hidden');
    mainTabsContainer.classList.remove('hidden');
    homeSection.classList.add('hidden');
    mediaSection.classList.add('hidden');
    webmobileSection.classList.add('hidden');
    adminSection.classList.add('hidden');

    topHomeTab.className = `${baseTopNavClasses} ${inactiveTopNavClasses}`;
    topWebmobileTab.className = `${baseTopNavClasses} ${inactiveTopNavClasses}`;
    topAdminTab.className = `${baseTopNavClasses} ${inactiveTopNavClasses}`;

    if (selectedTab === 'webmobile') {
        mainContentContainer.classList.remove('pt-8', 'pb-8');
        pageHeader.classList.add('hidden');
        mainTabsContainer.classList.add('hidden');
        webmobileSection.classList.remove('hidden');
        topWebmobileTab.className = `${baseTopNavClasses} ${activeTopNavClasses}`;
    } else if (selectedTab === 'admin') {
        pageHeader.classList.add('hidden');
        mainTabsContainer.classList.add('hidden');
        adminSection.classList.remove('hidden');
        topAdminTab.className = `${baseTopNavClasses} ${activeTopNavClasses}`;
        renderAdminList();
    } else {
        topHomeTab.className = `${baseTopNavClasses} ${activeTopNavClasses}`;
        if (selectedTab === 'home') {
            homeSection.classList.remove('hidden');
            homeTab.className = `${baseMainTabClasses} ${activeMainTabClasses}`;
            mediaTab.className = `${baseMainTabClasses} ${inactiveMainTabClasses}`;
        } else if (selectedTab === 'media') {
            mediaSection.classList.remove('hidden');
            homeTab.className = `${baseMainTabClasses} ${inactiveMainTabClasses}`;
            mediaTab.className = `${baseMainTabClasses} ${activeMainTabClasses}`;
        }
    }
}

function initScrollObserver() {
    if (!('IntersectionObserver' in window)) {
        document.body.classList.add('no-observer');
        return;
    }
    
    scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once for performance
            }
        });
    }, { threshold: 0.1 });
}

function observeElements(container: HTMLElement) {
    if (!scrollObserver) return;
    const elementsToObserve = container.querySelectorAll('.scroll-fade-in');
    elementsToObserve.forEach(el => {
        scrollObserver.observe(el);
    });
}

// --- Admin CRUD Functions (Firestore Version) ---
async function addMember(memberData) {
    try {
        await addDoc(teamCollection, memberData);
    } catch (e) {
        handleFirestoreError(e, 'add member');
    }
}

async function updateMember(id, memberData) {
    try {
        const memberRef = doc(db, "teamMembers", id);
        await updateDoc(memberRef, memberData);
    } catch (e) {
        handleFirestoreError(e, 'update member');
    }
}

async function deleteMember(id) {
    const memberToDelete = teamMembers.find(m => m.id === id);
    if (!memberToDelete) return;

    if (confirm(`Are you sure you want to delete ${memberToDelete.name}?`)) {
        try {
            await deleteDoc(doc(db, "teamMembers", id));
        } catch (e) {
            handleFirestoreError(e, 'delete member');
        }
    }
}

function showMemberForm(id = null) {
    closePopup();
    const isEditing = id !== null;
    const member = isEditing
        ? teamMembers.find(m => m.id === id)
        : { name: '', phone: '', role: '', image: '' };

    if (isEditing && !member) {
        // Using the new error system instead of alert
        showGlobalError('Error', 'Could not find the member to edit. Please refresh and try again.');
        return;
    }

    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in member-form-popup';

    popup.innerHTML = `
        <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl border border-white/50">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">${isEditing ? 'Edit Team Member' : 'Add New Member'}</h3>
            <form id="memberForm" class="space-y-4">
                <div>
                    <label for="memberName" class="text-sm font-medium text-gray-700 block mb-1">Name</label>
                    <input type="text" id="memberName" name="name" value="${member.name}" required class="w-full px-3 py-2 bg-white/50 border border-gray-300/70 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition">
                </div>
                <div>
                    <label for="memberPhone" class="text-sm font-medium text-gray-700 block mb-1">Phone (e.g., 0123456789)</label>
                    <input type="tel" id="memberPhone" name="phone" value="${member.phone}" required class="w-full px-3 py-2 bg-white/50 border border-gray-300/70 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition">
                </div>
                <div>
                    <label for="memberRole" class="text-sm font-medium text-gray-700 block mb-1">Role</label>
                    <input type="text" id="memberRole" name="role" value="${member.role}" required class="w-full px-3 py-2 bg-white/50 border border-gray-300/70 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition">
                </div>
                <div>
                    <label for="memberImage" class="text-sm font-medium text-gray-700 block mb-1">Image URL (Optional)</label>
                    <input type="url" id="memberImage" name="image" value="${member.image || ''}" placeholder="https://example.com/image.png" class="w-full px-3 py-2 bg-white/50 border border-gray-300/70 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition">
                </div>
                <div class="flex space-x-3 pt-2">
                    <button type="button" data-action="close-popup" class="flex-1 px-4 py-3 text-gray-700 bg-white/50 font-medium border border-gray-300/70 rounded-xl hover:bg-gray-100/50 transition-colors">Cancel</button>
                    <button type="submit" class="flex-1 px-4 py-3 bg-amber-500 font-medium text-white rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30">Save</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('memberForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const newMemberData = {
            name: String(formData.get('name')).trim(),
            phone: String(formData.get('phone')).trim(),
            role: String(formData.get('role')).trim(),
            image: String(formData.get('image')).trim() || null,
        };

        if (isEditing) {
            updateMember(id, newMemberData);
        } else {
            addMember(newMemberData);
        }
        closePopup();
    });
}

function setupEventListeners() {
    document.getElementById('topHomeTab').addEventListener('click', () => switchTab('home'));
    document.getElementById('topWebmobileTab').addEventListener('click', () => switchTab('webmobile'));
    document.getElementById('topAdminTab').addEventListener('click', () => switchTab('admin'));
    document.getElementById('homeTab').addEventListener('click', () => switchTab('home'));
    document.getElementById('mediaTab').addEventListener('click', () => switchTab('media'));
    document.getElementById('addMemberBtn').addEventListener('click', () => showMemberForm());

    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    searchInput.addEventListener('input', (e) => {
        renderAllMembers((e.target as HTMLInputElement).value);
    });

    document.getElementById('teamGrid').addEventListener('click', (event) => {
        const button = (event.target as HTMLElement).closest('button[data-action="contact"]');
        if (!button) return;
        const { phone, name, image } = (button as HTMLButtonElement).dataset;
        contactMember(phone, name, image);
    });

    document.getElementById('adminTeamList').addEventListener('click', (event) => {
        const button = (event.target as HTMLElement).closest('button');
        if (!button) return;
        const { action, id } = (button as HTMLButtonElement).dataset;
        if (action === 'edit') {
            showMemberForm(id);
        } else if (action === 'delete') {
            deleteMember(id);
        } else if (action === 'add-first-member') {
            showMemberForm();
        }
    });

    document.body.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const button = target.closest('button');

        if (target.matches('.confirmation-popup, .member-form-popup') || (button && button.dataset.action === 'close-popup')) {
             closePopup();
             return;
        }

        if (button?.dataset.action === 'open-whatsapp') {
            const { phone, name } = button.dataset;
            openWhatsApp(phone, name);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
}

// --- App Initialization ---
async function init() {
    try {
        // 1. Initialize the animation observer system.
        initScrollObserver();

        // 2. Render initial UI content (skeletons, static sliders).
        renderSkeletonLoader();
        renderSliders();

        // 3. Initialize interactive components and event listeners.
        initSwipers();
        setupEventListeners();
        switchTab('home');
        
        // 4. Observe all initial elements on the page.
        observeElements(document.body);

        // 5. Start listening for real-time data from Firestore.
        listenForTeamChanges();

        // 6. Check if the database is empty and needs to be seeded with default data.
        const snapshot = await getDocs(teamCollection);
        if (snapshot.empty) {
            await seedInitialData();
        }
    } catch (e) {
        handleFirestoreError(e, "initialize the application");
    }
}

init();