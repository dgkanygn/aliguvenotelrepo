import { Link } from 'react-router-dom'

const Meetings = () => {
  return (
    <div className="page-placeholder container section-padding" style={{ paddingTop: '10rem', minHeight: '60vh' }}>
      <h1>Toplantı &amp; Etkinlik</h1>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
        İş dünyasına yönelik sunduğumuz profesyonel hizmetleri çok yakında burada bulabileceksiniz.
      </p>
      <Link to="/" className="btn btn-primary mt-4 cursor-pointer" style={{ marginTop: '2rem', display: 'inline-flex' }}>
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}

export default Meetings
