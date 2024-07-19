export interface Streak {
    id: number;
    user_id: number;
    highest_streak: number;
    highest_streak_from: Date;
    highest_streak_to: Date;
    current_streak: number;
    current_streak_from: Date;
    current_streak_to: Date;
    total_contributions: number;
}


export interface Contributions{
    id: number;
    user_id: number;
    date: Date;
    type: string;
    count: number;
}
  