"use client";

import { supabase } from "@/lib/supabase";
import { WavyBackground } from "@/components/ui/wavy-background";
import { motion } from "framer-motion";

export default function Home() {
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });
  };

  return (
    <WavyBackground className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-8 shadow-2xl space-y-8">
            {/* Logo/Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z"
                  />
                </svg>
              </div>
            </div>

            {/* Header Text */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-300 text-sm">
                Sign in to manage your bookmarks securely
              </p>
            </div>

            {/* Sign In Button */}
            <button
              onClick={signIn}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95 transform"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-gray-400">
                  Secure & Private
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Real-time sync across devices</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Private bookmarks with encryption</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 text-center py-6 text-gray-400 text-xs flex flex-col gap-1">
          <p>Made by Naman R</p>
          <p>&copy; 2026 Bookmark App.</p>
        </div>
      </div>
    </WavyBackground>
  );
}
