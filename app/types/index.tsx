export interface PostItem {
  id: number
  title: string
  description: string
  category: string
  subcategory: string
  condition: string
  price: string
  city: string
  subcity: string
  phone: string
  email: string
  preferred_contact_method: string
  user_id: number
  status: string
  createdat: string
  updatedat: string
}

export interface SwapItem {
  id: number
  title: string
  description: string
  category: string
  subcategory: string
  condition: string
  price: string
  city: string
  subcity: string
  phone: string
  email: string
  preferred_contact_method: string
  user_id: number
  status: string
  createdat: string
  updatedat: string
}

// Legacy types for backward compatibility
export interface Post {
  id: string
  title: string
  content: string
  author: string
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
  tags: string[]
  featuredImage?: string
}

export interface Swap {
  id: string
  title: string
  description: string
  offeredItem: string
  requestedItem: string
  category: string
  condition: "new" | "like-new" | "good" | "fair" | "poor"
  location: string
  userId: string
  userName: string
  status: "active" | "completed" | "cancelled"
  createdAt: string
  images: string[]
}
