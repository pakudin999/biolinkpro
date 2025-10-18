
import React from 'react';
import { SOCIAL_LINKS } from '../constants';
import { FacebookIcon, TelegramIcon, InstagramIcon, TikTokIcon, TwitterIcon, BlogIcon } from './SocialIcons';

const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};

const TelegramChannelCard: React.FC = () => (
    <div className="max-w-md mx-auto mb-8">
        <div className="relative bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 mb-8 transform hover:scale-105 transition-all duration-500 hover:shadow-blue-500/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-400/20 to-yellow-400/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex items-center space-x-5 mb-6">
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <TelegramIcon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">KEMIRAGOLD</h4>
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">VERIFIED</span>
                    </div>
                    <p className="text-blue-700 font-medium mb-3 text-left">@KEMIRAGOLD</p>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-700">Active</span>
                    </div>
                </div>
            </div>
        </div>
        <button
            onClick={() => openLink(SOCIAL_LINKS.telegramChannel)}
            className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-4 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-1"
        >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                <TelegramIcon className="w-5 h-5" />
            </div>
            <div className="text-center">
                <div className="text-lg font-bold">Join KEMIRAGOLD Channel</div>
                <div className="text-sm text-blue-100">Get instant access to premium content</div>
            </div>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
        </button>
    </div>
);

const SocialButton: React.FC<{ url: string; label: string; className: string; children: React.ReactNode }> = ({ url, label, className, children }) => (
    <button
        onClick={() => openLink(url)}
        className={`group text-white p-6 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${className}`}
    >
        <div className="flex flex-col items-center space-y-3">
            {children}
            <span className="font-semibold text-sm">{label}</span>
        </div>
    </button>
);

const SocialMediaSection: React.FC = () => (
    <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow Us On Social Media</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <SocialButton url={SOCIAL_LINKS.facebook} label="Facebook" className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <FacebookIcon className="w-8 h-8" />
            </SocialButton>
            <SocialButton url={SOCIAL_LINKS.telegramGroup} label="Telegram" className="bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700">
                <TelegramIcon className="w-8 h-8" />
            </SocialButton>
            <SocialButton url={SOCIAL_LINKS.instagram} label="Instagram" className="bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                <InstagramIcon className="w-8 h-8" />
            </SocialButton>
            <SocialButton url={SOCIAL_LINKS.tiktok} label="TikTok" className="bg-gradient-to-br from-gray-800 to-black hover:from-black hover:to-gray-900">
                <TikTokIcon className="w-8 h-8" />
            </SocialButton>
            <SocialButton url={SOCIAL_LINKS.twitter} label="Twitter" className="bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600">
                <TwitterIcon className="w-8 h-8" />
            </SocialButton>
            <SocialButton url={SOCIAL_LINKS.blog} label="Blog" className="bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <BlogIcon className="w-8 h-8" />
            </SocialButton>
        </div>
    </div>
);

const GroupSection: React.FC = () => {
    return (
        <main className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
            <div className="text-center py-12">
                <TelegramChannelCard />
                <SocialMediaSection />
            </div>
        </main>
    );
};

export default GroupSection;
