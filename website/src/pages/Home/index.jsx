import Hero from './components/Hero'
import Counter from './components/Counter'
import Biography from './components/Biography'
import Features from './components/Features'
import Experience from './components/Experience'
import Services from './components/Services'
import { useHome } from './hooks/useHome'

const Home = () => {
  const { data, loading, error } = useHome();

  if (loading) return <div className="loading-state h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (error) return <div className="error-state h-screen flex items-center justify-center">Hata: {error}</div>;

  return (
    <>
      <Hero data={data?.hero} />
      <Counter data={data?.counters} />
      <Biography data={data?.founder} />
      <Features data={data?.features} />
      <Experience />
      <Services />
    </>
  )
}

export default Home
