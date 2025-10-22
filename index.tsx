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
function handleFirestoreError(error, action) {
    console.error(`Error ${action}:`, error);
    let message = `Failed to ${action}. Please check your internet connection.`;
    if (error.code === 'permission-denied') {
        message = `Permission Denied. The database security rules are blocking this action. This is common when deploying to a new URL like GitHub Pages. Please check your Firestore Rules in the Firebase Console.`;
    } else if (error.code === 'unauthenticated') {
        message = `Authentication Error. The database requires you to be logged in. Please check your Firestore Rules.`;
    }
    alert(message);
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

        renderAllMembers();
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
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm3.123 5.467a.75.75 0 00-1.06 1.06l1.25 1.25a.75.75 0 001.06 0l2.5-2.5a.75.75 0 00-1.06-1.06L9.39 9.22l-.722-.722z" clip-rule="evenodd" /></svg>
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

function renderAllMembers() {
    const teamGrid = document.getElementById('teamGrid');
    if (teamGrid) {
        teamGrid.innerHTML = teamMembers.map(createMemberCard).join('');
    }
}

function renderAdminList() {
    const adminList = document.getElementById('adminTeamList');
    if (!adminList) return;

    if (teamMembers.length === 0) {
        adminList.innerHTML = `<p class="text-center text-gray-500 py-4">No team members found. Click 'Add Member' to start.</p>`;
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

function setupScrollAnimation() {
    const animatedElements = document.querySelectorAll('.scroll-fade-in');
    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach(el => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
            else entry.target.classList.remove('is-visible');
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
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
        alert('Could not find the member to edit.');
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
    const snapshot = await getDocs(teamCollection);
    if (snapshot.empty) {
        await seedInitialData();
    }
    
    listenForTeamChanges();
    setupScrollAnimation();
    renderSliders();
    initSwipers();
    setupEventListeners();
    switchTab('home');
}

init();