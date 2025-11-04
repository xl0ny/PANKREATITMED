import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

const routeNames: Record<string, string> = {
  "": "Главная",
  "criteria": "Критерии",
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  // Если мы на главной — ничего не показываем
  if (pathParts.length === 0) return null;

  let path = "";
  return (
    <nav className="breadcrumbs">
      <ul>
        {pathParts.map((part, index) => {
          path += `/${part}`;
          const isLast = index === pathParts.length - 1;

          const name =
            routeNames[part] || part.replace(/^\w/, (c) => c.toUpperCase());

          return (
            <li key={path} className={isLast ? "active" : ""}>
              {isLast ? (
                <span>{name}</span>
              ) : (
                <Link to={path}>{name}</Link>
              )}
              {!isLast && <span className="divider">›</span>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;