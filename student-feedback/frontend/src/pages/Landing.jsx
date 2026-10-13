import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, GraduationCap, Heart, Lightbulb, MessageSquare, ShieldCheck, Users } from 'lucide-react'

export const Landing = () => {
  const navigate = useNavigate()

  return (
    <main className="landing-page min-h-screen relative flex flex-col justify-between overflow-x-hidden pb-12 sm:pb-8">
      {/* Ambient background orbs */}
      <div className="landing-orb landing-orb-one" aria-hidden="true" />
      <div className="landing-orb landing-orb-two" aria-hidden="true" />

      {/* Main hero wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 lg:px-12 lg:py-16 flex-1 flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center w-full">
          {/* Hero left content */}
          <section className="text-center lg:text-left animate-fadeIn">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1e1107] border border-[#F4AE52]/30 text-[#F4AE52] mb-6 shadow-[inset_2px_2px_4px_rgba(10,5,1,0.6),inset_-2px_-2px_4px_rgba(244,174,82,0.08)]">
              <MessageSquare size={18} className="text-[#F4AE52]" />
              <span className="text-xs uppercase tracking-[0.25em] font-semibold">Your voice matters</span>
            </div>

            <h1 className="landing-title mb-2">
              <span>STUDENT</span>
              <strong>FEEDBACK</strong>
            </h1>

            <p className="landing-tagline">Free to say anything here 😊</p>

            <p className="max-w-lg mx-auto lg:mx-0 text-[#d8c2ad]/90 text-base sm:text-lg mb-8 leading-relaxed">
              Share your thoughts, celebrate what works, and help make campus life better for everyone.
            </p>

            {/* Raised Neumorphic Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                id="btn-student-login"
                onClick={() => navigate('/student/login')}
                className="landing-button landing-button-student group"
                aria-label="Navigate to Student Login"
              >
                <GraduationCap size={22} className="transition-transform group-hover:scale-110" />
                <span>Student Login</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="btn-admin-login"
                onClick={() => navigate('/admin/login')}
                className="landing-button landing-button-admin group"
                aria-label="Navigate to Admin Login"
              >
                <ShieldCheck size={22} className="transition-transform group-hover:scale-110" />
                <span>Admin Login</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Neumorphic Feature Badges */}
            <div className="landing-features" role="list">
              <div role="listitem">
                <MessageSquare size={20} />
                <span>Your Voice<br />Matters</span>
              </div>
              <div role="listitem">
                <Lightbulb size={20} />
                <span>Better<br />Campus</span>
              </div>
              <div role="listitem">
                <Users size={20} />
                <span>Together<br />We Improve</span>
              </div>
            </div>
          </section>

          {/* Hero right visual art (responsive for mobile & desktop) */}
          <section
            className="landing-art flex mt-4 lg:mt-0"
            aria-label="Students sharing feedback illustration"
          >
            <div className="landing-note">
              <Heart className="text-[#D4621A] mb-1" size={30} />
              <p>Your Feedback<br /><strong>Builds a<br />Better Tomorrow</strong></p>
              <span>✦</span>
            </div>
            <div className="landing-students">
              <div className="student-shape student-blue" />
              <div className="student-shape student-orange" />
              <div className="student-shape student-purple" />
              <div className="student-shape student-pink" />
            </div>
            <div className="landing-campus" />
          </section>
        </div>
      </div>

      {/* Section 8: Creator Credit in bottom-right corner */}
      <footer className="creator-credit" aria-label="Creator credit">
        CREATED BY Prabaher J
      </footer>
    </main>
  )
}
