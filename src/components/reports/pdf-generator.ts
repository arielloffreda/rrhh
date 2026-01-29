import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function generatePDF(
    title: string,
    columns: { header: string, accessorKey: string }[],
    data: any[]
) {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(18)
    doc.text(title, 14, 22)
    doc.setFontSize(11)
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30)

    // Table
    const tableColumn = columns.map(c => c.header)
    const tableRows = data.map(row => {
        return columns.map(col => {
            // Format specific fields if valid date string
            const val = row[col.accessorKey]
            // Simple date check regex or logic could go here, 
            // but for now we rely on pre-formatting in getActions or string conversion
            return String(val || "-")
        })
    })

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 163, 74] } // Green-ish brand color
    })

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`)
}
