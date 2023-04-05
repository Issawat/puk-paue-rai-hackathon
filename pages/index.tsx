import { TimelineDataPropItem, TimelineDots } from "@/components/TimelineDots";
import { Inter } from "next/font/google";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  TimeScale,
} from "chart.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Tabs, Text } from "@mantine/core";
import { SentimentSide, TimlineData } from "@/types/timelineData";
import { StockData } from "@/types/stockData";
import dayjs from "dayjs";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  TimeScale
);

const inter = Inter({ subsets: ["latin"] });

const DEFAULT_ALPHA = 0;
const ALPHA_STEP = 0.25;
const MAX_ALPHA = 1;
const productTimelineTranformer =
  (data: TimlineData[]) =>
  (productTarget: string): TimelineDataPropItem[] => {
    let alpha = DEFAULT_ALPHA;
    const timelineData: TimelineDataPropItem[] =
      data.map((item) => {
        const product =
          item.currentProductsUpdate?.find(
            (product) => product.product === productTarget
          ) ||
          item.upcomingProductLaunches?.find(
            (product) => product.product === productTarget
          );
        if (!!product) {
          if (alpha < MAX_ALPHA) {
            alpha += ALPHA_STEP;
          }

          return {
            side: "neutral",
            nodeOpacity: alpha,
            tooltip: (
              <Box>
                <Text size="md" weight="bold">
                  {product.product}
                </Text>
                <Text size="md">Description: {product.description}</Text>
                <Text size="md">
                  Related keywords:{" "}
                  {product.keywords.map((keyword) => `, ${keyword}`)}
                </Text>
                <Text size="md">Status: {product.status}</Text>
              </Box>
            ),
          };
        } else {
          alpha = DEFAULT_ALPHA;
          return {
            side: "neutral",
            nodeOpacity: alpha,
          };
        }
      }) ?? [];
    return timelineData;
  };

const PROFIT_VAL: Record<SentimentSide, number> = {
  mixed: 0,
  negative: -1,
  neutral: 0,
  positive: 1,
};
const getProfitabilitySide = (sides: SentimentSide[]): SentimentSide => {
  const value = sides
    ?.map((side) => PROFIT_VAL[side])
    ?.reduce((prev, curr) => prev + curr, 0);

  if (value === 0) return "neutral";
  if (value === 1) return "positive";
  return "negative";
};

export default function Home() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<TimlineData[]>();

  useEffect(() => {
    const f = async () => {
      const res = await fetch(`/data/stock.json`);
      const resData = await res.json();
      const stockTimeline = resData.results as StockData[];
      const closePrices = stockTimeline.map((stock) => stock.close);
      const stockDates = stockTimeline.map((stock) =>
        dayjs(stock.date).format("MM/YY")
      );
      const canvasContext = ref?.current?.getContext("2d");
      if (canvasContext) {
        new Chart(canvasContext, {
          type: "line",
          options: {
            responsive: false,
            elements: {
              point: {
                radius: 0,
              },
            },
          },
          data: {
            labels: stockDates,
            datasets: [
              {
                data: closePrices,
                label: "Close",
                borderColor: "#0083e0",
                tension: 0.1,
                cubicInterpolationMode: "monotone",
              },
            ],
          },
        });
      }
    };
    f();
  }, []);

  useEffect(() => {
    const f = async () => {
      const res = await fetch("/data/sample.json");
      const resData = await res.json();
      setData(resData?.data as TimlineData[]);
    };
    f();
  }, []);

  const revenueHighlight = useMemo(
    () =>
      data?.map(
        ({ revenueHighlight }) =>
          ({
            side: revenueHighlight?.side,
            tooltip: (
              <Box>
                <Text size="md" weight="bold">
                  Hightlight
                </Text>
                <Text size="md">{revenueHighlight.value}</Text>
              </Box>
            ),
          } as TimelineDataPropItem)
      ) ?? [],
    [data]
  );

  const profitabilities = useMemo(
    () =>
      data?.map(
        ({ profitability }) =>
          ({
            side: getProfitabilitySide([profitability.freeCashFlows.side]),
            tooltip: (
              <Box>
                <Text size="md" weight="bold">
                  Profitablity
                </Text>
                <Text size="md">
                  Free cash flows: {profitability?.freeCashFlows.value}
                </Text>
                <Text size="md">
                  Operating income: {profitability?.operatingIncome.value}
                </Text>
                <Text size="md">Margins: {profitability?.margins.value}</Text>
              </Box>
            ),
          } as TimelineDataPropItem)
      ) ?? [],
    [data]
  );

  const productSet = useMemo(
    () =>
      Array.from(
        new Set([
          ...(data?.flatMap((item) =>
            item.currentProductsUpdate?.map((update) => update.product)
          ) ?? []),
          ...(data?.flatMap((item) =>
            item.upcomingProductLaunches?.map((update) => update.product)
          ) ?? []),
        ])
      ),
    [data]
  );

  const productTimelines = useMemo(
    () =>
      productSet.map((product) => ({
        product,
        timeline: productTimelineTranformer(data || [])(product),
      })),
    [data, productSet]
  );

  return (
    <Box style={{ width: "100vw", padding: "20px", ...inter.style }}>
      <Text
        my={4}
        weight="bold"
        variant="gradient"
        align="center"
        sx={{ fontSize: "50px" }}
      >
        TSLA (Tesla)
      </Text>
      <Box mt={4} pb={10} w="99%">
        <canvas ref={ref} style={{ width: "100%", height: "500px" }} />
      </Box>
      <Box w="100%" pl={10}>
        <Tabs variant="pills" defaultValue="fundamental" radius="xl">
          <Tabs.List>
            <Tabs.Tab value="fundamental">Fundamental</Tabs.Tab>
            <Tabs.Tab value="drilldown">Drilldown</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="fundamental" py="lg">
            <Text my={4}>Revenue Highlights</Text>
            <TimelineDots
              keyPrefix="revenueHighlight"
              items={revenueHighlight}
            />
            <Text my={4}>Profitability</Text>
            <TimelineDots keyPrefix="profitability" items={profitabilities} />
          </Tabs.Panel>

          <Tabs.Panel value="drilldown" py="lg">
            {productTimelines.map((product, index) => (
              <Box key={`product-${product.product}-${index}`}>
                <Text my={4}>{product.product}</Text>
                <TimelineDots
                  keyPrefix="profitability"
                  items={product.timeline}
                  fixedColor="#0083e0"
                />
              </Box>
            ))}
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
}
