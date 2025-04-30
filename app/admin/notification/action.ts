"use server"

import { revalidatePath } from "next/cache"
// import { sendEmail } from "@/lib/email"
import { sendEmail } from "./email"
import fetcher from "@/shared/fecher"

// Submit a new advertisement
export async function submitAdvertisement(formData: FormData) {
  try {
    const response = await fetcher('/advertisements')

    if (!response.ok) {
      const error = await response.data
      // throw new Error(error.message || "Failed to submit advertisement")
    }

    const data = await response.data

    // Notify managers about the new advertisement
    await notifyManagers(data)

    // Revalidate the advertisements page
    revalidatePath("/admin/advertisements")
    revalidatePath("/admin/dashboard")

    return data
  } catch (error) {
    console.error("Error submitting advertisement:", error)
    throw error
  }
}

// Approve an advertisement
export async function approveAdvertisement(id: string) {
  try {
    const response = await fetcher(`/advertisements/${id}/approve`)
     

    if (!response.ok) {
      const error = await response.data
      // throw new Error(error.message || "Failed to approve advertisement")
    }

    const data = await response.data

    // Send approval email to the advertiser
    await sendApprovalEmail(data)

    // Revalidate the advertisements pages
    revalidatePath("/admin/advertisements")
    revalidatePath("/admin/dashboard")
    revalidatePath("/")

    return data
  } catch (error) {
    console.error("Error approving advertisement:", error)
    throw error
  }
}
// notification/action.ts

// Get a single advertisement by ID
export async function getAdvertisementById(id: string) {
  try {
    const response = await fetch(`/advertisements/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch advertisement");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    throw error;
  }
}
// Get all advertisements
export async function getAdvertisements() {
  try {
    const response = await fetcher(`/advertisements`)

    if (!response.ok) {
      const error = await response.data
      // throw new Error(error.message || "Failed to fetch advertisements")
    }

    return response.data
  } catch (error) {
    console.error("Error fetching advertisements:", error)
    throw error
  }
}

// Get approved advertisements
export async function getApprovedAdvertisements() {
  try {
    const response = await fetcher(`/advertisements/approved`)

    if (!response.ok) {
      const error = await response.data
      // throw new Error(error.message || "Failed to fetch approved advertisements")
    }

    return response.data
  } catch (error) {
    console.error("Error fetching approved advertisements:", error)
    throw error
  }
}

// Get pending advertisements (not approved)
export async function getPendingAdvertisements() {
  try {
    const allAds = await getAdvertisements()
    if(allAds){
    return allAds.filter((ad: any) => !ad.approved)
    }
  } catch (error) {
    console.error("Error fetching pending advertisements:", error)
    throw error
  }
}

// Get notifications for the manager
export async function getManagerNotifications() {
  try {
    // Get pending advertisements as notifications
    const pendingAds = await getPendingAdvertisements()

    // Format them as notifications
    if(pendingAds){
    return pendingAds.map((ad: any) => ({
      id: ad.id,
      title: "New advertisement submission",
      message: `${ad.company_name} submitted a new advertisement`,
      time: formatTimeAgo(new Date(ad.created_at || Date.now())),
      type: "advertisement",
      data: ad,
      read: false,
    
    }))}
  } catch (error) {
    console.error("Error fetching manager notifications:", error)
    throw error
  }
}

// Helper function to notify managers about new advertisements
async function notifyManagers(advertisement: any) {
  try {
    // In a real application, you would fetch manager emails from a database
    const managerEmails = ["manager@example.com"]

    // Send email to each manager
    for (const email of managerEmails) {
      await sendEmail({
        to: email,
        subject: "New Advertisement Submission",
        text: `A new advertisement has been submitted by ${advertisement.company_name}. Please review it in the admin dashboard.`,
        html: `
          <h1>New Advertisement Submission</h1>
          <p>A new advertisement has been submitted by <strong>${advertisement.company_name}</strong>.</p>
          <p>Please review it in the <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/advertisements">admin dashboard</a>.</p>
        `,
      })
    }
  } catch (error) {
    console.error("Error notifying managers:", error)
  }
}

// Helper function to send approval email to advertiser
async function sendApprovalEmail(advertisement: any) {
  try {
    await sendEmail({
      to: advertisement.email,
      subject: "Your Advertisement Has Been Approved",
      text: `Your advertisement for ${advertisement.company_name} has been approved and is now live on our platform.`,
      html: `
        <h1>Advertisement Approved</h1>
        <p>Your advertisement for <strong>${advertisement.company_name}</strong> has been approved and is now live on our platform.</p>
        <p>You can view it on our <a href="${process.env.NEXT_PUBLIC_APP_URL}">homepage</a>.</p>
      `,
    })
  } catch (error) {
    console.error("Error sending approval email:", error)
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
}
