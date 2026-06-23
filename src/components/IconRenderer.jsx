export default function IconRenderer({ icon: Icon, className, size = 22 }) {
  return <Icon aria-hidden="true" className={className} focusable="false" size={size} />;
}
