import { getTodayEntries, getLastEntry } from "@/app/(dashboard)/dashboard/time-tracking/actions"
import { TimeTracker } from "@/components/time-tracking/time-tracker"
import { DailyLog } from "@/components/time-tracking/daily-log"

export default async function TimeTrackingPage() {
    const entries = await getTodayEntries()
    const lastEntry = await getLastEntry()

    // Determine if working based on last entry type. 
    // If no entry, or last was EXIT, then not working.
    const isEntry = lastEntry?.type === 'ENTRY'

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-1">
                <TimeTracker
                    lastEntryType={lastEntry?.type || null}
                    lastEntryTime={isEntry ? lastEntry?.timestamp : null}
                />
            </div>
            <div className="md:col-span-1">
                <DailyLog entries={entries} />
            </div>
        </div>
    )
}
