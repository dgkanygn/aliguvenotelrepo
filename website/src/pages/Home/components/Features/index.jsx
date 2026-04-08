import * as LucideIcons from 'lucide-react'
import './styles/features.css'

const getIcon = (iconName) => {
  if (!iconName) return LucideIcons.CircleHelp || LucideIcons.HelpCircle;
  const formattedName = iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const IconComponent = LucideIcons[formattedName];
  return IconComponent || LucideIcons.CircleHelp || LucideIcons.HelpCircle;
}

const Features = ({ data = [] }) => {
  return (
    <section className="features section-padding">
      <div className="container overflow-hidden">
        <div className="features-grid">
          {data.map((item, index) => {
            const IconComponent = getIcon(item.icon);
            return (
            <div className="feature-item" key={item.id || index}>
              <div className="feature-icon">
                <IconComponent size={28} />
              </div>
              <div className="feature-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
