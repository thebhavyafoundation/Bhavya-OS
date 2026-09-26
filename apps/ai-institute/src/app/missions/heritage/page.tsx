"use client";

import { getMissionProfile } from "@/data/mission-profiles";
import { MissionPage } from "@/components/site/MissionPage";

export default function HeritageMissionPage() {
  return <MissionPage profile={getMissionProfile("heritage")} />;
}
