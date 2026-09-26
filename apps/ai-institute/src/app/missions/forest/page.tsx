"use client";

import { getMissionProfile } from "@/data/mission-profiles";
import { MissionPage } from "@/components/site/MissionPage";

export default function ForestMissionPage() {
  return <MissionPage profile={getMissionProfile("forest")} />;
}
