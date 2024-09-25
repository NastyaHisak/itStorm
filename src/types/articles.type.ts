export type ArticlesType = {
  count: number,
  pages: number,
  items: Array<ArticlesArrayType>
}

export type ArticlesArrayType = {
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string,
}
