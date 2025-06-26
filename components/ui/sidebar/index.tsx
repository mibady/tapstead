// Sidebar refactored into separate focused components
// This provides a cleaner, more maintainable structure

export { SidebarContext, useSidebar, type SidebarContext as SidebarContextType } from "./sidebar-context"
export { SidebarProvider } from "./sidebar-provider"
export { Sidebar } from "./sidebar-main"
export {
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
} from "./sidebar-components"
export {
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from "./sidebar-layout"
export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
} from "./sidebar-menu"
export {
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./sidebar-submenu"
export {
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_MOBILE,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_KEYBOARD_SHORTCUT,
} from "./sidebar-constants"