import { GCInitialPlayerStats } from "@/apps/shared/extras/gc/types/GCInitialPlayerStats";
import { GCPlayerStatsHistory } from "@/apps/shared/extras/gc/types/GCPlayerStatsHistory";
import analytics from "@/apps/shared/tools/analytics";
import { gcUrls } from "./resources/urls";


export const userAPI = {
  getById(id: string){
    return fetch(gcUrls.player(id))
      .then(response => response.text())
      .catch(analytics.sendError)
  },

  boxInitialMatches(id: string): Promise<GCInitialPlayerStats> {
    return fetch(gcUrls.boxInitialMatches(id))
      .then(response => response.json())
      .catch(analytics.sendError)
  },

  boxMatchesHistory(id: string): Promise<GCPlayerStatsHistory> {
    return fetch(gcUrls.boxMatchesHistory(id))
    .then(response => response.json())
    .catch(analytics.sendError)
  }
}

