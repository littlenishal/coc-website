
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const WINDOW_SIZE_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 30 // 30 requests per minute

export async function checkRateLimit() {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1'
    const now = Date.now()

    // Clean up expired entries
    for (const [key, value] of rateLimit.entries()) {
      if (now > value.resetTime) {
        rateLimit.delete(key)
      }
    }

    const record = rateLimit.get(ip)
    if (!record) {
      // First request from this IP
      rateLimit.set(ip, {
        count: 1,
        resetTime: now + WINDOW_SIZE_MS
      })
      return null
    }

    if (now > record.resetTime) {
      // Window expired, reset counter
      rateLimit.set(ip, {
        count: 1,
        resetTime: now + WINDOW_SIZE_MS
      })
      return null
    }

    if (record.count >= MAX_REQUESTS) {
      // Rate limit exceeded
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
          }
        }
      )
    }

    // Increment counter
    record.count++
    return null
  } catch (error) {
    console.error('Rate limit error:', error)
    return null
  }
}
