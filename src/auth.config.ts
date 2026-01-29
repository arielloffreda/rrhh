import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAuth = nextUrl.pathname.startsWith('/login');

            // Admin Routes Protection
            const adminRoutes = [
                '/dashboard/admin/',
                '/dashboard/employees',
                '/dashboard/reports',
                '/dashboard/settings'
            ];
            const isOnAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route));

            // @ts-ignore
            const userRole = auth?.user?.role;
            const adminRoles = ['COMPANY_ADMIN', 'HR_ADMIN', 'SUPER_ADMIN'];
            const isAdmin = userRole && adminRoles.includes(userRole as string);

            if (isOnDashboard) {
                if (isLoggedIn) {
                    // Check RBAC
                    if (isOnAdminRoute && !isAdmin) {
                        return Response.redirect(new URL('/dashboard', nextUrl));
                    }
                    return true;
                }
                return false; // Redirect unauthenticated users to login page
            }

            if (isOnAuth && isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
        async session({ session, token }) {
            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role as string;
            }
            return session;
        },
    },
} satisfies NextAuthConfig
