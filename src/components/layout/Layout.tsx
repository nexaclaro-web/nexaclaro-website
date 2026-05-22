import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { usePageSeo } from '../../hooks/usePageSeo'

export function Layout() {
  const { pathname } = useLocation()

  usePageSeo(pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = ''
  }, [pathname])

  useEffect(() => {
    void import('three')
    void import('@react-three/fiber')
  }, [])

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'fetch'
    link.href = '/assets/platform-demo.webm'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
    return () => link.remove()
  }, [])

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
