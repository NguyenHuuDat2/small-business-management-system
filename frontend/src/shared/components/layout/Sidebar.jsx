import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as FiIcons from "react-icons/fi";
import {
  FiCircle,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { normalizeMenuPath } from "../../../app/router/pageRegistry";

function resolveIcon(iconName) {
  if (!iconName) return <FiCircle size={14} />;
  const IconComponent = FiIcons[iconName];
  return IconComponent ? <IconComponent /> : <FiCircle size={14} />;
}

function hasActiveChild(item, pathname) {
  if (!item?.children?.length) return false;

  return item.children.some((child) => {
    if (normalizeMenuPath(child.path) === normalizeMenuPath(pathname)) return true;
    return hasActiveChild(child, pathname);
  });
}

function collectActiveParentIds(items, pathname, result = new Set()) {
  for (const item of items || []) {
    if (hasActiveChild(item, pathname)) {
      result.add(item.id);
    }

    if (item?.children?.length) {
      collectActiveParentIds(item.children, pathname, result);
    }
  }

  return result;
}

function SidebarItem({
  item,
  collapsed,
  pathname,
  level = 0,
  expandedItems,
  toggleItem,
}) {
  const normalizedItemPath = normalizeMenuPath(item.path);
  const isActive = normalizedItemPath === normalizeMenuPath(pathname);
  const isParentActive = hasActiveChild(item, pathname);
  const hasChildren = item?.children?.length > 0;
  const isExpanded = expandedItems.has(item.id);
  const isTopLevel = level === 0;

  const wrapperClass = isTopLevel ? "mx-2" : "mx-0";

  const itemClass = `
    flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
    ${
      isActive
        ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20"
        : isParentActive
        ? "bg-slate-700 text-slate-100"
        : "text-slate-300 hover:bg-slate-700/80 hover:text-white"
    }
  `;

  if (hasChildren) {
    return (
      <li className={wrapperClass}>
        <button
          type="button"
          onClick={() => !collapsed && toggleItem(item.id)}
          className={`${itemClass} w-full justify-between text-left`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`text-lg ${
                isActive || isParentActive ? "text-teal-300" : "text-slate-400"
              }`}
            >
              {resolveIcon(item.icon)}
            </span>

            {!collapsed && (
              <span className={isTopLevel ? "font-semibold" : "font-medium"}>
                {item.name}
              </span>
            )}
          </div>

          {!collapsed && (
            <span className="text-base text-slate-400">
              {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
            </span>
          )}
        </button>

        {!collapsed && isExpanded && (
          <ul className="mt-1 space-y-1 pl-4">
            {item.children.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                collapsed={collapsed}
                pathname={pathname}
                level={level + 1}
                expandedItems={expandedItems}
                toggleItem={toggleItem}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className={wrapperClass}>
      <Link to={normalizedItemPath || "#"} className={itemClass}>
        <span
          className={`text-lg ${
            isActive ? "text-teal-200" : "text-slate-400"
          }`}
        >
          {resolveIcon(item.icon)}
        </span>

        {!collapsed && <span>{item.name}</span>}
      </Link>
    </li>
  );
}

function Sidebar({ collapsed }) {
  const location = useLocation();
  const { sidebar, user } = useAuth();

  const menuTree = useMemo(() => sidebar || [], [sidebar]);
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    const activeParents = collectActiveParentIds(menuTree, location.pathname);
    setExpandedItems(activeParents);
  }, [menuTree, location.pathname]);

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);

      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }

      return next;
    });
  };

  return (
    <aside
      className={`
        min-h-screen border-r border-slate-800
        bg-gradient-to-b from-slate-900 via-slate-850 to-slate-800
        transition-all duration-300
        ${collapsed ? "w-16" : "w-72"}
      `}
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #0f172a, #162033, #1e293b)",
      }}
    >
      <div className="border-b border-slate-700 bg-slate-900/60 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white shadow-md">
            EP
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-white">ERP Mini</h1>
              <p className="text-xs text-slate-400">
                {user?.role?.name || "Nhân viên"}
              </p>
            </div>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="px-4 pb-2 pt-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Điều hướng hệ thống
          </div>
        </div>
      )}

      <ul className="mt-2 space-y-1 px-1 pb-4">
        {menuTree.length > 0 ? (
          menuTree.map((menu) => (
            <SidebarItem
              key={menu.id}
              item={menu}
              collapsed={collapsed}
              pathname={location.pathname}
              expandedItems={expandedItems}
              toggleItem={toggleItem}
            />
          ))
        ) : (
          <li className="mx-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-slate-400">
            Chưa có menu
          </li>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;