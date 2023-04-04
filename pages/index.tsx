import { TimelineDots } from "@/components/TimelineDots";
import { Inter } from "next/font/google";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale
);

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasContext = ref?.current?.getContext("2d");
    console.log("effect")
    if (canvasContext) {
      new Chart(canvasContext, {
        type: "line",
        data: {
          datasets: [
            {
              label: "hello",
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: true,
              tension: 0.1,
            },
          ],
        },
      });
    }
  }, []);

  return (
    <div style={{ width: "100vw", ...inter.style }}>
      <TimelineDots />
      <canvas ref={ref} />
    </div>
  );
}
