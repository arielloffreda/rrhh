import { auth } from "@/auth"
import { ProfileForm } from "@/components/profile/profile-form"
import { prisma } from "@/lib/prisma"
import { Separator } from "@/components/ui/separator"

export default async function ProfilePage() {
    const session = await auth()
    const sessionUser = session?.user as any

    if (!sessionUser?.id) return <div>Unauthorized</div>

    const user = await prisma.user.findUnique({
        where: { id: sessionUser.id }
    })

    if (!user) return <div>User not found</div>

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Mi Perfil</h3>
                <p className="text-sm text-muted-foreground">
                    Gestiona tu información personal y datos de contacto.
                </p>
            </div>
            <Separator />
            <ProfileForm user={user as any} />
        </div>
    )
}
