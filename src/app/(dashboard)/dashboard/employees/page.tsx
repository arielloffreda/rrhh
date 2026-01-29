import { getEmployees } from "@/app/(dashboard)/dashboard/employees/actions"
import { AddEmployeeDialog } from "@/components/employees/add-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EmployeeActions } from "@/components/employees/actions-menu"

export default async function EmployeesPage() {
    const employees = await getEmployees()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Empleados</h3>
                    <p className="text-sm text-muted-foreground">
                        Gestiona el personal de tu organización.
                    </p>
                </div>
                <AddEmployeeDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Fecha Alta</TableHead>
                                <TableHead className="text-right">Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-secondary overflow-hidden">
                                                {employee.avatarUrl ? (
                                                    <img src={employee.avatarUrl} alt={employee.fullName || "User"} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                                                        {(employee.fullName || "U").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{employee.fullName || '-'}</span>
                                                {employee.jobTitle && <span className="text-xs text-muted-foreground">{employee.jobTitle}</span>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{employee.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(employee.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <EmployeeActions employee={employee} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
