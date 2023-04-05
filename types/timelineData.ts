export type SentimentSide = "positive" | "negative" | "neutral" | "mixed";

export type Profitablity = {
  operatingIncome: {
    value: "Doubled";
    side: SentimentSide;
  };
  freeCashFlows: {
    value: "Increased over 50%";
    side: SentimentSide;
  };
  margins: {
    value: "Industry-leading";
    side: SentimentSide;
  };
};

export type RevenueHightlight = {
  value: string;
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
  revenueHighlight: RevenueHightlight;
  profitability: Profitablity;
  currentProductsUpdate: Product[];
  upcomingProductLaunches: Product[];
};
