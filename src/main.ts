import './style.css'
import {throttle} from 'lodash'

const runApp = () => {
  const app = document.querySelector('#app')
  const slides = app?.querySelector('.slides')
  
  const effectDuration = 300

  // const activeSlide = 0

  const triggerEffect = () => {
    slides?.classList.add('is-scrolling')
    setTimeout(() => { slides?.classList.remove('is-scrolling') }, effectDuration)
  }

  const goToNext = (isReverse: boolean = false, behavior: ScrollBehavior = 'smooth') => {
    // TODO: set hard breakpoints instead of scrollY
    const { scrollY: y, innerHeight: h } = window
    const top = isReverse ? y - h : y + h
    
    // TODO: Filter if it's not firstSlide or lastSlide
    triggerEffect()
    window.scroll({ top, behavior })
  }

  const animate = (event: KeyboardEvent) => {
    const { code, type } = event
    const keysToDisable = ['ArrowUp', 'ArrowDown']

    // TODO: Fix
    type === 'scroll' && event.preventDefault()
    keysToDisable.includes(code) && event.preventDefault()

    code === 'KeyA' && goToNext(true)
    code === 'KeyS' && goToNext()
    code === 'ArrowUp' && goToNext(true)
    code === 'ArrowDown' && goToNext()
  }

  const throttledAnimate = throttle(animate, effectDuration);
  window.onkeydown = throttledAnimate
  window.onscroll = throttledAnimate
}


window.onload = runApp