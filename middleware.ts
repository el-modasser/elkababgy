import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const { pathname, search } = url

    // Skip Next.js internal paths and static files
    if (pathname.startsWith('/_next') ||
        pathname.includes('.') || // static files with extensions
        pathname.startsWith('/api')) {
        return NextResponse.next()
    }

    // If not root path, rewrite to root while preserving query params
    if (pathname !== '/') {
        // Create a new URL that goes to root but keeps query params
        const newUrl = new URL('/', request.url)
        newUrl.search = search // preserve query params like ?order=true

        // Use rewrite instead of redirect to keep URL in browser
        return NextResponse.rewrite(newUrl)
    }

    return NextResponse.next()
}