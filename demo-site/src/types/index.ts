export interface Slide {
  id: string
  title: string
  level: number
  content: string
  children: Slide[]
}

export interface Presentation {
  title: string
  slides: Slide[]
  currentSlide: number
  totalSlides: number
}

export interface DemoState {
  presentation: Presentation | null
  isFullscreen: boolean
  theme: 'light' | 'dark'
  isLoading: boolean
}