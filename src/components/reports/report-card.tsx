"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, ReactNode } from "react"
import { ReportDetailsDialog } from "./report-details-dialog"

interface ReportCardProps {
    title: string
    value: string | number
    description: string
    icon: ReactNode
    detailsAction?: () => Promise<any[]>
    columns?: { header: string, accessorKey: string }[]
    reportType: "employees" | "absences" | "time-entries"
}

export function ReportCard({
    title,
    value,
    description,
    icon,
    detailsAction,
    columns,
    reportType
}: ReportCardProps) {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        if (!detailsAction) return

        setOpen(true)
        if (data.length === 0) {
            setLoading(true)
            try {
                const result = await detailsAction()
                setData(result)
            } catch (error) {
                console.error("Failed to load details", error)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <>
            <Card
                className={detailsAction ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
                onClick={handleClick}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                </CardContent>
            </Card>

            {detailsAction && columns && (
                <ReportDetailsDialog
                    open={open}
                    onOpenChange={setOpen}
                    title={`Detalle de ${title}`}
                    data={data}
                    columns={columns}
                    loading={loading}
                    reportType={reportType}
                />
            )}
        </>
    )
}
