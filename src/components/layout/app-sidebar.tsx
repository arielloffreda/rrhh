"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    Clock,
    CalendarDays,
    FileText,
    Users,
    LayoutDashboard,
    MapPin
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
// import { UserRole } from "@prisma/client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar({ companyName, logoUrl, ...props }: React.ComponentProps<typeof Sidebar> & { companyName?: string; logoUrl?: string }) {
    const { data: session } = useSession()
    const user = session?.user as any
    const role = user?.role
    const pathname = usePathname()

    const isAdmin = role === "COMPANY_ADMIN" || role === "HR_ADMIN" || role === "SUPER_ADMIN"

    const navMain = [
        {
            title: "Plataforma",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Inicio",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    title: "Mi Perfil",
                    url: "/profile",
                    icon: Users,
                },
                {
                    title: "Fichada",
                    url: "/dashboard/time-tracking",
                    icon: Clock,
                },
                {
                    title: "Licencias",
                    url: "/dashboard/absences",
                    icon: CalendarDays,
                },
                {
                    title: "Recibos",
                    url: "/dashboard/payslips",
                    icon: FileText,
                },
            ],
        },
    ]

    const adminNav = [
        {
            title: "Gestión",
            url: "#",
            icon: Frame, // Replacement for Frame
            items: [
                {
                    title: "Gestionar Licencias",
                    url: "/dashboard/admin/absences",
                    icon: CalendarDays,
                },
                {
                    title: "Subir Recibos",
                    url: "/dashboard/admin/payslips",
                    icon: FileText,
                },
                {
                    title: "Empleados",
                    url: "/dashboard/employees",
                    icon: Users,
                },
                {
                    title: "Reportes",
                    url: "/dashboard/reports",
                    icon: PieChart,
                },
                {
                    title: "Reporte Fichada",
                    url: "/dashboard/reports/attendance",
                    icon: MapPin, // Using MapPin since it relates to location/tracking
                },
                {
                    title: "Configuración",
                    url: "/dashboard/settings",
                    icon: Settings2,
                },
                {
                    title: "Geolocalización",
                    url: "/dashboard/settings/geolocation",
                    icon: Map,
                },
            ]
        }
    ]

    return (
        <Sidebar collapsible="icon" className="glass-sidebar" {...props}>
            <SidebarHeader>
                <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                        {logoUrl ? (
                            <img src={logoUrl} alt={companyName} className="h-full w-full object-contain" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
                                <Command className="size-4" />
                            </div>
                        )}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{companyName || "Acme Inc"}</span>
                        <span className="truncate text-xs">Enterprise</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        {navMain[0].items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {isAdmin && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Admin</SidebarGroupLabel>
                        <SidebarMenu>
                            {adminNav[0].items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter>
                {/* User Nav in root layout usually covers this or separate footer component */}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
