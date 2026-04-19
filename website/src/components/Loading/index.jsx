import Logo from '../Logo';
import './styles/loading.css';

const Loading = ({ fullScreen = true }) => {
  return (
    <div className={`loading-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="loading-content">
        <Logo className="loading-logo" showText={false} />
      </div>
    </div>
  );
};

export default Loading;