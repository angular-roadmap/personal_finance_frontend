// Common API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
}

// Pagination response
export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// Category DTOs
export interface CategoryDTO {
  id: number;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface CategoryCreateRequest {
  name: string;
  description?: string;
}

// Expense DTOs
export interface ExpenseDTO {
  id: number;
  categoryId: number;
  categoryName: string;
  description: string;
  amount: number;
  date: string;
  username: string;
}

export interface ExpenseCreateRequest {
  categoryId: number;
  description: string;
  amount: number;
  date: string;
}

// Statistics DTO
export interface CategorySum {
  categoryName: string;
  total: number;
}

// Auth DTOs
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
}

export interface UserDTO {
  id: number;
  username: string;
  roleName: string;
}
