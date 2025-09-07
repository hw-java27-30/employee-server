export interface CrewShiftService {
    startShift: (tab_n:string) => Promise<{tab_num: string, time: string}>;
    finishShift: (tab_n:string) => Promise<{tab_num: string, time: string}>;
    breakShift: (tab_n:string, number: number) => Promise<void>
    correctShift: (tab_n_crew: string, tab_n_mng:string, start:string, finish:string, date) => void
    // getCurrentShiftStaff: () => Promise<CurrentCrewShift[]>

}