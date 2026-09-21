import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import SocialPosts from './components/sections/SocialPosts';
import CalendarSection from './components/sections/CalendarSection';
import TeamSection from './components/sections/TeamSection';
import GallerySection from './components/sections/GallerySection';
import NewsletterFooter from './components/sections/NewsletterFooter';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
      <Header />
      <main className="pt-16">
        <Hero />
        <SocialPosts />
        <CalendarSection />
        <TeamSection />
        <GallerySection />
      </main>
      <NewsletterFooter />
    </div>
  );
}

export default App;