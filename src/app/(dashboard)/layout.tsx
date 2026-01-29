import { AppSidebar } from "@/components/layout/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { UserNav } from "@/components/layout/user-nav"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    const user = session?.user

    // Fetch tenant details
    let companyName = "Acme Inc"
    let logoUrl: string | undefined = undefined
    if (user?.email) {
        // Assuming user is linked to a tenant, or we fetch the first one for now as per simple architecture
        // In a real multi-tenant app, we'd use user.tenantId
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { tenant: true }
        })
        if (dbUser?.tenant?.name) {
            companyName = dbUser.tenant.name
        }
        if (dbUser?.tenant?.logoUrl) {
            logoUrl = dbUser.tenant.logoUrl
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar companyName={companyName} logoUrl={logoUrl} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Platform
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <UserNav />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
