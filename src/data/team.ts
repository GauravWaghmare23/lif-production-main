import type { TeamMember } from '../types';
import raw from '../content/team.json';

/** Team — data lives in team.json. */
export const TEAM_DATA: TeamMember[] = raw.team as TeamMember[];
