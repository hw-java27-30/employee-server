export type CrewShift = {
    _id: number,
    startShift: number,
    finishShift: number | null,
    table_num: string,
    shiftDuration: number,
    breaks: number,
    correct: string | null,
    monthHours: number
}

export type CurrentCrewShift = {
    table_num: string,
    startShift: string,
    breaks: number,
}


