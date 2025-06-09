export interface ApiResponse<T> {
    status: number;
    message: string;
    body: T;
    error_code: number;
}
