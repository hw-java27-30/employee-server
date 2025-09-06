export interface CrewShiftService {
    startShift: (tab_n:string) => Promise<{tab_num: string, time: string}>;
    finishShift: (tab_n:string) => Promise<{tab_num: string, time: string}>;
    break: (tab_n:string, number: number) => Promise<void>
    // correctShift: (tab_n_crew, tab_n_mng, start, finish, date) => void
    // getCurrentShiftStaff: () => Promise<CurrentCrewShift[]>

}