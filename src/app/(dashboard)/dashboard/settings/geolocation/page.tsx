"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getTenantSettings, updateOfficeLocation } from "./actions"
import { Loader2, MapPin, Save } from "lucide-react"

export default function GeolocationSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form States
    const [lat, setLat] = useState<string>("")
    const [lng, setLng] = useState<string>("")
    const [address, setAddress] = useState("")
    const [radius, setRadius] = useState("300")

    useEffect(() => {
        getTenantSettings()
            .then(tenant => {
                if (tenant) {
                    setLat(tenant.officeLat?.toString() || "")
                    setLng(tenant.officeLng?.toString() || "")
                    setAddress(tenant.officeAddress || "")
                    setRadius(tenant.officeRadius?.toString() || "300")
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocalización no soportada por este navegador")
            return
        }

        toast.info("Obteniendo ubicación...")
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(pos.coords.latitude.toString())
                setLng(pos.coords.longitude.toString())
                toast.success("Ubicación actual obtenida")
            },
            (err) => {
                console.error(err)
                toast.error("Error al obtener ubicación: " + err.message)
            },
            { enableHighAccuracy: true }
        )
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await updateOfficeLocation(
                parseFloat(lat),
                parseFloat(lng),
                address,
                parseInt(radius) || 300
            )
            toast.success("Configuración guardada exitosamente")
        } catch (error) {
            toast.error("Error al guardar configuración")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Geolocalización</h2>
                <p className="text-muted-foreground">Configura la ubicación de la oficina principal para validación de fichajes.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ubicación de Oficina</CardTitle>
                    <CardDescription>
                        Define las coordenadas exactas de la oficina. Los empleados deberán estar dentro del radio especificado para fichar como "Presencial".
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Nombre / Dirección de Referencia</Label>
                            <Input
                                placeholder="Ej: Oficinas Centrales - Av. Corrientes 1234"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Latitud</Label>
                                <Input
                                    value={lat}
                                    onChange={e => setLat(e.target.value)}
                                    placeholder="-34.6037"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Longitud</Label>
                                <Input
                                    value={lng}
                                    onChange={e => setLng(e.target.value)}
                                    placeholder="-58.3816"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="button" variant="secondary" onClick={handleGetCurrentLocation} className="w-full">
                                <MapPin className="mr-2 h-4 w-4" />
                                Usar mi ubicación actual
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Radio Permitido (metros)</Label>
                            <Input
                                type="number"
                                value={radius}
                                onChange={e => setRadius(e.target.value)}
                                min="50"
                                max="5000"
                            />
                            <p className="text-xs text-muted-foreground">Distancia máxima permitida desde el punto central.</p>
                        </div>

                        {lat && lng && (
                            <div className="rounded-md overflow-hidden border bg-muted/50 p-4">
                                <p className="text-sm font-medium mb-2">Vista Previa:</p>
                                <div className="aspect-video w-full rounded bg-gray-100 flex items-center justify-center relative group">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        scrolling="no"
                                        marginHeight={0}
                                        marginWidth={0}
                                        src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                                        className="absolute inset-0"
                                    />
                                    <div className="absolute inset-0 pointer-events-none border-2 border-primary/50 rounded z-10 opacity-50" />
                                </div>
                                <p className="text-xs text-center mt-2 text-muted-foreground">
                                    <a
                                        href={`https://maps.google.com/?q=${lat},${lng}`}
                                        target="_blank"
                                        className="hover:underline"
                                    >
                                        Abrir en Google Maps
                                    </a>
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Configuración
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
