import type { PostItem, SwapItem } from "@/app/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API || "https://liwedoc.vercel.app/"

export async function getAllItems(): Promise<PostItem[]> {
  try {
    console.log(`Fetching posts from: ${API_BASE_URL}items`)
    const response = await fetch(`${API_BASE_URL}items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()
    console.log(`Successfully fetched ${Array.isArray(data) ? data.length : "unknown"} posts`)

    // Handle different possible response structures
    if (Array.isArray(data)) {
      return data
    } else if (data && typeof data === "object") {
      if (data.items && Array.isArray(data.items)) {
        return data.items
      } else if (data.data && Array.isArray(data.data)) {
        return data.data
      } else if (data.results && Array.isArray(data.results)) {
        return data.results
      }
    }

    return []
  } catch (error) {
    console.error("Error fetching items:", error)
    return []
  }
}

export async function getAllSwaps(): Promise<SwapItem[]> {
  try {
    console.log(`Fetching swaps from: ${API_BASE_URL}swaped`)
    const response = await fetch(`${API_BASE_URL}swaped`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Failed to fetch swaps: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()
    console.log(`Successfully fetched ${Array.isArray(data) ? data.length : "unknown"} swaps`)

    // Handle different possible response structures
    if (Array.isArray(data)) {
      return data
    } else if (data && typeof data === "object") {
      if (data.swaps && Array.isArray(data.swaps)) {
        return data.swaps
      } else if (data.data && Array.isArray(data.data)) {
        return data.data
      } else if (data.results && Array.isArray(data.results)) {
        return data.results
      } else if (data.items && Array.isArray(data.items)) {
        return data.items
      }
    }

    return []
  } catch (error) {
    console.error("Error fetching swaps:", error)
    return []
  }
}

export async function deleteItem(id: number): Promise<boolean> {
  try {
    console.log(`Attempting to delete post with ID: ${id}`)

    const response = await fetch(`${API_BASE_URL}api/deleteitem/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    console.log(`Delete post response status: ${response.status}`)

    if (response.ok) {
      console.log(`Successfully deleted post ${id}`)
      return true
    } else {
      const errorText = await response.text()
      console.error(`Delete post failed: ${response.status} - ${errorText}`)
      throw new Error(`Delete failed: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error deleting post:", error)
    throw error
  }
}

export async function deleteSwap(id: number): Promise<boolean> {
  try {
    console.log(`Attempting to delete swap with ID: ${id}`)

    const response = await fetch(`${API_BASE_URL}api/items/swapped/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    console.log(`Delete swap response status: ${response.status}`)

    if (response.ok) {
      console.log(`Successfully deleted swap ${id}`)
      return true
    } else {
      const errorText = await response.text()
      console.error(`Delete swap failed: ${response.status} - ${errorText}`)
      throw new Error(`Delete failed: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error deleting swap:", error)
    throw error
  }
}

export async function getItemById(id: number): Promise<PostItem | null> {
  try {
    const response = await fetch(`${API_BASE_URL}items/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching item by ID:", error)
    return null
  }
}

export async function getSwapById(id: number): Promise<SwapItem | null> {
  try {
    const response = await fetch(`${API_BASE_URL}swaped/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching swap by ID:", error)
    return null
  }
}
