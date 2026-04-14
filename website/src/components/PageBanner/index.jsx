import './styles/page-banner.css'

const PageBanner = ({ image, topTitle, pageTitle, defaultImage }) => {
  return (
    <div
      className="page-banner-hero"
      style={{ backgroundImage: `url('${image || defaultImage}')` }}
    >
      <div className="container container-hero-banner">
        {topTitle && <span className="section-subtitle">{topTitle}</span>}
        {pageTitle && <h1 className="page-title">{pageTitle}</h1>}
      </div>
    </div>
  )
}

export default PageBanner
