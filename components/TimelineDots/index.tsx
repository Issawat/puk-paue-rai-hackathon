import { Flex, Group } from "@mantine/core";
import { Dot } from "./Dot";
import { Line } from "./Line";
import { ReactNode } from "react";
import { SentimentSide } from "@/types/timelineData";

const colorMap: Record<SentimentSide, string> = {
  nuetral: "#e6e6e6",
  positive: "#98d900",
  negative: "#ff4e08",
  mixed: "#d68727",
};

export type TimelineDataPropItem = {
  side: SentimentSide;
  tooltip?: ReactNode;
  nodeOpacity?: number;
};

export type TimelineDataProps = {
  items: TimelineDataPropItem[];
  keyPrefix: string;
  fixedColor?: string;
};

export const TimelineDots = ({
  items,
  keyPrefix,
  fixedColor,
}: TimelineDataProps) => {
  return (
    <Flex direction="row" align="center" justify="stretch" w="100%">
      {items?.map((item, index) => {
        if (index >= items.length - 1) {
          return (
            <Dot
              key={`${keyPrefix}-dot-${index}`}
              color={fixedColor ?? colorMap[item.side]}
              dotSize={20}
              tooltip={item.tooltip}
              opacity={item.nodeOpacity}
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
              color={fixedColor ?? colorMap[item.side]}
              dotSize={20}
              tooltip={item.tooltip}
              opacity={item.nodeOpacity}
            />
            <Line
              color={fixedColor ?? colorMap[item.side]}
              width="calc(100% - 20px)"
              opacity={
                items[index + 1].nodeOpacity === 0 ? 0 : item.nodeOpacity
              }
            />
          </Flex>
        );
      })}
    </Flex>
  );
};
