import { Link } from 'react-router-dom';
import logoIcon from '../../assets/header-logo/header-logo-icon.svg';
import logoText from '../../assets/header-logo/header-logo-text.svg';
import './styles/logo.css';

const Logo = ({ className = '', color, showText = true }) => {
  return (
    <div className={`logo-wrapper ${className}`} style={color ? { color } : {}}>
      <Link to="/" className="logo-link cursor-pointer flex items-center gap-3">
        <img src={logoIcon} alt="Ali Güven Logo Icon" className="h-[48px] w-auto" />
        <div className="flex flex-col text-right leading-tight">
          <span className="text-lg md:text-xl font-bold tracking-tight whitespace-nowrap">ALİ GÜVEN</span>
          <span className="text-[8px] md:text-[10px] tracking-[0.2em] font-medium opacity-80 uppercase leading-none whitespace-nowrap">UYGULAMA OTELİ</span>
        </div>
        {/* {showText && <img src={logoText} alt="Ali Güven Uygulama Oteli" className="h-8 w-auto" />} */}
      </Link>
    </div>
  );
};

export default Logo;
