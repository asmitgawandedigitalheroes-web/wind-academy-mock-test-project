import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import HowItWorks from '@/components/home/HowItWorks'
import Subjects from '@/components/home/Subjects'
import Features from '@/components/home/Features'
import DashboardPreview from '@/components/home/DashboardPreview'
import FinalCTA from '@/components/home/FinalCTA'
import ExamsSection from '@/components/home/ExamsSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <ExamsSection />
      <Subjects />
      <Features />
      <DashboardPreview />
      <FinalCTA />
      <Footer />
    </main>
  )
}
