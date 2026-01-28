import { getTenantSettings } from "@/app/(dashboard)/dashboard/settings/actions"
import { SettingsForm } from "@/components/settings/settings-form"

export default async function SettingsPage() {
    const tenant = await getTenantSettings()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Configuración</h3>
                <p className="text-sm text-muted-foreground">
                    Administra los datos de tu organización.
                </p>
            </div>
            <div className="max-w-xl">
                <SettingsForm initialData={tenant} />
            </div>
        </div>
    )
}
