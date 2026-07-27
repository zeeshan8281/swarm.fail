import SwarmApp from "@/components/SwarmApp";
import { buildBoard } from "@/lib/board";

// Server component: the board is computed at build time, so the record is in
// the HTML rather than arriving after a client fetch.
export default function Home() {
  return <SwarmApp initial={buildBoard()} />;
}
