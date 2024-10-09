export interface IdeaRequest
{
    title:string
    description:string
    User?: {username:string}
    like?:number
    dislike?:number
    createdAt?:Date
    id?:number
    numberOfComments?:number
}