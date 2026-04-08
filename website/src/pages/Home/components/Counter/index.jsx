import * as LucideIcons from 'lucide-react'
import './styles/counter.css'

const getIcon = (iconName) => {
  if (!iconName) return LucideIcons.CircleHelp || LucideIcons.HelpCircle;
  const formattedName = iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const IconComponent = LucideIcons[formattedName];
  return IconComponent || LucideIcons.CircleHelp || LucideIcons.HelpCircle;
}

const Counter = ({ data = [] }) => {
  return (
    <div className="counter-section">
      <div className="container">
        <div className="counter-grid">
          {data.map((stat, index) => {
            const IconComponent = getIcon(stat.icon);
            return (
            <div className="counter-item" key={stat.id || index}>
              <div className="counter-icon">
                <IconComponent size={40} strokeWidth={1.5} />
              </div>
              <div className="counter-info">
                <span className="counter-value">{stat.count}</span>
                <span className="counter-label">{stat.name}</span>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Counter
