export const smoothScroll = (targetId: string) => {
    const target = document.querySelector(targetId)
    if (target) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - 100, // 100px offset for header
        behavior: 'smooth'
      })
    }
  }