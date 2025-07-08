export interface PaginateQuery {
  page?: string
  per_page?: string
  date?: Date
}

export interface PaginatedResponse {
  currentPage?: number
  perPage?: number
  total?: number
  lastPage?: number
  prev?: number | null
  next?: number | null
}

export interface ResponseInterface<T> {
  data: T[]
}
