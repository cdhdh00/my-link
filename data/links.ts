export interface Link {
  id: string
  title: string
  url: string
  icon?: string
  clicks?: number
}

export const dummyLinks: Link[] = [
  {
    id: "1",
    title: "인스타그램",
    url: "https://instagram.com/your_username",
    icon: "https://www.google.com/s2/favicons?domain=instagram.com&sz=64",
  },
  {
    id: "2",
    title: "유튜브",
    url: "https://youtube.com/c/your_channel",
    icon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=64",
  },
  {
    id: "3",
    title: "블로그",
    url: "https://yourblog.com",
    icon: "https://www.google.com/s2/favicons?domain=yourblog.com&sz=64",
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com/your_username",
    icon: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "https://yourportfolio.com",
    icon: "https://www.google.com/s2/favicons?domain=yourportfolio.com&sz=64",
  },
]
