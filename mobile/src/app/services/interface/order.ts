export interface OrderListPayload {
    max: number;
    current: number;
  }
  
  export interface Order {
    id: number;
    unique_id: string;
    order_date: string;
    buyer: string;
    style_no: string;
    brand: string;
    season: string;
    age_group_id: number;
    shipment_date: string;
    pattern: string;
    printing: string;
    documents: string;
    steps_required: string;
    remark: string;
    deadline_date: string;
  }
  
  export interface OrderListResponse {
    total: number;
    users: Order[];
  }
  
  export interface OrderCreatePayload {
    unique_id: string;
    order_date: string;
    buyer: string;
    style_no: string;
    brand: string;
    season: string;
    age_group_id: number;
    shipment_date: string;
    pattern: string;
    printing: string;
    documents: string;
    steps_required: string;
    remark: string;
    deadline_date: string;
  }
  
  export interface OrderCreateResponse {
    id: number;
    message: string;
  }
  