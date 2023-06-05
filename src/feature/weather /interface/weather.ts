export interface IPerformanceGraph {
    timestamp: number;
    count: number;
}
export interface IUserStatsInfo {
    performanceGraph: IPerformanceGraph[];
    total: number;
    performancePer: number;
}

export interface IUserStats {
    view: IUserStatsInfo;
    win: IUserStatsInfo;
    challenge: IUserStatsInfo;
}