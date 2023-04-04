import { TimelineDots } from "@/components/TimelineDots";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div style={{width: "100vw"}}>
      <TimelineDots />
    </div>
  );
}
