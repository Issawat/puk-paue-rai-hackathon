export type SentimentSide = "positive" | "negative" | "nuetral" | "mixed";

export type Profitablity = {
  gaapAutomotiveGrossMargin: number;
  operationMargin: number;
  side: SentimentSide;
};

export type RevenueHightlight = {
  highlight: string;
  side: SentimentSide;
};

export type ProductStatus = "in-progress" | "complete" | "fail" | "delay";

export type Product = {
  product: string;
  description: string;
  status: ProductStatus;
  keywords: string[];
};

export type TimlineData = {
  period: string;
  revenueHightLight: RevenueHightlight;
  profitability: Profitablity;
  productUpdates: Product[];
  upcomingProductLaunches: Product[];
};
