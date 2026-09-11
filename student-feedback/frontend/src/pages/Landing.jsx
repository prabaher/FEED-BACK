import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, GraduationCap, Heart, Lightbulb, MessageSquare, ShieldCheck, Users } from 'lucide-react'

export const Landing = () => {
  const navigate = useNavigate()

  return (
    <main className="landing-page min-h-screen overflow-hidden">
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />
      <div className="relative z-10 max-w-6xl mx-auto min-h-screen px-6 py-10 lg:px-12 lg:py-16 flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <section className="text-center lg:text-left animate-fadeIn">
            <div className="inline-flex items-center gap-2 text-cyan-300 mb-6">
              <MessageSquare size={28} />
              <span className="text-sm uppercase tracking-[0.3em]">Your voice matters</span>
            </div>
            <h1 className="landing-title">
              <span>STUDENT</span>
              <strong>FEEDBACK</strong>
            </h1>
            <p className="landing-tagline">Free to say anything here 😊</p>
            <p className="max-w-lg mx-auto lg:mx-0 text-blue-100/75 text-lg mb-9">
              Share your thoughts, celebrate what works, and help make campus life better for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => navigate('/student/login')} className="landing-button landing-button-student">
                <GraduationCap size={22} /> Student Login <ArrowRight size={20} />
              </button>
              <button onClick={() => navigate('/admin/login')} className="landing-button landing-button-admin">
                <ShieldCheck size={22} /> Admin Login <ArrowRight size={20} />
              </button>
            </div>
            <div className="landing-features">
              <div><MessageSquare /><span>Your Voice<br />Matters</span></div>
              <div><Lightbulb /><span>Better<br />Campus</span></div>
              <div><Users /><span>Together<br />We Improve</span></div>
            </div>
          </section>
          <section className="landing-art hidden lg:flex" aria-label="Students sharing feedback">
            <div className="landing-note">
              <Heart className="text-pink-500" size={34} />
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
    </main>
  )
}
