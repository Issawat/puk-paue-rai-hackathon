import {
  TimelineDataPropItem,
  TimelineDataProps,
  TimelineDots,
} from "@/components/TimelineDots";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Container, Text } from "@mantine/core";
import { TimlineData } from "@/types/timelineData";

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
  const [data, setData] = useState<TimlineData[]>();

  useEffect(() => {
    const canvasContext = ref?.current?.getContext("2d");
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

  useEffect(() => {
    const f = async () => {
      const res = await fetch("/data/sample.json");
      const resData = await res.json();
      setData(resData?.data as TimlineData[]);
    };
    f();
  }, []);

  const revenueHightlights = useMemo(
    () =>
      data?.map(
        ({ revenueHightLight }) =>
          ({
            side: revenueHightLight.side,
            tooltip: (
              <Box>
                <Text size="xl" weight="bold">
                  Hightlight
                </Text>
                <Text size="xl">{revenueHightLight.highlight}</Text>
              </Box>
            ),
          } as TimelineDataPropItem)
      ) ?? [],
    [data]
  );

  const profitabilities = useMemo(
    () =>
      data?.map(
        ({ profitability: profitablity }) =>
          ({
            side: profitablity?.side,
            tooltip: (
              <Box>
                <Text size="xl" weight="bold">
                  Profitablity
                </Text>
                <Text size="xl">
                  GAAP Margin: {profitablity?.gaapAutomotiveGrossMargin}
                </Text>
                <Text size="xl">
                  Operation Margin: {profitablity?.operationMargin}
                </Text>
              </Box>
            ),
          } as TimelineDataPropItem)
      ) ?? [],
    [data]
  );

  return (
    <Container style={{ width: "100vw", ...inter.style }}>
      <Box w="100%" px="100px">
        <canvas ref={ref} />
      </Box>
      <Text my={4}>Revenue Highlights</Text>
      <TimelineDots keyPrefix="revenueHightlights" items={revenueHightlights} />
      <Text my={4}>Profitability</Text>
      <TimelineDots keyPrefix="profitability" items={profitabilities} />
    </Container>
  );
}
