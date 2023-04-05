import { Flex, Group } from "@mantine/core";
import { Dot } from "./Dot";
import { Line } from "./Line";
import { ReactNode } from "react";
import { SentimentSide } from "@/types/timelineData";

const mockData = ["neutral", "positive", "negative", "positive", "positive"];

const colorMap: Record<SentimentSide, string> = {
  nuetral: "gray",
  positive: "green",
  negative: "red",
  mixed: "orange",
};

export type TimelineDataPropItem = {
  side: SentimentSide;
  tooltip?: ReactNode;
};

export type TimelineDataProps = {
  items: TimelineDataPropItem[];
  keyPrefix: string;
};

export const TimelineDots = ({ items, keyPrefix }: TimelineDataProps) => {
  return (
    <Flex direction="row" align="center" justify="stretch" w="100%">
      {items?.map((item, index) => {
        if (index === items.length - 1) {
          return (
            <Dot
              key={`${keyPrefix}-dot-${index}`}
              color={colorMap[item.side]}
              dotSize={20}
              tooltip={item.tooltip}
            />
          );
        }
        return (
          <Flex
            key={`${keyPrefix}-group-${index}`}
            direction="row"
            align="center"
            justify="stretch"
            w={`calc(${100 / (items.length - 1)}% - 5px)`}
          >
            <Dot
              color={colorMap[item.side]}
              dotSize={20}
              tooltip={item.tooltip}
            />
            <Line color={colorMap[item.side]} width="calc(100% - 20px)" />
          </Flex>
        );
      })}
    </Flex>
  );
};
