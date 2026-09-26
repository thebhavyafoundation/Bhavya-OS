"use client";

import { getMissionProfile } from "@/data/mission-profiles";
import { MissionPage } from "@/components/site/MissionPage";

export default function CommunityMissionPage() {
  return <MissionPage profile={getMissionProfile("community")} />;
}
