import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 uppercase tracking-wider">
              Trusted by Future Engineers
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f172a] leading-tight mb-6">
              Master Your Aviation Certification with <span className="text-primary">Precision Mock Tests</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Practice real exam-style questions for EASA, GCAA, and DGCA certifications. Simple, mobile-friendly preparation that guarantees success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="#pricing" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                Start Free Tests
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#subjects" className="w-full sm:w-auto bg-white text-[#0f172a] border border-slate-200 shadow-sm px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                View Subjects
              </Link>
            </div>
          </div>

          {/* Simple Image Content */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-none relative z-10">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-slate-200">
              <Image 
                src="/aircraft_hero.png" 
                alt="Commercial passenger aircraft in flight"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Simple overlay gradient for text legibility if needed later, but right now image stands alone */}
            </div>
            {/* Simple stats card overlaid */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 hidden sm:flex">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                    98%
                </div>
                <div>
                   <p className="font-bold text-[#0f172a] leading-tightSpacing">Pass Rate</p>
                   <p className="text-sm text-slate-500">For Active Users</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
