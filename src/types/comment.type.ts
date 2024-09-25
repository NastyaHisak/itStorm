import {ActionsType} from "./actions.type";

export type CommentType = {
  allCount: number,
  comments: Array<CommentArrayType>
}

export type CommentArrayType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  user: {
    id: string,
    name: string
  },
  action?: string,
}



