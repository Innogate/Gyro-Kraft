export interface Article {
  ageGroup: string;
  articleNo: string;
  qty: number;
  gender: string;
  productPhotos: string[];
}

export interface POQty {
  combo: string;
  proColor: string;
  fabricQuality: string;
  supplier: string;
  preemie: number;
  nb: number;
  totalQty: number;
  articles: Article[];
}

export interface FabricBOM {
  fabric: string;
  colour: string;
  tpx: string;
  description: string;
}

export interface AccessoriesBOM {
  particular: string;
  specification: string;
  shadeNo: string;
  consumption: number;
  supplier: string;
  status: string;
}

export interface OrderCreatePayload {
  uniqueId: string;
  date: string;
  buyer: string;
  styleNo: string;
  brand: string;
  season: string;
  ageGroup: string;
  shipmentDate: string;
  pattern: string;
  printing: string;
  steps: string;
  deadlineDate: string;
  remark: string;
  documents: any[];
  poQty: POQty[];
  fabricBOM: FabricBOM[];
  accessoriesBOM: AccessoriesBOM[];
}

export interface OrderCreateResponse {
  id: number;
  uniqueId: string;
  buyer: string;
  styleNo: string;
  // etc... depending on what your backend returns
}

export interface OrderListPayload {
  // define your filters, pagination, etc.
  page: number;
  pageSize: number;
  search?: string;
}

export interface OrderListResponse {
  orders: OrderCreateResponse[];
  totalCount: number;
}



interface PoQty {
  combo: string;
  proColor: string;
  fabricQuality: string;
  supplier: string;
  preemie: number;
  nb: number;
  totalQty: number;
  articles: Article[];
}


export interface OrderResponse {
  uniqueId: string;
  date: string;
  buyer: string;
  styleNo: string;
  brand: string;
  season: string;
  ageGroup: string;
  shipmentDate: string;
  pattern: string;
  printing: string;
  steps: string;
  deadlineDate: string;
  remark: string;
  documents: any[];
  poQty: PoQty[];
  fabricBOM: FabricBOM[];
  accessoriesBOM: AccessoriesBOM[];
}
