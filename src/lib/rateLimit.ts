
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 requests per minute
  analytics: true,
})

export async function checkRateLimit() {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1'
    
    const result = await ratelimit.limit(ip)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.reset).toISOString(),
          }
        }
      )
    }
    return null
  } catch (error) {
    console.error('Rate limit error:', error)
    return null
  }
}
