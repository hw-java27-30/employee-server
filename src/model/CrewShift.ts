export type CrewShift = {
    shift_id: number,
    startShift: number,
    finishShift: number | null,
    table_num: string,
    shiftDuration: number,
    breaks: number,
    correct: string | null,
    monthHours: number
}
