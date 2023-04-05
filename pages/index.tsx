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
} from "chart.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Tabs, Text } from "@mantine/core";
import { TimlineData } from "@/types/timelineData";
import { StockData } from "@/types/stockData";
import dayjs from "dayjs";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale
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
        const hasProduct = !!item.productUpdates.find(
          (product) => product.product === productTarget
        );
        if (hasProduct) {
          if (alpha < MAX_ALPHA) {
            alpha += ALPHA_STEP;
          }

          return {
            side: "nuetral",
            nodeOpacity: alpha,
          };
        } else {
          alpha = DEFAULT_ALPHA;
          return {
            side: "nuetral",
            nodeOpacity: alpha,
          };
        }
      }) ?? [];
    return timelineData;
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
      // const highPrices = stockTimeline.map((stock) => stock.high);
      // const lowPrices = stockTimeline.map((stock) => stock.low);
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
              // {
              //   data: highPrices,
              //   label: "High",
              //   borderColor: "#98d900",
              //   tension: 0.1,
              //   cubicInterpolationMode: "monotone",
              // },
              // {
              //   data: lowPrices,
              //   label: "Low",
              //   borderColor: "#ff4e08",
              //   tension: 0.1,
              //   cubicInterpolationMode: "monotone",
              // },
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

  const revenueHightlights = useMemo(
    () =>
      data?.map(
        ({ revenueHightLight }) =>
          ({
            side: revenueHightLight.side,
            tooltip: (
              <Box>
                <Text size="md" weight="bold">
                  Hightlight
                </Text>
                <Text size="md">{revenueHightLight.highlight}</Text>
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
                <Text size="md" weight="bold">
                  Profitablity
                </Text>
                <Text size="md">
                  GAAP Margin: {profitablity?.gaapAutomotiveGrossMargin}
                </Text>
                <Text size="md">
                  Operation Margin: {profitablity?.operationMargin}
                </Text>
              </Box>
            ),
          } as TimelineDataPropItem)
      ) ?? [],
    [data]
  );

  const productSet = useMemo(
    () =>
      Array.from(
        new Set(
          data?.flatMap((item) =>
            item.productUpdates.map((update) => update.product)
          )
        )
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

  console.debug({ productTimelines });

  return (
    <Box style={{ width: "100vw", padding: 0, ...inter.style }}>
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
              keyPrefix="revenueHightlights"
              items={revenueHightlights}
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
