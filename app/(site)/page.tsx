import { getPortfolioData } from "@/lib/data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export const revalidate = 60;

export default async function HomePage() {
  const { profile, projects, skillCategories, testimonials } =
    await getPortfolioData();

  return (
    <>
      <Header profile={profile} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skillCategories={skillCategories} />
        <Projects projects={projects} />
        <Testimonials testimonials={testimonials} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
