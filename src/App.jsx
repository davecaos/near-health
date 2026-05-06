import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import CareJourney from './components/CareJourney/CareJourney'
import MemberExperience from './components/MemberExperience/MemberExperience'
import HowItWorks from './components/HowItWorks/HowItWorks'
import PostEnrollment from './components/PostEnrollment/PostEnrollment'
import OnePlatform from './components/OnePlatform/OnePlatform'
import RealWorld from './components/RealWorld/RealWorld'
import ShapedSection from './components/ShapedSection/ShapedSection'
import CareConnected from './components/CareConnected/CareConnected'
import FooterCta from './components/FooterCta/FooterCta'
import Footer from './components/Footer/Footer'
import { useLenis } from './hooks/useLenis'

export default function App() {
  useLenis()

  return (
    <>
      <Navbar />
      <Hero />
      <CareJourney />
      <MemberExperience />
      <HowItWorks />
      <PostEnrollment />
      <OnePlatform />
      <RealWorld />
      <ShapedSection />
      <CareConnected />
      <div className="footer-wrap">
        <FooterCta />
        <Footer />
      </div>
    </>
  )
}
