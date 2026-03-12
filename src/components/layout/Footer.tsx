import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plane, Twitter, Linkedin, Facebook, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group mb-6">
              <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden group-hover:-translate-y-1 transition-transform">
                <Image src="/logo.jpg" alt="Wings Academy Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white leading-none tracking-tight">WINGS <span className="text-accent">ACADEMY</span></span>
                <span className="text-[0.6rem] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Prepare for Takeoff</span>
              </div>
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Empowering Aircraft Maintenance Engineers with precision-engineered mock tests for global certification excellence.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-primary transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-primary transition-all">
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Navigation</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <p className="text-slate-400 mb-6">Subscribe to receive study tips and exam updates.</p>
            <div className="flex bg-white/10 rounded-xl p-1 px-2 border border-white/10">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent border-none focus:ring-0 text-white w-full p-2 text-sm"
              />
              <button className="bg-accent text-primary p-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Wings Academy. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Made with ✈️ for Aviation Professionals</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
