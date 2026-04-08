import './styles/biography.css'

const Biography = ({ data }) => {
  if (!data) return null;

  return (
    <section className="biography section-padding" id="about">
      <div className="container">
        <div className="biography-grid">
          <div className="biography-image-wrapper">
            <div className="vintage-frame">
              <img src={data.image_url} alt="Ali Güven" className="biography-img" />
            </div>
            <div className="signature">Ali Güven (1931 - 1993)</div>
          </div>

          <div className="biography-content">
            <span className="section-subtitle">Hakkımızda</span>
            <h2 className="section-title">{data.title}</h2>
            <div className="bio-text" dangerouslySetInnerHTML={{ __html: data.content }}></div>
            {data.special_text && (
              <div className="bio-quote">
                <p>{data.special_text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Biography
