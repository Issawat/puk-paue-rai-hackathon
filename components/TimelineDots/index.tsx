import { Box, Group } from "@mantine/core";
import { Dot } from "./Dot";
import { Line } from "./Line";

const mockData = ["neutral", "positive", "negative", "positive", "positive"];

const colorMap: Record<string, string> = {
  neutral: "gray",
  positive: "green",
  negative: "red",
};

export const TimelineDots = () => {
  return (
    <Group spacing="0" w="100%">
      {mockData.map((value, index) => {
        if (index === mockData.length - 1) {
          return (
            <Dot
              key={index}
              color={colorMap[value]}
              dotSize={20}
              opacity={0.1 + index / mockData.length}
            />
          );
        }
        return (
          <Group
            key={index}
            spacing="0"
            position="apart"
            w={`${100 / mockData.length}%`}
          >
            <Dot
              color={colorMap[value]}
              dotSize={20}
              opacity={0.1 + index / mockData.length}
            />
            <Line
              color={colorMap[value]}
              width="calc(100% - 20px)"
              opacity={0.1 + index / mockData.length}
            />
          </Group>
        );
      })}
    </Group>
  );
};
